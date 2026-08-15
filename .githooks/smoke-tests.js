/* Smoke-tests Kaleysur — valide les calculs purs extraits des HTML (version indexée git).
   Exécuté par le hook pre-commit : un échec bloque le commit.
   Les fonctions sont extraites du source par scan d'accolades équilibrées :
   si un marqueur devient introuvable après un refactor, le test échoue bruyamment
   → mettre à jour le marqueur ici.
   N.B. pas de 'use strict' : on dépend du mode sloppy pour que les déclarations
   de fonctions faites dans eval() fuient vers la portée du module. */
const { execSync } = require('child_process');

function staged(file) {
  return execSync(`git show :"${file}"`, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
}

/* Extrait un bloc depuis `marker` jusqu'à la fermeture équilibrée de la première
   accolade/crochet rencontré. Suffisant pour les fonctions de calcul ciblées
   (aucune ne contient de { } ou [ ] dans des littéraux de chaîne). */
function extract(src, marker) {
  const start = src.indexOf(marker);
  if (start === -1) throw new Error(`Marqueur introuvable : "${marker}"`);
  let i = start;
  while (i < src.length && src[i] !== '{' && src[i] !== '[') i++;
  const open = src[i], close = open === '{' ? '}' : ']';
  let depth = 0;
  for (; i < src.length; i++) {
    if (src[i] === open) depth++;
    else if (src[i] === close) { depth--; if (depth === 0) return src.slice(start, i + 1) + ';'; }
  }
  throw new Error(`Bloc non fermé pour : "${marker}"`);
}

const failures = [];
let assertions = 0;
function eq(actual, expected, label) {
  assertions++;
  const a = JSON.stringify(actual), e = JSON.stringify(expected);
  if (a !== e) failures.push(`${label} : attendu ${e}, obtenu ${a}`);
}
function ok(cond, label) {
  assertions++;
  if (!cond) failures.push(label);
}

/* ══════════ joueurs.html + js/rules-2024.js ══════════ */
{
  const J = staged('joueurs.html');
  const R = staged('js/rules-2024.js'); // données de règles extraites
  const window = {};
  eval([
    extract(J, 'function mod(score)'),
    extract(J, 'function pb(niveau)'),
    extract(J, 'function esc(val)'),
    extract(J, 'function getClasses(c)'),
    extract(J, 'function getTotalLevel(c)'),
    extract(R, 'const MULTICLASS_SLOTS'),
    extract(J, 'function computeMulticlassSlots(c)'),
    extract(J, 'window.rollDiceExpr = function'),
  ].join('\n'));
  const rollDiceExpr = window.rollDiceExpr;

  // Bonus de maîtrise (table D&D : 1-4 → +2 … 17-20 → +6)
  [[1,2],[4,2],[5,3],[8,3],[9,4],[12,4],[13,5],[16,5],[17,6],[20,6]]
    .forEach(([n, p]) => eq(pb(n), p, `pb(${n})`));

  // Modificateur de caractéristique
  [[1,-5],[8,-1],[10,0],[11,0],[15,2],[16,3],[20,5],[30,10]]
    .forEach(([s, m]) => eq(mod(s), m, `mod(${s})`));

  // Échappement HTML
  eq(esc('<b "x">&'), '&lt;b &quot;x&quot;&gt;&amp;', 'esc(html)');
  eq(esc(null), '', 'esc(null)');

  // Niveau total multiclasse
  eq(getTotalLevel({ classes: [{ niveau: 3 }, { niveau: '2' }] }), 5, 'getTotalLevel multiclasse');
  eq(getTotalLevel({ niveau: 7 }), 7, 'getTotalLevel legacy');
  eq(getTotalLevel({}), 1, 'getTotalLevel vide');

  // Emplacements de sorts multiclasse (PHB)
  eq(computeMulticlassSlots({ classes: [{ classe: 'Wizard', niveau: 5 }] }),
     [4,3,2,0,0,0,0,0,0], 'slots Wizard 5');
  eq(computeMulticlassSlots({ classes: [{ classe: 'Paladin', niveau: 4 }, { classe: 'Wizard', niveau: 3 }] }),
     [4,3,2,0,0,0,0,0,0], 'slots Paladin4+Wizard3 (eff.5)');
  eq(computeMulticlassSlots({ classes: [{ classe: 'Fighter', niveau: 5 }] }), null, 'slots Fighter (aucun)');
  eq(computeMulticlassSlots({ classes: [{ classe: 'Warlock', niveau: 5 }] }), null, 'slots Warlock (pact magic exclu)');

  // Parseur d'expressions de dés — bornes sur 200 tirages
  for (let k = 0; k < 200; k++) {
    const r = rollDiceExpr('2d6+3');
    ok(r.total >= 5 && r.total <= 15, `rollDiceExpr 2d6+3 hors bornes (${r.total})`);
    if (r.total < 5 || r.total > 15) break;
  }
  ok((() => { const r = rollDiceExpr('d20'); return r.total >= 1 && r.total <= 20; })(), 'rollDiceExpr d20 bornes');
  eq(rollDiceExpr('+3').total, 3, 'rollDiceExpr constante');
  ok(rollDiceExpr('2d6-1').total >= 1, 'rollDiceExpr malus');

  /* ── Cohérence des données de règles 2024 ──
     Les const d'un eval direct ne fuient pas vers la portée appelante :
     on les récupère via une IIFE qui les renvoie. */
  // Le fichier de règles est du JS valide complet : on l'exécute en entier plutôt
  // que d'extraire bloc par bloc (les accolades dans les descriptions piègent le scan).
  const { CLASS_DATA, SPECIES_DATA, BACKGROUND_DATA, GENERAL_FEATS, ORIGIN_FEATS,
          STARTING_EQUIP, DND_CLASSES, SUBCLASS_DATA, PREPARED_SPELLS } =
    new Function(R + '; return { CLASS_DATA, SPECIES_DATA, BACKGROUND_DATA, GENERAL_FEATS,'
      + ' ORIGIN_FEATS, STARTING_EQUIP, DND_CLASSES, SUBCLASS_DATA, PREPARED_SPELLS };')();
  const SKILL_KEYS = extract(J, 'const SKILLS = [')
    .match(/key:'([a-z]+)'/g).map(s => s.slice(5, -1));

  // Toutes les classes choisissent leur sous-classe au niveau 3 (PHB 2024)
  Object.entries(CLASS_DATA).forEach(([cls, d]) => {
    const first = Object.entries(d.features)
      .filter(([, fs]) => fs.some(f => f.type === 'subclass'))
      .map(([l]) => +l).sort((a, b) => a - b)[0];
    eq(first, 3, `${cls} : sous-classe au niveau 3`);
    ok(Array.isArray(d.saves) && d.saves.length === 2, `${cls} : 2 jets de sauvegarde`);
    ok(!!DND_CLASSES[cls], `${cls} : présent dans DND_CLASSES (dé de vie)`);
    // Compétences de classe : quota cohérent et clés valides
    ok(d.skillChoices >= 2 && d.skillChoices <= 4, `${cls} : quota de compétences (${d.skillChoices})`);
    ok(Array.isArray(d.skillList) && d.skillList.length >= d.skillChoices,
       `${cls} : liste de compétences au moins aussi grande que le quota`);
    (d.skillList || []).forEach(k =>
      ok(SKILL_KEYS.includes(k), `${cls} : compétence « ${k} » inconnue`));
    eq(new Set(d.skillList).size, (d.skillList || []).length, `${cls} : pas de doublon de compétence`);
  });

  // Backgrounds : clés de compétences valides + origin feat documenté
  Object.entries(BACKGROUND_DATA).forEach(([bg, d]) => {
    eq(d.abilities.length, 3, `${bg} : 3 caractéristiques`);
    ok(!!ORIGIN_FEATS[d.feat], `${bg} : origin feat « ${d.feat} » documenté`);
    (d.skillKeys || []).forEach(k =>
      ok(SKILL_KEYS.includes(k), `${bg} : clé de compétence « ${k} » inconnue`));
    eq((d.skillKeys || []).length, 2, `${bg} : 2 compétences`);
  });

  // Espèces : vitesse et traits de base présents ; lignées non vides
  Object.entries(SPECIES_DATA).forEach(([sp, d]) => {
    ok(typeof d.speed === 'number' && d.speed > 0, `${sp} : vitesse définie`);
    ok(Array.isArray(d.traits[1]) && d.traits[1].length > 0, `${sp} : traits de niveau 1`);
    Object.entries(d.lineages || {}).forEach(([ln, lv]) =>
      ok(Array.isArray(lv[1]) && lv[1].length > 0, `${sp}/${ln} : trait de niveau 1`));
  });

  // Feats généraux : description non vide
  Object.entries(GENERAL_FEATS).forEach(([f, d]) =>
    ok(typeof d.desc === 'string' && d.desc.length > 20, `feat « ${f} » : description`));

  // Équipement de départ : au moins une option par classe jouable
  Object.entries(STARTING_EQUIP).forEach(([cls, opts]) => {
    ok(opts.length >= 1, `${cls} : option d'équipement`);
    opts.forEach(o => ok(typeof o.gold === 'number', `${cls}/${o.label} : bourse`));
  });

  // Sorts préparés : 20 niveaux, croissance monotone, classe connue
  Object.entries(PREPARED_SPELLS).forEach(([cls, table]) => {
    ok(!!CLASS_DATA[cls], `PREPARED_SPELLS : « ${cls} » n'est pas une classe connue`);
    eq(table.length, 20, `${cls} : table de sorts préparés sur 20 niveaux`);
    table.forEach((n, i) => {
      ok(Number.isInteger(n) && n > 0, `${cls} niv.${i + 1} : valeur invalide (${n})`);
      if (i > 0) ok(n >= table[i - 1], `${cls} niv.${i + 1} : la table doit croître (${table[i-1]} → ${n})`);
    });
  });
  // Tout lanceur (présent dans DND_CLASSES avec une caractéristique d'incantation)
  // doit avoir une table de préparation — sinon le compteur disparaît en silence.
  Object.entries(DND_CLASSES).forEach(([cls, info]) => {
    if (info.sort) ok(!!PREPARED_SPELLS[cls], `${cls} : lanceur sans table de sorts préparés`);
  });

  // Sous-classes : structure SUBCLASS_DATA[classe][sous-classe][niveau] = [features].
  // Attrape une sous-classe mal imbriquée (elle apparaîtrait comme une fausse classe).
  Object.entries(SUBCLASS_DATA).forEach(([cls, subs]) => {
    ok(!!CLASS_DATA[cls], `SUBCLASS_DATA : « ${cls} » n'est pas une classe connue`);
    Object.entries(subs).forEach(([sub, byLevel]) => {
      if (/^\d+$/.test(sub)) {
        // Un nom de sous-classe numérique = un niveau d'imbrication perdu
        ok(false, `${cls} : « ${sub} » est un niveau, pas une sous-classe — imbrication cassée`);
        return;
      }
      Object.entries(byLevel).forEach(([lvl, feats]) => {
        ok(/^\d+$/.test(lvl) && +lvl >= 1 && +lvl <= 20, `${cls}/${sub} : niveau « ${lvl} » invalide`);
        if (!Array.isArray(feats)) { ok(false, `${cls}/${sub} niv.${lvl} : liste de capacités attendue`); return; }
        ok(feats.length > 0, `${cls}/${sub} niv.${lvl} : liste non vide`);
        feats.forEach(f => ok(f && f.name && f.desc, `${cls}/${sub} niv.${lvl} : nom + description`));
      });
    });
  });
}

/* ══════════ dm.html ══════════ */
{
  const D = staged('dm.html');
  eval([
    extract(D, 'const DM_SKILLS'),
    extract(D, 'const DM_SAVES'),
    extract(D, 'function dmMod(score)'),
    extract(D, 'function dmFmt(n)'),
    extract(D, 'function dmCalc(c)'),
  ].join('\n'));

  // Rogue niv 5 : DEX 16, SAG 13, expertise Perception, prof Discrétion, save DEX
  const rogue = { niveau: 5, for: 8, dex: 16, con: 14, int: 13, sag: 13, cha: 10,
                  saveDex: true, perception: 2, discret: 1 };
  const dc = dmCalc(rogue);
  eq(dc.pb, 3, 'dmCalc PB niv5');
  eq(dc.passivePerc, 17, 'dmCalc perception passive (10 + mod SAG 1 + expertise 6)');
  eq(dc.save({ key: 'saveDex', attr: 'dex' }), { prof: true, val: 6 }, 'dmCalc save DEX maîtrisé');
  eq(dc.save({ key: 'saveFor', attr: 'for' }), { prof: false, val: -1 }, 'dmCalc save FOR');
  const stealth = dc.profSkills.find(x => x.sk.key === 'discret');
  eq(stealth && stealth.val, 6, 'dmCalc Stealth +6');
  const perc = dc.profSkills.find(x => x.sk.key === 'perception');
  eq(perc && perc.prof, 2, 'dmCalc Perception expertise');

  // Multiclasse + Jack of All Trades
  eq(dmCalc({ classes: [{ niveau: 3 }, { niveau: 2 }] }).totalLevel, 5, 'dmCalc niveau total multiclasse');
  const bard = dmCalc({ niveau: 4, dex: 10, jackOfAllTrades: true });
  eq(bard.skill({ key: 'acrobaties', attr: 'dex' }).val, 1, 'dmCalc Jack of All Trades (demi-PB)');

  eq(dmFmt(3), '+3', 'dmFmt positif');
  eq(dmFmt(-1), '-1', 'dmFmt négatif');
  eq(dmMod(14), 2, 'dmMod');
}

/* ══════════ Verdict ══════════ */
if (failures.length) {
  console.error(`✗ Smoke-tests : ${failures.length} échec(s) sur ${assertions} assertions`);
  failures.forEach(f => console.error('  • ' + f));
  process.exit(1);
}
console.log(`✓ Smoke-tests OK (${assertions} assertions)`);
