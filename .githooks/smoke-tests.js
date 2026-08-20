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
    extract(R, 'const STARTING_ARMOR'),
    extract(R, 'const STARTING_WEAPONS'),
    extract(R, 'const STARTING_SPELLS'),
    extract(R, 'const PREPARED_SPELLS'),
    extract(R, 'const CLASS_DATA'),
    extract(R, 'const SUBCLASS_DATA'),
    extract(R, 'const SPECIES_DATA'),
    extract(R, 'const DND_CLASSES'),
    extract(R, 'const ASI_LEVELS'),
    extract(R, 'const GENERAL_FEATS'),
    extract(R, 'const CLASS_RESOURCES'),
    extract(R, 'const MULTICLASS_PREREQ'),
    extract(J, 'function syncClassesToLegacy(c)'),
    extract(J, 'function abilKeysFromFeat(abilStr)'),
    extract(J, 'function preparedTotal(c)'),
    extract(J, 'function multiclassPrereqCheck(c, className)'),
    extract(R, 'const CANTRIPS_KNOWN'),
    extract(R, 'const FEATURE_CHOICES'),
    extract(J, 'function featureOptions(featureName, className)'),
    extract(J, 'function featureChoicesAt(className, subclassName, level)'),
    extract(J, 'function getFeatureChoice(c, featureName)'),
    extract(J, 'function setFeatureChoice(c, featureName, className, selection)'),
    extract(J, 'function pendingFeatureChoices(c)'),
    extract(J, 'function cantripsAt(className, level)'),
    extract(J, 'function expertiseAt(className, level)'),
    extract(J, 'function topSlotLevel(slots)'),
    extract(J, 'function planLevelUp(c, className)'),
    extract(J, 'function applyLevelUp(c, plan, choices)'),
    extract(J, 'function applyStartingGear(c, className, items)'),
    extract(J, 'function startingMaxHp(c, hitDie, speciesEffects)'),
    extract(J, 'function startingSpellHint(className)'),
    extract(J, 'const SIZE_CARRY_MULT'),
    extract(J, 'function carryCapacity(c)'),
    extract(J, 'function coinWeight(currency)'),
    extract(J, 'function inventoryWeight(inv)'),
    extract(J, 'const ARMOR_PRESETS'),
    extract(J, 'function isShieldItem(item)'),
    extract(J, 'function armorFromItem(item)'),
    extract(J, 'function isEquippable(item)'),
    extract(J, 'function defaultArmorConfig(c)'),
    extract(J, 'function equippedArmorMismatch(c, inv)'),
    extract(J, 'const ATTUNE_MAX'),
    extract(J, 'function isAttunable(item)'),
    extract(J, 'function attunedItems(inv)'),
    extract(J, 'function migrateAttunement(inv)'),
    extract(J, 'function isProficientWith(c, weaponCat)'),
    extract(J, 'function attackFromItem(item, c)'),
    extract(J, 'function syncAttackForItem(c, item, equipped)'),
    extract(J, 'const COIN_RATE'),
    extract(J, 'function purseValue(currency)'),
    extract(J, 'function itemsValue(items)'),
    extract(J, 'function fmtGp(v)'),
    extract(J, 'function searchNotes(pages, query)'),
    extract(J, 'function diffNotes(local, distant)'),
    extract(J, 'function buildWikiIndex(entries)'),
    extract(J, 'function renderNoteMarkdown(texte, wikiIndex)'),
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
          STARTING_EQUIP, DND_CLASSES, SUBCLASS_DATA, PREPARED_SPELLS, SPELL_PREP_STYLE,
          STARTING_SPELLS, LANGUAGES, TOOL_CHOICES, MULTICLASS_PREREQ, STARTING_ARMOR,
          FEATURE_CHOICES } =
    new Function(R + '; return { CLASS_DATA, SPECIES_DATA, BACKGROUND_DATA, GENERAL_FEATS,'
      + ' ORIGIN_FEATS, STARTING_EQUIP, DND_CLASSES, SUBCLASS_DATA, PREPARED_SPELLS,'
      + ' STARTING_SPELLS, LANGUAGES, TOOL_CHOICES, MULTICLASS_PREREQ, STARTING_ARMOR,'
      + ' FEATURE_CHOICES,'
      + ' SPELL_PREP_STYLE };')();
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
  const CREATURE_TYPES = ['Humanoid','Aberration','Construct','Elemental','Fey','Giant','Undead'];
  Object.entries(SPECIES_DATA).forEach(([sp, d]) => {
    ok(typeof d.speed === 'number' && d.speed > 0, `${sp} : vitesse définie`);
    ok(typeof d.size === 'string' && d.size.length > 0, `${sp} : taille définie`);
    // Le type conditionne les sorts qui ciblent les Humanoïdes : jamais implicite
    ok(CREATURE_TYPES.includes(d.type), `${sp} : type de créature manquant ou inconnu (${d.type})`);
    ok(Array.isArray(d.traits[1]) && d.traits[1].length > 0, `${sp} : traits de niveau 1`);
    Object.values(d.traits).flat().forEach(t =>
      ok(t.name && typeof t.desc === 'string' && t.desc.length > 15, `${sp}/${t.name} : description trop courte`));
    Object.entries(d.lineages || {}).forEach(([ln, lv]) =>
      ok(Array.isArray(lv[1]) && lv[1].length > 0, `${sp}/${ln} : trait de niveau 1`));
  });
  // Kalashtar (Eberron: Forge of the Artificer) — la seule Aberration jouable
  {
    const k = SPECIES_DATA.Kalashtar;
    ok(!!k, 'Kalashtar présent');
    eq(k.type, 'Aberration', 'Kalashtar : Aberration, pas Humanoïde');
    eq(k.speed, 30, 'Kalashtar : 30 ft');
    eq(k.effects.telepathyPerLevel, 10, 'Kalashtar : télépathie 10 ft/niveau');
    ['Dual Mind','Mental Discipline','Mind Link','Severed from Dreams'].forEach(t =>
      ok(k.traits[1].some(x => x.name === t), `Kalashtar : trait « ${t} »`));
    eq(k.traits[1].length, 4, 'Kalashtar : 4 traits, pas un de plus');
    ok(!k.lineages, 'Kalashtar : aucune lignée');
  }
  eq(Object.values(SPECIES_DATA).filter(d => d.type !== 'Humanoid').length, 1,
     'une seule espèce non-Humanoïde pour l\'instant');

  // Feats généraux : description non vide
  Object.entries(GENERAL_FEATS).forEach(([f, d]) =>
    ok(typeof d.desc === 'string' && d.desc.length > 20, `feat « ${f} » : description`));

  // Équipement de départ : au moins une option par classe jouable
  Object.entries(STARTING_EQUIP).forEach(([cls, opts]) => {
    ok(opts.length >= 1, `${cls} : option d'équipement`);
    opts.forEach(o => ok(typeof o.gold === 'number', `${cls}/${o.label} : bourse`));
  });
  // Aucune classe ne doit sortir du créateur les mains vides (l'Artificier l'était)
  Object.keys(CLASS_DATA).forEach(cls =>
    ok(!!STARTING_EQUIP[cls], `${cls} : aucun équipement de départ — le créateur laisse la fiche vide`));

  /* ── Équipement de départ → CA et attaques (applyStartingGear) ── */
  const gear = (cls, optIdx, abils) => {
    const c = Object.assign({ for:15, dex:14, con:13, int:12, sag:10, cha:8 }, abils);
    applyStartingGear(c, cls, STARTING_EQUIP[cls][optIdx].items);
    return c;
  };
  // Toute option A doit produire au moins une attaque : sinon un nom d'arme a changé
  // dans STARTING_EQUIP sans être répercuté dans STARTING_WEAPONS.
  Object.keys(STARTING_EQUIP).forEach(cls => {
    const c = gear(cls, 0);
    ok((c.attaques || []).length >= 1, `${cls} option A : aucune arme reconnue`);
    (c.attaques || []).forEach(a => {
      ok(/^\d+d\d+([+-]\d+)?$/.test(a.degats), `${cls}/${a.name} : dégâts mal formés (${a.degats})`);
      ok(['for','dex'].includes(a.atkType), `${cls}/${a.name} : atkType invalide (${a.atkType})`);
      ok(a.prof === true, `${cls}/${a.name} : maîtrise attendue`);
    });
  });
  // Armures : le mode doit correspondre à l'armure reçue
  eq(gear('Cleric', 0).armorConfig.mode, 'medium', 'Clerc : chemise de mailles = intermédiaire');
  eq(gear('Cleric', 0).armorConfig.baseAC, 13, 'Clerc : CA de base 13');
  eq(gear('Cleric', 0).armorConfig.shield, true, 'Clerc : bouclier détecté');
  eq(gear('Fighter', 0).armorConfig.mode, 'heavy', 'Guerrier : cotte de mailles = lourde');
  eq(gear('Fighter', 0).armorConfig.baseAC, 16, 'Guerrier : CA de base 16');
  eq(gear('Rogue', 0).armorConfig.mode, 'light', 'Roublard : armure légère');
  // Défense sans armure : la classe décide quand aucune armure n'est fournie
  eq(gear('Barbarian', 0).armorConfig.mode, 'unarmoredBarb', 'Barbare : défense sans armure');
  eq(gear('Monk', 0).armorConfig.mode, 'unarmoredMonk', 'Moine : défense sans armure');
  eq(gear('Wizard', 0).armorConfig.mode, 'unarmored', 'Magicien : sans armure');
  // Option « or uniquement » : pas d'armure, pas d'attaque, mais un armorConfig valide
  const goldOnly = gear('Barbarian', 1);
  eq(goldOnly.armorConfig.mode, 'unarmoredBarb', 'or seul : la classe décide encore de la CA');
  eq(goldOnly.armorConfig.shield, false, 'or seul : pas de bouclier');
  ok(!goldOnly.attaques, 'or seul : aucune attaque inventée');
  // Dégâts = dé de l'arme + modificateur de la caractéristique utilisée
  eq(gear('Barbarian', 0, { for:17 }).attaques[0].degats, '1d12+3', 'Hache d\'armes 1d12 + FOR 17');
  eq(gear('Barbarian', 0, { for:8 }).attaques[0].degats,  '1d12-1', 'Hache d\'armes avec FOR 8');
  eq(gear('Barbarian', 0, { for:10 }).attaques[0].degats, '1d12',   'Aucun modificateur affiché si 0');
  // Doublons : 4 haches de jet → une seule ligne d'attaque
  eq(gear('Barbarian', 0).attaques.length, 2, 'Barbare : haches de jet regroupées en une ligne');
  // Finesse : la meilleure des deux caractéristiques
  eq(gear('Rogue', 0, { for:10, dex:17 }).attaques[1].atkType, 'dex', 'Épée courte (finesse) → DEX');
  eq(gear('Rogue', 0, { for:17, dex:10 }).attaques[1].atkType, 'for', 'Épée courte (finesse) → FOR');
  // Les armes à distance restent en DEX quelle que soit la FOR
  eq(gear('Ranger', 0, { for:18, dex:10 }).attaques[2].atkType, 'dex', 'Arc long toujours en DEX');
  // Focus d'incantation monté sur bâton : reconnu comme arme
  ok(gear('Wizard', 0).attaques.some(a => a.name === 'Quarterstaff'),
     'Magicien : « Arcane Focus (Quarterstaff) » compte comme un bâton');

  /* ── PV de départ (startingMaxHp) ── */
  eq(startingMaxHp({ con:14 }, '1d8',  {}), 10, 'd8 + CON 14 = 10 PV');
  eq(startingMaxHp({ con:10 }, '1d12', {}), 12, 'd12 + CON 10 = 12 PV');
  eq(startingMaxHp({ con:6 },  '1d6',  {}),  4, 'd6 + CON 6 = 4 PV');
  eq(startingMaxHp({ con:1 },  '1d6',  {}),  1, 'PV jamais sous 1');
  // Robustesse naine : le bonus était affiché sur la fiche mais jamais ajouté
  eq(startingMaxHp({ con:14 }, '1d8', { hpPerLevel:1 }), 11, 'Nain : +1 PV/niveau appliqué');
  eq(startingMaxHp({ con:14 }, '1d8', { speed:25 }),     10, 'Un effet sans PV ne change rien');
  // Toute espèce déclarant hpPerLevel doit être un entier positif
  Object.entries(SPECIES_DATA).forEach(([sp, d]) => {
    const h = d.effects?.hpPerLevel;
    if (h !== undefined) ok(Number.isInteger(h) && h > 0, `${sp} : hpPerLevel invalide (${h})`);
  });

  /* ── Montée de niveau (planLevelUp / applyLevelUp) ── */
  const hero = (over) => Object.assign({
    for:14, dex:14, con:14, int:14, sag:14, cha:14, pvMax:20, pvActuel:20, nbDeVie:2,
  }, over);

  // Caractéristiques des dons : chaque libellé doit se traduire en clés valides
  eq(abilKeysFromFeat('CHA'), ['cha'], 'abilKeysFromFeat simple');
  eq(abilKeysFromFeat('FOR or DEX'), ['for','dex'], 'abilKeysFromFeat « or »');
  eq(abilKeysFromFeat('FOR, DEX or SAG'), ['for','dex','sag'], 'abilKeysFromFeat liste');
  eq(abilKeysFromFeat('choice').length, 6, 'abilKeysFromFeat « choice »');
  Object.entries(GENERAL_FEATS).forEach(([name, f]) => {
    if (!f.asi) return;
    const keys = abilKeysFromFeat(f.abil);
    ok(keys.length > 0, `don « ${name} » : abil « ${f.abil} » illisible`);
    keys.forEach(k => ok(['for','dex','con','int','sag','cha'].includes(k),
      `don « ${name} » : clé « ${k} » invalide`));
  });

  // PV : moyenne PHB = dé/2 + 1, plus CON, plus le bonus d'espèce
  {
    const c = hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:1}], con:14 });
    const p = planLevelUp(c, 'Fighter');
    eq(p.avgHp, 8,  'd10 : moyenne 6 (= 10/2 + 1) + CON 2');
    eq(p.maxHp, 12, 'd10 max 10 + CON 2');
    eq(p.minHp, 3,  'd10 min 1 + CON 2');
  }
  {
    const c = hero({ classes:[{classe:'Wizard',sousClasse:'',niveau:1}], con:14, species:'Dwarf' });
    const p = planLevelUp(c, 'Wizard');
    eq(p.speciesHp, 1, 'Nain : +1 PV/niveau pris en compte');
    eq(p.avgHp, 7, 'd6 moyenne 4 + CON 2 + Nain 1');
  }

  // Sous-classe : requise au niveau 3, et seulement si aucune n'est choisie
  {
    const c2 = hero({ classes:[{classe:'Cleric',sousClasse:'',niveau:2}] });
    ok(planLevelUp(c2, 'Cleric').needsSubclass, 'sous-classe requise en montant au niveau 3');
    const c3 = hero({ classes:[{classe:'Cleric',sousClasse:'Life Domain',niveau:3}] });
    ok(!planLevelUp(c3, 'Cleric').needsSubclass, 'sous-classe déjà choisie : plus demandée');
    const c1 = hero({ classes:[{classe:'Cleric',sousClasse:'',niveau:1}] });
    ok(!planLevelUp(c1, 'Cleric').needsSubclass, 'pas de sous-classe au niveau 2');
  }

  // ASI : lu dans la table de la classe, sur le niveau DE CLASSE
  [3,7,9,11,15].forEach(l => ok(planLevelUp(hero({ classes:[{classe:'Rogue',sousClasse:'Assassin',niveau:l}] }), 'Rogue').isAsi,
    `Roublard : ASI en montant au niveau ${l + 1}`));
  [1,4,5,13,18].forEach(l => ok(!planLevelUp(hero({ classes:[{classe:'Rogue',sousClasse:'Assassin',niveau:l}] }), 'Rogue').isAsi,
    `Roublard : pas d'ASI en montant au niveau ${l + 1}`));
  // Le Guerrier en a deux de plus (6 et 14) — une liste generique les raterait
  [3,5,7,11,13,15].forEach(l => ok(planLevelUp(hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:l}] }), 'Fighter').isAsi,
    `Guerrier : ASI en montant au niveau ${l + 1}`));
  // Niveau 19 : don epique en 2024, pas un ASI
  Object.keys(CLASS_DATA).forEach(cls => {
    const p19 = planLevelUp(hero({ classes:[{classe:cls,sousClasse:'',niveau:18}] }), cls);
    ok(!p19.isAsi, `${cls} : le niveau 19 est un don epique, pas un ASI`);
    ok(p19.newFeatures.some(f => f.type === 'epic'), `${cls} : don epique au niveau 19`);
  });
  // Chaque classe a au minimum les ASI de base
  Object.entries(CLASS_DATA).forEach(([cls, d]) => {
    const lv = Object.entries(d.features).filter(([, fs]) => fs.some(f => f.type === 'asi')).map(([l]) => +l);
    [4,8,12,16].forEach(n => ok(lv.includes(n), `${cls} : ASI manquant au niveau ${n}`));
  });
  // Multiclasse : un Guerrier 3 / Magicien 3 qui monte Guerrier 4 a bien son ASI
  ok(planLevelUp(hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:3},{classe:'Wizard',sousClasse:'School of Evocation',niveau:3}] }), 'Fighter').isAsi,
     'ASI calculé sur le niveau de classe, pas le total');

  // Bornes
  eq(planLevelUp(hero({ classes:[{classe:'Bard',sousClasse:'College of Lore',niveau:20}] }), 'Bard').ok, false, 'niveau 21 refusé');
  eq(planLevelUp(hero({}), 'Sorceror').ok, false, 'classe inconnue refusée');
  eq(planLevelUp(hero({ classes:[{classe:'Bard',sousClasse:'College of Lore',niveau:20}] }), 'Wizard').ok, false,
     'niveau total 20 : plus de multiclassage');

  // Application : niveau, PV, dés de vie, sous-classe
  {
    const c = hero({ classes:[{classe:'Wizard',sousClasse:'',niveau:2}], con:14, pvMax:14, pvActuel:9, nbDeVie:2 });
    const r = applyLevelUp(c, planLevelUp(c, 'Wizard'), { hp:5, subclass:'School of Evocation' });
    ok(r.ok, 'montée appliquée');
    eq(c.classes[0].niveau, 3, 'niveau de classe incrémenté');
    eq(c.classes[0].sousClasse, 'School of Evocation', 'sous-classe écrite');
    eq(c.pvMax, 19, 'PV max +5');
    eq(c.pvActuel, 14, 'PV actuels suivent le gain');
    eq(c.nbDeVie, 3, 'dé de vie ajouté');
    eq(c.niveau, 3, 'champ legacy synchronisé');
  }
  // Sans choix de PV, on prend la moyenne
  {
    const c = hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:1}], con:14, pvMax:12 });
    applyLevelUp(c, planLevelUp(c, 'Fighter'), {});
    eq(c.pvMax, 20, 'PV : moyenne par défaut (+8)');
  }
  // ASI : +2, ou +1/+1, plafonné à 20
  {
    const c = hero({ classes:[{classe:'Rogue',sousClasse:'Assassin',niveau:3}], dex:16, con:12 });
    applyLevelUp(c, planLevelUp(c, 'Rogue'), { asiMode:'abil', asiA:'dex' });
    eq(c.dex, 18, 'ASI +2');
  }
  {
    const c = hero({ classes:[{classe:'Rogue',sousClasse:'Assassin',niveau:3}], dex:16, con:12 });
    applyLevelUp(c, planLevelUp(c, 'Rogue'), { asiMode:'abil', asiA:'dex', asiB:'con' });
    eq([c.dex, c.con], [17, 13], 'ASI +1/+1');
  }
  {
    const c = hero({ classes:[{classe:'Rogue',sousClasse:'Assassin',niveau:3}], dex:19 });
    applyLevelUp(c, planLevelUp(c, 'Rogue'), { asiMode:'abil', asiA:'dex' });
    eq(c.dex, 20, 'ASI plafonné à 20');
  }
  // Don : enregistré dans les capacités + son +1 de caractéristique
  {
    const c = hero({ classes:[{classe:'Rogue',sousClasse:'Assassin',niveau:3}], dex:16 });
    applyLevelUp(c, planLevelUp(c, 'Rogue'), { asiMode:'feat', feat:'Crossbow Expert', featAbil:'dex' });
    eq(c.dex, 17, 'don : +1 appliqué');
    eq(c.customFeatures.length, 1, 'don enregistré dans les capacités');
    eq(c.customFeatures[0].name, 'Crossbow Expert', 'nom du don');
    ok(/Rogue 4/.test(c.customFeatures[0].source), 'source du don datée du niveau');
  }
  // Multiclassage : nouvelle classe au niveau 1, l'ancienne intacte
  {
    const c = hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:5}], int:14, for:15, pvMax:44 });
    const p = planLevelUp(c, 'Wizard');
    ok(p.isNewClass, 'multiclassage détecté');
    eq(p.toLevel, 1, 'la nouvelle classe démarre au niveau 1');
    applyLevelUp(c, p, {});
    eq(c.classes.length, 2, 'deux classes');
    eq(c.classes[0].niveau, 5, 'la classe d\'origine ne bouge pas');
    eq(c.classes[1].niveau, 1, 'la nouvelle est au niveau 1');
    eq(getTotalLevel(c), 6, 'niveau total 6');
  }
  // Prérequis de multiclassage (13 des deux côtés)
  {
    const faible = hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:5}], for:15, int:10 });
    const p = planLevelUp(faible, 'Wizard');
    eq(p.prereq.ok, false, 'INT 10 : prérequis Magicien non rempli');
    ok(/Wizard/.test(p.prereq.missing.join(' ')), 'la classe manquante est nommée');
    const fort = hero({ classes:[{classe:'Fighter',sousClasse:'Champion',niveau:5}], for:15, int:13 });
    eq(planLevelUp(fort, 'Wizard').prereq.ok, true, 'INT 13 : prérequis rempli');
    // Guerrier : FOR *ou* DEX suffit
    const dexOnly = hero({ classes:[{classe:'Rogue',sousClasse:'Assassin',niveau:3}], for:8, dex:16 });
    eq(planLevelUp(dexOnly, 'Fighter').prereq.ok, true, 'Guerrier : DEX seule suffit');
    // Monter sa propre classe ne déclenche aucune vérification
    eq(planLevelUp(hero({ classes:[{classe:'Wizard',sousClasse:'School of Evocation',niveau:3}], int:8 }), 'Wizard').prereq, null,
       'pas de prérequis quand on monte sa classe');
  }
  // Toute classe jouable doit avoir des prérequis déclarés
  Object.keys(CLASS_DATA).forEach(cls => {
    ok(!!MULTICLASS_PREREQ[cls], `${cls} : prérequis de multiclassage manquants`);
    (MULTICLASS_PREREQ[cls]?.abils || []).forEach(a =>
      ok(['for','dex','con','int','sag','cha'].includes(a), `${cls} : caractéristique « ${a} » invalide`));
  });
  // Ressources : mises à l'échelle sans oublier ce qui est déjà dépensé
  {
    const c = hero({ classes:[{classe:'Barbarian',sousClasse:'',niveau:2}], con:16,
                     resources:[{name:'Rages',used:1,max:2,reset:'long'}] });
    applyLevelUp(c, planLevelUp(c, 'Barbarian'), { subclass:'Path of the Berserker' });
    eq(c.resources.length, 1, 'une seule entrée Rages');
    eq(c.resources[0].max, 3, 'Rages passent à 3 au niveau 3');
    eq(c.resources[0].used, 1, 'la consommation est préservée');
  }
  // Un nom de sous-classe ou de don invalide est refuse, sans rien ecrire
  {
    const c = hero({ classes:[{classe:'Cleric',sousClasse:'',niveau:2}], pvMax:16 });
    const r = applyLevelUp(c, planLevelUp(c, 'Cleric'), { subclass:'Domaine bidon' });
    eq(r.ok, false, 'sous-classe inconnue refusee');
    eq(c.classes[0].niveau, 2, 'niveau inchange apres un refus');
    eq(c.pvMax, 16, 'PV inchanges apres un refus');
  }
  {
    const c = hero({ classes:[{classe:'Rogue',sousClasse:'Assassin',niveau:3}], pvMax:24 });
    const r = applyLevelUp(c, planLevelUp(c, 'Rogue'), { asiMode:'feat', feat:'Don Inexistant' });
    eq(r.ok, false, 'don inconnu refuse');
    eq(c.pvMax, 24, 'PV inchanges apres un refus de don');
  }
  // Chaque sous-classe proposee par le plan doit exister dans les donnees
  Object.keys(CLASS_DATA).forEach(cls => {
    const c = hero({ classes:[{classe:cls,sousClasse:'',niveau:2}] });
    const p = planLevelUp(c, cls);
    ok(p.subOptions.length >= 2, `${cls} : au moins deux sous-classes proposees`);
    p.subOptions.forEach(s2 => ok(!!SUBCLASS_DATA[cls][s2], `${cls}/${s2} : sous-classe fantome`));
  });

  // Le Level Plan sert de journal : pas de second registre
  {
    const c = hero({ classes:[{classe:'Rogue',sousClasse:'Assassin',niveau:3}], dex:16 });
    applyLevelUp(c, planLevelUp(c, 'Rogue'), { hp:7, asiMode:'abil', asiA:'dex', asiB:'con' });
    eq(c.levelPlan.rows[3].cls, 'Rogue', 'journal : classe du niveau 4');
    eq(c.levelPlan.rows[3].hp, 7, 'journal : PV gagnés');
    eq(c.levelPlan.rows[3].asi, '+1 DEX / +1 CON', 'journal : décision ASI');
  }

  /* -- Encombrement : capacite, poids des pieces, total de l'inventaire -- */
  eq(carryCapacity({ for:10, species:'Human' }), 150, 'capacite FOR 10');
  eq(carryCapacity({ for:18, species:'Dwarf' }), 270, 'capacite FOR 18');
  eq(carryCapacity({}), 150, 'sans FOR : 10 par defaut');
  eq(carryCapacity({ for:12, species:'EspeceInconnue' }), 180, 'espece inconnue : taille Medium');
  // Toute espece jouable doit donner une capacite exploitable
  Object.keys(SPECIES_DATA).forEach(sp =>
    ok(carryCapacity({ for:10, species:sp }) > 0, `${sp} : capacite de charge invalide`));
  eq(coinWeight({ gp:50 }), 1, '50 pieces = 1 lb');
  eq(coinWeight({ pp:10, gp:20, sp:20 }), 1, 'pieces melangees');
  eq(coinWeight({}), 0, 'aucune piece');
  eq(inventoryWeight({ items:[{ name:'Javelin', qty:4, weight:2 }], currency:{} }).total, 8,
     'le poids est multiplie par la quantite');
  eq(inventoryWeight({ items:[{ name:'X', qty:1 }], currency:{} }),
     { total:0, sansPoids:1, coins:0 }, 'objet sans poids : compte comme non renseigne, pas 0');
  eq(inventoryWeight({ items:[{ name:'Y', weight:2.5 }], currency:{} }).total, 2.5,
     'quantite absente = 1');
  eq(inventoryWeight({ items:[], currency:{ gp:100 } }).total, 2, 'les pieces comptent dans la charge');
  eq(inventoryWeight({ items:[], currency:{} }), { total:0, sansPoids:0, coins:0 }, 'inventaire vide');


  /* -- Choix de capacites : style de combat, ordre divin, metamagie... -- */
  {
    // Les options du style de combat dependent de la classe
    eq(featureOptions('Fighting Style', 'Fighter').options.length, 6, 'Guerrier : six styles de combat');
    eq(featureOptions('Fighting Style', 'Paladin').options.length, 5, 'Paladin : cinq styles');
    eq(featureOptions('Fighting Style', 'Ranger').options.length, 4, 'Rodeur : quatre styles');
    ok(!featureOptions('Fighting Style', 'Paladin').options.includes('Archery'),
       'Archery n est pas propose au Paladin');
    ok(featureOptions('Fighting Style', 'Ranger').options.includes('Druidic Warrior'),
       'Druidic Warrior propre au Rodeur');
    ok(featureOptions('Fighting Style', 'Paladin').options.includes('Blessed Warrior'),
       'Blessed Warrior propre au Paladin');
    eq(featureOptions('Metamagic', 'Sorcerer').pick, 2, 'Metamagie : deux options a retenir');
    eq(featureOptions('Second Wind', 'Fighter'), null, 'une capacite sans choix ne propose rien');
    eq(featureOptions('Additional Fighting Style', 'Fighter').options.length, 6,
       'Champion : herite de la liste du Guerrier');

    // Chaque option a une description : sans elle l'infobulle serait vide
    Object.entries(FEATURE_CHOICES).forEach(([nom, def]) => {
      const src = def.inherit ? FEATURE_CHOICES[def.inherit] : def;
      const toutes = src.perClass ? [].concat(...Object.values(src.perClass)) : src.options;
      [...new Set(toutes)].forEach(o =>
        ok(!!(src.desc || {})[o], `${nom} / ${o} : description manquante`));
      ok((def.pick || 1) >= 1, `${nom} : nombre a retenir invalide`);
    });

    // Niveaux ou le choix se presente
    eq(featureChoicesAt('Fighter', null, 1).map(f => f.name), ['Fighting Style'], 'Guerrier niveau 1');
    eq(featureChoicesAt('Paladin', null, 2).map(f => f.name), ['Fighting Style'], 'Paladin niveau 2');
    eq(featureChoicesAt('Cleric', null, 1).map(f => f.name), ['Divine Order'], 'Clerc niveau 1');
    eq(featureChoicesAt('Druid', null, 1).map(f => f.name), ['Primal Order'], 'Druide niveau 1');
    eq(featureChoicesAt('Sorcerer', null, 2).map(f => f.name), ['Metamagic'], 'Ensorceleur niveau 2');
    eq(featureChoicesAt('Ranger', null, 2).map(f => f.name).sort(), ['Deft Explorer', 'Fighting Style'],
       'Rodeur niveau 2 : deux capacites a choix');
    eq(featureChoicesAt('Fighter', 'Champion', 7).map(f => f.name), ['Additional Fighting Style'],
       'Champion niveau 7 : un second style');
    eq(featureChoicesAt('Fighter', 'Champion', 3), [], 'aucun choix a ce niveau');

    // Enregistrement : on refuse ce qui n'est pas propose
    {
      const c3 = { classes: [{ classe: 'Fighter', sousClasse: 'Champion', niveau: 7 }] };
      eq(setFeatureChoice(c3, 'Fighting Style', 'Fighter', ['Defense']), ['Defense'], 'choix valide retenu');
      eq(getFeatureChoice(c3, 'Fighting Style'), ['Defense'], 'choix relu correctement');
      eq(setFeatureChoice(c3, 'Fighting Style', 'Fighter', ['OptionBidon']), [],
         'option inexistante refusee');
      eq(setFeatureChoice(c3, 'Fighting Style', 'Paladin', ['Archery']), [],
         'option d une autre classe refusee');
      eq(setFeatureChoice(c3, 'Metamagic', 'Sorcerer', ['Careful', 'Subtle', 'Twinned']),
         ['Careful', 'Subtle'], 'surplus tronque au nombre autorise');
      eq(getFeatureChoice({}, 'Fighting Style'), [], 'personnage sans choix enregistre');
    }

    // Ce qui reste a decider
    {
      const g = { classes: [{ classe: 'Fighter', sousClasse: 'Champion', niveau: 7 }] };
      eq(pendingFeatureChoices(g).map(x => x.name), ['Fighting Style', 'Additional Fighting Style'],
         'Guerrier 7 neuf : deux choix en attente');
      setFeatureChoice(g, 'Fighting Style', 'Fighter', ['Defense']);
      eq(pendingFeatureChoices(g).map(x => x.name), ['Additional Fighting Style'],
         'un choix fait, un restant');
      const s3 = { classes: [{ classe: 'Sorcerer', sousClasse: '', niveau: 3 }] };
      setFeatureChoice(s3, 'Metamagic', 'Sorcerer', ['Careful']);
      eq(pendingFeatureChoices(s3)[0], { name: 'Metamagic', classe: 'Sorcerer', niveau: 2, pick: 2, fait: 1 },
         'Metamagie a moitie choisie : signalee');
    }

    // Le monteur de niveau expose bien les choix du niveau vise
    {
      const f2 = { for: 14, dex: 14, con: 14, int: 14, sag: 14, cha: 14, pvMax: 20, nbDeVie: 1,
                   classes: [{ classe: 'Fighter', sousClasse: '', niveau: 1 }] };
      eq(planLevelUp(f2, 'Fighter').featureChoices, [], 'niveau 2 du Guerrier : aucun choix');
      const p2 = { for: 14, dex: 14, con: 14, int: 14, sag: 14, cha: 14, pvMax: 20, nbDeVie: 1,
                   classes: [{ classe: 'Paladin', sousClasse: '', niveau: 1 }] };
      eq(planLevelUp(p2, 'Paladin').featureChoices.map(f => f.name), ['Fighting Style'],
         'niveau 2 du Paladin : style de combat propose');
      // Et applyLevelUp l'enregistre
      const r2 = applyLevelUp(p2, planLevelUp(p2, 'Paladin'),
                              { featureChoices: { 'Fighting Style': ['Dueling'] } });
      eq(getFeatureChoice(p2, 'Fighting Style'), ['Dueling'], 'choix enregistre a la montee');
      ok(r2.log.some(x => /Fighting Style/.test(x)), 'choix note dans le journal');
    }
  }

  /* -- Gains que le joueur doit choisir : sorts mineurs, Expertise, emplacements -- */
  {
    const CANTRIPS_T = new Function(extract(R, 'const CANTRIPS_KNOWN') + '; return CANTRIPS_KNOWN;')();
    // Chaque lanceur a une table de 20 niveaux, croissante, coherente avec le niveau 1
    Object.entries(STARTING_SPELLS).forEach(([cls, st]) => {
      const tb = CANTRIPS_T[cls];
      ok(!!tb, `${cls} : table de sorts mineurs manquante`);
      eq((tb || []).length, 20, `${cls} : table sur 20 niveaux`);
      eq((tb || [])[0], st.cantrips, `${cls} : niveau 1 coherent avec STARTING_SPELLS`);
      (tb || []).forEach((n, i) => {
        if (i > 0) ok(n >= tb[i - 1], `${cls} niv.${i + 1} : la table ne doit pas decroitre`);
      });
    });
    eq(cantripsAt('Fighter', 5), 0, 'une classe non lanceuse n a pas de sorts mineurs');
    eq(cantripsAt('Bard', 4) - cantripsAt('Bard', 3), 1, 'Barde : un sort mineur de plus au niveau 4');
    eq(cantripsAt('Wizard', 10) - cantripsAt('Wizard', 9), 1, 'Magicien : un de plus au niveau 10');

    // Expertise lue dans la description de la capacite, pas codee en dur
    eq(expertiseAt('Rogue', 1), 2, 'Roublard niveau 1 : deux competences');
    eq(expertiseAt('Rogue', 6), 2, 'Roublard niveau 6 : deux de plus');
    eq(expertiseAt('Rogue', 5), 0, 'Roublard niveau 5 : aucune');
    eq(expertiseAt('Bard', 2), 2, 'Barde niveau 2');
    eq(expertiseAt('Ranger', 9), 2, 'Rodeur niveau 9');
    eq(expertiseAt('Fighter', 6), 0, 'le Guerrier n a pas d Expertise');

    eq(topSlotLevel([4,3,2,0,0,0,0,0,0]), 3, 'plus haut niveau de sort accessible');
    eq(topSlotLevel(null), 0, 'aucun emplacement');
    eq(topSlotLevel([]), 0, 'tableau vide');

    // L'Expertise ne s'applique qu'a une competence deja maitrisee
    const r0 = { for:14, dex:14, con:14, int:14, sag:14, cha:14, pvMax:20, nbDeVie:5,
                 classes:[{ classe:'Rogue', sousClasse:'Assassin', niveau:5 }], discret:1, perception:0 };
    const res0 = applyLevelUp(r0, planLevelUp(r0, 'Rogue'), { expertise:['discret','perception'] });
    eq(r0.discret, 2, 'competence maitrisee : passe en Expertise');
    eq(r0.perception, 0, 'competence non maitrisee : refusee');
    ok(res0.log.some(x => /Expertise/.test(x)), 'Expertise notee dans le journal');
    // Le journal annonce aussi les gains a choisir soi-meme
    const b1 = { for:14, dex:14, con:14, int:14, sag:14, cha:14, pvMax:20, nbDeVie:3,
                 classes:[{ classe:'Bard', sousClasse:'College of Lore', niveau:3 }] };
    ok(applyLevelUp(b1, planLevelUp(b1, 'Bard'), {}).log.some(x => /cantrip/.test(x)),
       'sort mineur gagne : annonce');
  }

  /* -- Valeur du butin -- */
  eq(purseValue({ gp:100 }), 100, 'bourse en po');
  eq(purseValue({ pp:1, gp:1, ep:1, sp:1, cp:1 }), 11.61, 'toutes les denominations');
  eq(purseValue({}), 0, 'bourse vide');
  eq(itemsValue([{ name:'A', cost:15, qty:2 }]), { total:30, sansPrix:0 }, 'prix multiplie par la quantite');
  eq(itemsValue([{ name:'A', cost:15 }, { name:'B' }]), { total:15, sansPrix:1 },
     'objet sans prix signale, pas compte a zero');
  eq(itemsValue([{ name:'A', cost:2.5 }]), { total:2.5, sansPrix:0 }, 'quantite absente = 1');
  eq(itemsValue([]), { total:0, sansPrix:0 }, 'inventaire vide');
  eq(fmtGp(15), '15', 'pas de decimale inutile');
  eq(fmtGp(0.5), '0.5', 'decimale conservee');
  eq(fmtGp(15.006), '15.01', 'arrondi au centieme');

  /* -- Notes : markdown leger et liens wiki -- */
  {
    const idx = buildWikiIndex([{ title:'Ouestvir', url:'ayakan/ouestvir.html' }]);
    const r = t2 => renderNoteMarkdown(t2, idx);
    eq(r('# Session 4'), '<h3 class="note-h">Session 4</h3>', 'titre de niveau 1');
    eq(r('### Detail'), '<h5 class="note-h">Detail</h5>', 'titre de niveau 3');
    eq(r('du **texte** ici'), '<p>du <strong>texte</strong> ici</p>', 'gras');
    eq(r('du *texte* ici'), '<p>du <em>texte</em> ici</p>', 'italique');
    { const NL = String.fromCharCode(10);
      eq(r('- un' + NL + '- deux'), '<ul>' + NL + '<li>un</li>' + NL + '<li>deux</li>' + NL + '</ul>', 'liste a puces'); }
    eq(r('> parole'), '<blockquote>parole</blockquote>', 'citation');
    eq(r('---'), '<hr>', 'separateur');
    eq(r('[[Ouestvir]]'), '<p><a class="note-wiki" href="ayakan/ouestvir.html">Ouestvir</a></p>',
       'lien vers une page du wiki');
    eq(r('[[Ouestvir|la cite]]'), '<p><a class="note-wiki" href="ayakan/ouestvir.html">la cite</a></p>',
       'lien avec libelle personnalise');
    ok(/note-wiki missing/.test(r('[[Zorglub]]')), 'page inconnue : signalee, pas de lien mort');
    ok(r('[[OUESTVIR]]').includes('ayakan/ouestvir.html'), 'recherche de page insensible a la casse');
    // Echappement : les notes sont aussi affichees dans la vue MJ
    eq(r('<script>alert(1)</script>'), '<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>', 'HTML echappe');
    ok(r('[[<b>x</b>]]').includes('&lt;b&gt;'), 'HTML echappe aussi dans un lien wiki');
    eq(r('Bram & Elara'), '<p>Bram &amp; Elara</p>', 'esperluette echappee');
    eq(r(''), '', 'texte vide');
    eq(r(null), '', 'texte absent');
    eq(buildWikiIndex(null).size, 0, 'index absent');
    eq(buildWikiIndex([{ title:'X' }]).size, 0, 'entree sans url ignoree');
  }

  /* -- Filet de securite sur conflit : ce que le local avait en plus -- */
  {
    const mk = (nom, notes) => ({ characters:{ c1:{ character:{ characterName:nom }, notes } } });
    eq(diffNotes(mk('Thorin', [{ content:'aaa' }, { content:'bbb' }]), mk('Thorin', [{ content:'aaa' }])),
       [{ nom:'Thorin', pagesEnPlus:1, caracteresEnPlus:3 }], 'page en plus cote local');
    eq(diffNotes(mk('Thorin', [{ content:'aaaaa' }]), mk('Thorin', [{ content:'aaa' }])),
       [{ nom:'Thorin', pagesEnPlus:0, caracteresEnPlus:2 }], 'texte en plus cote local');
    eq(diffNotes(mk('Thorin', [{ content:'aaa' }]), mk('Thorin', [{ content:'aaa' }])), [],
       'versions identiques : rien a signaler');
    eq(diffNotes(mk('Thorin', [{ content:'a' }]), mk('Thorin', [{ content:'aaaa' }])), [],
       'distant plus riche : on ne reclame rien');
    eq(diffNotes(mk('Thorin', [{ content:'aaa' }]), { characters:{} }),
       [{ nom:'Thorin', pagesEnPlus:1, caracteresEnPlus:3 }], 'personnage absent du distant');
    eq(diffNotes({}, {}), [], 'donnees vides');
    eq(diffNotes(mk('Thorin', null), mk('Thorin', null)), [], 'notes absentes');
  }

  /* -- Recherche dans les notes -- */
  {
    const pages = [
      { name:'Session 1', content:'Nous avons rencontre Elara a Ouestvir. Elara nous a parle du culte.' },
      { name:'PNJ',       content:'Elara — pretresse. Bram — forgeron.' },
      { name:'Elara',     content:'Rien ici.' },
      { name:'Vide',      content:'' },
    ];
    const r = searchNotes(pages, 'elara');
    eq(r.length, 3, 'trois pages concernees');
    eq(r[0].total, 2, 'occurrences comptees dans la page');
    eq(r[0].hits[0].motif, 'Elara', 'la casse d origine est conservee dans l extrait');
    eq(r[2].dansTitre, true, 'trouve dans le titre seul');
    eq(r[2].hits.length, 0, 'titre seul : aucun extrait');
    eq(searchNotes(pages, 'e'), [], 'requete d un seul caractere ignoree');
    eq(searchNotes(pages, ''), [], 'requete vide');
    eq(searchNotes(pages, 'dragon'), [], 'aucun resultat');
    eq(searchNotes(pages, 'ELARA').length, 3, 'recherche insensible a la casse');
    eq(searchNotes(null, 'test'), [], 'pages absentes');
    eq(searchNotes(pages, '  elara  ').length, 3, 'espaces autour de la requete ignores');
    const many = searchNotes([{ name:'X', content:'orc orc orc orc orc' }], 'orc');
    eq(many[0].hits.length, 3, 'au plus trois extraits affiches');
    eq(many[0].total, 5, 'mais le total reste exact');
  }

  /* -- Une arme equipee devient une ligne d'attaque -- */
  {
    const guerrier = { for:16, dex:12, classes:[{ classe:'Fighter', niveau:5 }] };
    const magicien = { for:8,  dex:14, classes:[{ classe:'Wizard',  niveau:5 }] };
    const roublard = { for:10, dex:18, classes:[{ classe:'Rogue',   niveau:5 }] };
    eq(attackFromItem({ name:'Longsword', dmg:'1d8', dmgType:'Slashing', weaponCat:'martial' }, guerrier),
       { name:'Longsword', degats:'1d8+3', typeDegat:'Slashing', atkType:'for', prof:true, bonus:'', fromItem:'Longsword' },
       'arme du compendium -> ligne d attaque');
    eq(attackFromItem({ name:'Rapier', dmg:'1d8', finesse:true }, roublard).atkType, 'dex',
       'finesse : la meilleure des deux caracteristiques');
    eq(attackFromItem({ name:'Rapier', dmg:'1d8', finesse:true }, guerrier).atkType, 'for',
       'finesse : FOR quand elle est meilleure');
    eq(attackFromItem({ name:'Longbow', dmg:'1d8', ranged:true }, guerrier).atkType, 'dex',
       'arme a distance : toujours DEX');
    // Maitrise deduite de la classe : un magicien n'est pas maitre d'une arme martiale
    eq(attackFromItem({ name:'Greataxe', dmg:'1d12', weaponCat:'martial' }, magicien).prof, false,
       'magicien : pas maitre des armes martiales');
    eq(attackFromItem({ name:'Dagger', dmg:'1d4', weaponCat:'simple' }, magicien).prof, true,
       'magicien : maitre des armes simples');
    eq(isProficientWith({ classes:[{ classe:'ClasseInconnue' }] }, 'martial'), true,
       'classe inconnue : aucun malus invente');
    // Repli sur STARTING_WEAPONS quand l'objet n'a pas ete importe du compendium
    eq(attackFromItem({ name:'Greataxe' }, guerrier).degats, '1d12+3',
       'arme saisie a la main : repli sur les armes connues');
    eq(attackFromItem({ name:'Rope, Hempen' }, guerrier), null, 'un objet quelconque ne cree pas d attaque');
    eq(attackFromItem({ name:'Chain Mail' }, guerrier), null, 'une armure ne cree pas d attaque');
    // Ajout / retrait sans toucher aux lignes saisies a la main
    const c2 = { for:16, dex:12, classes:[{ classe:'Fighter', niveau:5 }],
                 attaques:[{ name:'Poing', degats:'1', atkType:'for' }] };
    syncAttackForItem(c2, { name:'Longsword', dmg:'1d8' }, true);
    eq(c2.attaques.length, 2, 'attaque ajoutee a l equipement');
    syncAttackForItem(c2, { name:'Longsword', dmg:'1d8' }, true);
    eq(c2.attaques.length, 2, 'pas de doublon si deja presente');
    syncAttackForItem(c2, { name:'Longsword', dmg:'1d8' }, false);
    eq(c2.attaques.length, 1, 'attaque retiree au deshabillage');
    eq(c2.attaques[0].name, 'Poing', 'les attaques saisies a la main sont preservees');
    eq(syncAttackForItem(c2, { name:'Rope' }, true), null, 'un objet non-arme ne touche a rien');
  }

  /* -- Lien magique : migration des anciens emplacements, plafond de 3 -- */
  const ATTUNE_MAX_T = new Function(extract(J, 'const ATTUNE_MAX') + '; return ATTUNE_MAX;')();
  eq(ATTUNE_MAX_T, 3, 'trois liens au maximum');
  eq(isAttunable({ name:'X', attune:true }), true, 'objet du compendium liable');
  eq(isAttunable({ name:'X', cat:'magique' }), true, 'objet magique liable');
  eq(isAttunable({ name:'Rope', cat:'equipement' }), false, 'objet ordinaire non liable');
  {
    // L'ancien format (3 champs texte) doit se transferer sans rien perdre
    const inv = { items:[{ name:'Cloak of Protection', cat:'magique' }],
                  attunement:[{ name:'Cloak of Protection', active:true },
                              { name:'Ring of Jumping', active:false },
                              { name:'', active:false }] };
    eq(migrateAttunement(inv), 2, 'deux emplacements nommes repris');
    eq(inv.items[0].attuned, true, 'objet existant : lien conserve');
    eq(inv.items.length, 2, 'objet absent de l inventaire : cree');
    eq(inv.items[1].name, 'Ring of Jumping', 'nom repris tel quel');
    eq('attunement' in inv, false, 'ancienne cle supprimee');
    eq(migrateAttunement(inv), 0, 'migration idempotente');
  }
  eq(migrateAttunement({ items:[] }), 0, 'inventaire sans ancien format');
  eq(migrateAttunement(null), 0, 'inventaire absent');
  eq(attunedItems({ items:[{ attuned:true }, {}, { attuned:true }] }).length, 2, 'comptage des liens');

  /* -- Objets equipes : l'inventaire pilote la CA -- */
  const ARMOR_PRESETS_T = new Function(extract(J, 'const ARMOR_PRESETS') + '; return ARMOR_PRESETS;')();
  eq(isShieldItem({ name:'Shield' }), true, 'bouclier reconnu');
  eq(isShieldItem({ name:'Shield, +1' }), true, 'bouclier magique reconnu');
  eq(isShieldItem({ name:'Bouclier' }), true, 'bouclier en francais');
  eq(isShieldItem({ name:'Shielded Boots' }), false, 'pas de faux positif sur un mot compose');
  eq(isShieldItem({ name:'Longsword' }), false, 'une arme n est pas un bouclier');
  eq(isShieldItem({ name:'Pavois', shield:true }), true, 'donnee du compendium prioritaire');
  // Resolution d'une armure : compendium, puis tables connues, puis rien
  eq(armorFromItem({ name:'Elven Chain', armorType:'medium', ac:13 }),
     { mode:'medium', baseAC:13, armorName:'Elven Chain' }, 'armure du compendium');
  eq(armorFromItem({ name:'Chain Mail' }),
     { mode:'heavy', baseAC:16, armorName:'Chain Mail' }, 'armure connue par son nom');
  eq(armorFromItem({ name:'Studded Leather Armor' }),
     { mode:'light', baseAC:12, armorName:'Studded Leather' }, 'armure reconnue par contenu');
  eq(armorFromItem({ name:'Shield' }), null, 'un bouclier n est pas une armure');
  eq(armorFromItem({ name:'Rope' }), null, 'un objet quelconque n est pas une armure');
  // Toute armure de depart doit se resoudre, sinon l'equipement ne ferait rien
  Object.keys(STARTING_ARMOR).forEach(n =>
    ok(!!armorFromItem({ name:n }), `${n} : armure de depart non resolue`));
  // Tous les presets de la fiche aussi
  ['light','medium','heavy'].forEach(m => ARMOR_PRESETS_T[m].forEach(p2 =>
    eq(armorFromItem({ name:p2.name })?.mode, m, `${p2.name} : type d armure attendu ${m}`)));
  // Retrait : on rend a la classe sa defense sans armure
  eq(defaultArmorConfig({ classes:[{ classe:'Barbarian', niveau:3 }] }).mode, 'unarmoredBarb',
     'barbare : defense sans armure');
  eq(defaultArmorConfig({ classes:[{ classe:'Monk', niveau:3 }] }).mode, 'unarmoredMonk',
     'moine : defense sans armure');
  eq(defaultArmorConfig({ classes:[{ classe:'Fighter', niveau:3 }] }).mode, 'unarmored',
     'guerrier : simplement sans armure');
  // Incoherence entre l'armure configuree et ce qui est reellement porte
  eq(equippedArmorMismatch({ armorConfig:{ mode:'heavy', armorName:'Plate' } }, { items:[] }), 'Plate',
     'armure portee sans objet correspondant : signalee');
  eq(equippedArmorMismatch({ armorConfig:{ mode:'heavy', armorName:'Chain Mail' } },
     { items:[{ name:'Chain Mail', equipped:true }] }), null, 'armure equipee : rien a signaler');
  eq(equippedArmorMismatch({ armorConfig:{ mode:'unarmored' } }, { items:[] }), null,
     'sans armure : rien a signaler');
  eq(isEquippable({ name:'Rope', cat:'equipement' }), false, 'une corde ne s equipe pas');
  ok(isEquippable({ name:'Longsword', cat:'arme' }), 'une arme s equipe');
  ok(isEquippable({ name:'Chain Mail' }), 'une armure s equipe');

  /* ── Sorts à choisir après création (startingSpellHint) ── */
  eq(startingSpellHint('Fighter'), null, 'Guerrier : aucun sort à choisir');
  eq(startingSpellHint('Rogue'),   null, 'Roublard : aucun sort à choisir');
  ok(/3<\/strong> cantrips/.test(startingSpellHint('Wizard')), 'Magicien : 3 sorts mineurs');
  ok(/6<\/strong> level-1 spells for your spellbook/.test(startingSpellHint('Wizard')), 'Magicien : grimoire de 6');
  ok(/4<\/strong> prepared/.test(startingSpellHint('Wizard')), 'Magicien : 4 préparés');
  ok(/3<\/strong> cantrips/.test(startingSpellHint('Cleric')), 'Clerc : 3 sorts mineurs');
  ok(!/spellbook/.test(startingSpellHint('Cleric')), 'Clerc : pas de grimoire');
  // Demi-lanceurs 2024 : pas de sorts mineurs, mais des sorts préparés dès le niveau 1
  ok(!/cantrip/.test(startingSpellHint('Paladin')), 'Paladin : aucun sort mineur');
  ok(/2<\/strong> level-1 spells to prepare/.test(startingSpellHint('Paladin')), 'Paladin : 2 sorts préparés');
  ok(/2<\/strong> level-1 spells to prepare/.test(startingSpellHint('Ranger')), 'Rôdeur : lanceur dès le niveau 1 (2024)');
  // Tout lanceur doit déclarer ses sorts mineurs, sinon la fiche sort sans indication
  Object.keys(PREPARED_SPELLS).forEach(cls => {
    ok(!!STARTING_SPELLS[cls], `${cls} : sorts de départ non déclarés`);
    ok(Number.isInteger(STARTING_SPELLS[cls].cantrips), `${cls} : nombre de sorts mineurs invalide`);
    ok(!!startingSpellHint(cls), `${cls} : lanceur sans rappel de sorts à choisir`);
  });
  eq(Object.entries(STARTING_SPELLS).filter(([, s]) => s.spellbook).map(([c]) => c).join(','),
     'Wizard', 'seul le Magicien démarre avec un grimoire');

  /* ── Langues et outils au choix ── */
  ok(LANGUAGES.standard.length >= 8 && LANGUAGES.rare.length >= 8, 'listes de langues fournies');
  ok(!LANGUAGES.standard.includes('Common'), 'le Commun est automatique, pas au choix');
  ok(!LANGUAGES.rare.includes('Common'), 'le Commun n\'est pas une langue rare');
  {
    const all = [...LANGUAGES.standard, ...LANGUAGES.rare];
    eq(new Set(all).size, all.length, 'aucune langue en double');
  }
  // Chaque outil « (choice) » d'un background doit proposer une liste
  Object.entries(BACKGROUND_DATA).forEach(([bg, d]) => {
    if (/\(choice\)/.test(d.tool))
      ok((TOOL_CHOICES[d.tool] || []).length >= 2, `${bg} : « ${d.tool} » sans liste de choix`);
  });
  Object.entries(TOOL_CHOICES).forEach(([k, list]) => {
    eq(new Set(list).size, list.length, `${k} : doublon dans la liste`);
    ok(list.every(t => !/\(choice\)/.test(t)), `${k} : un choix ne peut pas rester « (choice) »`);
  });

  // Les descriptions d'incantation ne doivent plus porter la formule 2014
  // (« mod + niveau ») : depuis 2024 le nombre vient de la table de classe.
  Object.entries(CLASS_DATA).forEach(([cls, d]) => {
    Object.values(d.features).flat().forEach(f => {
      if (!/Spellcasting|Pact Magic/i.test(f.name)) return;
      ok(!/modifier \+ (half your |your )?\w+ level/i.test(f.desc),
         `${cls} : description d'incantation encore en formule 2014`);
    });
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

  // Style de préparation : chaque lanceur déclare quand il peut échanger ses sorts.
  // Sans entrée, la fiche n'affiche aucune indication et le 📖 du grimoire disparaît.
  Object.entries(PREPARED_SPELLS).forEach(([cls]) => {
    ok(!!SPELL_PREP_STYLE[cls], `${cls} : lanceur sans style de préparation déclaré`);
  });
  Object.entries(SPELL_PREP_STYLE).forEach(([cls, st]) => {
    ok(!!CLASS_DATA[cls], `SPELL_PREP_STYLE : « ${cls} » n'est pas une classe connue`);
    ok(st.swap === 'long' || st.swap === 'level', `${cls} : swap invalide (${st.swap})`);
    ok(typeof st.book === 'boolean', `${cls} : book doit être un booléen`);
  });
  // Le grimoire est propre au Magicien (PHB 2024)
  eq(Object.entries(SPELL_PREP_STYLE).filter(([, s]) => s.book).map(([c]) => c).join(','),
     'Wizard', 'seul le Magicien a un grimoire');
  // Liste fixe (échange au niveau) : Barde, Rôdeur, Ensorceleur, Occultiste
  eq(Object.entries(SPELL_PREP_STYLE).filter(([, s]) => s.swap === 'level').map(([c]) => c).sort().join(','),
     'Bard,Ranger,Sorcerer,Warlock', 'classes à liste fixe (PHB 2024)');

  // La premiere capacite d'une sous-classe tombe au niveau 3 (PHB 2024).
  // Un reliquat 2014 (niveau 2 pour Druide/Magicien) laisserait le joueur sans
  // aucune capacite entre le niveau 3 et le niveau 6.
  Object.entries(SUBCLASS_DATA).forEach(([cls, subs]) => {
    Object.entries(subs).forEach(([sub, byLevel]) => {
      const levels = Object.keys(byLevel).map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
      if (!levels.length) return;
      eq(levels[0], 3, `${cls}/${sub} : premiere capacite au niveau ${levels[0]} au lieu de 3`);
    });
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

  /* -- Actions de groupe : degats avec PV temporaires, soins, sauvegardes -- */
  eval([
    extract(D, 'function applyDamageWithTemp(cible, degats)'),
    extract(D, 'function applyHealing(cible, soin)'),
    extract(D, 'function rollGroupSave(cibles, dc)'),
  ].join('\n'));

  // Les PV temporaires absorbent en premier (regle 2024)
  eq(applyDamageWithTemp({ hp:30, temp:0 }, 12), { hp:18, temp:0, absorbe:0, applique:12 },
     'degats sans PV temporaires');
  eq(applyDamageWithTemp({ hp:30, temp:15 }, 12), { hp:30, temp:3, absorbe:12, applique:0 },
     'PV temporaires absorbent tout');
  eq(applyDamageWithTemp({ hp:30, temp:5 }, 12), { hp:23, temp:0, absorbe:5, applique:7 },
     'absorption partielle');
  eq(applyDamageWithTemp({ hp:5, temp:0 }, 50), { hp:0, temp:0, absorbe:0, applique:50 },
     'les PV ne passent jamais sous zero');
  eq(applyDamageWithTemp({ hp:30, temp:5 }, 0), { hp:30, temp:5, absorbe:0, applique:0 },
     'degats nuls : rien ne bouge');
  eq(applyDamageWithTemp({ hp:30, temp:0 }, -5), { hp:30, temp:0, absorbe:0, applique:0 },
     'degats negatifs ignores');

  // Soins plafonnes au maximum
  eq(applyHealing({ hp:20, hpMax:30 }, 25), { hp:30, rendu:10 }, 'soin plafonne au maximum');
  eq(applyHealing({ hp:10, hpMax:30 }, 8), { hp:18, rendu:8 }, 'soin normal');
  eq(applyHealing({ hp:30, hpMax:30 }, 10), { hp:30, rendu:0 }, 'deja au maximum');
  eq(applyHealing({ hp:0, hpMax:30 }, 5), { hp:5, rendu:5 }, 'un personnage a terre remonte');

  // Sauvegardes de groupe
  {
    const res = rollGroupSave([{ id:'a', label:'Thorin', mod:5 }, { id:'b', label:'Elara', mod:-1 }], 15);
    eq(res.length, 2, 'un resultat par cible');
    ok(res.every(r => r.total === r.de + r.mod), 'total = de + modificateur');
    ok(res.every(r => r.de >= 1 && r.de <= 20), 'le de reste dans ses bornes');
    ok(res.every(r => r.reussi === (r.total >= 15)), 'reussite evaluee sur le DD');
    eq(rollGroupSave([], 15), [], 'aucune cible');
    eq(rollGroupSave(null, 15), [], 'cibles absentes');
    // Un DD de 1 est toujours reussi, un DD de 30 avec mod 0 jamais
    ok(rollGroupSave([{ id:'x', mod:0 }], 1)[0].reussi, 'DD 1 toujours reussi');
    ok(!rollGroupSave([{ id:'x', mod:0 }], 30)[0].reussi, 'DD 30 sans modificateur : impossible');
  }

  // Multiclasse + Jack of All Trades
  eq(dmCalc({ classes: [{ niveau: 3 }, { niveau: 2 }] }).totalLevel, 5, 'dmCalc niveau total multiclasse');
  const bard = dmCalc({ niveau: 4, dex: 10, jackOfAllTrades: true });
  eq(bard.skill({ key: 'acrobaties', attr: 'dex' }).val, 1, 'dmCalc Jack of All Trades (demi-PB)');

  eq(dmFmt(3), '+3', 'dmFmt positif');
  eq(dmFmt(-1), '-1', 'dmFmt négatif');
  eq(dmMod(14), 2, 'dmMod');
}

/* ══════════ js/monsters.js — bestiaire ══════════ */
{
  /* Le module est une IIFE sur window : on l'exécute avec un faux global pour
     récupérer l'API publique, plutôt que d'extraire fonction par fonction. */
  const src = staged('js/monsters.js');
  const faux = {};
  new Function('window', src)(faux);
  const B = faux.Bestiaire;

  ok(!!B, 'Bestiaire exposé');

  // Facteur de puissance : fractions, valeurs, libellés
  eq(B.crValue('1/2'), 0.5, 'FP 1/2 en valeur');
  eq(B.crValue('1/8'), 0.125, 'FP 1/8 en valeur');
  eq(B.crValue(7), 7, 'FP numérique inchangé');
  eq(B.crValue(null), 0, 'FP absent = 0');
  eq(B.crLabel(0.25), '1/4', 'FP 0,25 affiché en fraction');
  eq(B.crLabel(12), '12', 'FP entier affiché tel quel');

  // Bonus de maîtrise : +2 jusqu'à FP 4, puis +1 tous les 4 FP
  eq(B.pbFromCr(0), 2, 'PB au FP 0');
  eq(B.pbFromCr(4), 2, 'PB au FP 4');
  eq(B.pbFromCr(5), 3, 'PB au FP 5');
  eq(B.pbFromCr(8), 3, 'PB au FP 8');
  eq(B.pbFromCr(9), 4, 'PB au FP 9');
  eq(B.pbFromCr(17), 6, 'PB au FP 17');
  eq(B.pbFromCr(21), 7, 'PB au FP 21');
  eq(B.pbFromCr('1/2'), 2, 'PB au FP fractionnaire');

  // Expérience
  eq(B.xpFromCr('1/4'), 50, 'PX au FP 1/4');
  eq(B.xpFromCr(10), 5900, 'PX au FP 10');
  eq(B.xpFromCr(30), 155000, 'PX au FP 30');
  eq(B.xpFromCr(99), 0, 'FP hors table : pas de PX inventés');

  // Moyenne des dés de vie
  eq(B.avgHitDice('20d10 + 40'), 150, 'PV moyens 20d10+40');
  eq(B.avgHitDice('6d6+6'), 27, 'PV moyens 6d6+6');
  eq(B.avgHitDice('2d6'), 7, 'PV moyens 2d6');
  eq(B.avgHitDice('4d8 - 4'), 14, 'PV moyens avec bonus négatif');
  eq(B.avgHitDice(''), 0, 'dés de vie absents');
  eq(B.avgHitDice('nawak'), 0, 'dés de vie illisibles');

  eq(B.mod(21), 5, 'modificateur de 21');
  eq(B.mod(9), -1, 'modificateur de 9');

  /* Normalisation — schéma local (champs à plat, valeurs en texte) */
  const local = {
    name: 'Sbire', size: 'Small', type: 'Humanoid', subtype: 'Halfling',
    alignment: 'Neutral Evil', armor_class: 13, armor_desc: 'studded leather',
    hit_points: 27, hit_dice: '6d6+6', speed: { walk: '40 ft.' },
    strength: 10, dexterity: 15, constitution: 12,
    intelligence: 12, wisdom: 10, charisma: 14,
    saving_throws: { dexterity: '+4' }, skills: { stealth: '+5' },
    damage_resistances: ['poison'], damage_immunities: [], condition_immunities: [],
    senses: 'passive Perception 12', languages: 'Common', challenge_rating: '1/2', cr: 0.5,
    special_abilities: [{ name: 'Hustle', desc: 'Bonus Action.' }],
    actions: [{ name: 'Shortsword', desc: '+4, 5 (1d6+2).' }],
    bonus_actions: [{ name: 'Hustle', desc: 'Move.' }]
  };
  const n1 = B.normaliser(local, 'Eberron');
  eq(n1.name, 'Sbire', 'nom conservé');
  eq(n1.source, 'Eberron', 'source du supplément');
  eq(n1.ac, 13, 'CA locale');
  eq(n1.hp, 27, 'PV locaux');
  eq(n1.speed.walk, 40, 'vitesse « 40 ft. » convertie en nombre');
  eq(n1.scores.dex, 15, 'score de DEX à plat');
  eq(n1.mods.dex, 2, 'modificateur calculé faute de source');
  eq(n1.saves.dex, 4, 'sauvegarde « +4 » convertie');
  eq(n1.skills.stealth, 5, 'compétence convertie');
  eq(n1.sens.pp, 12, 'Perception passive extraite du texte');
  eq(n1.resistances, ['poison'], 'résistances locales');
  eq(n1.pb, 2, 'PB déduit du FP');
  eq(n1.xp, 100, 'PX déduits du FP');
  eq(n1.traits.length, 1, 'special_abilities lus comme traits');
  eq(n1.actions.length, 1, 'actions locales');
  eq(n1.bonusActions.length, 1, 'actions bonus locales');
  eq(n1.reactions, [], 'réactions absentes');

  /* Normalisation — schéma API v2 (objets imbriqués, valeurs numériques) */
  const api = {
    key: 'srd-2024_truc', name: 'Truc',
    size: { name: 'Large' }, type: { name: 'Aberration' }, alignment: 'lawful evil',
    challenge_rating: 10, armor_class: 17, armor_detail: 'natural armor',
    hit_points: 150, hit_dice: '20d10 + 40', speed: { walk: 10, swim: 40, unit: 'feet' },
    ability_scores: { strength: 21, dexterity: 9, constitution: 15, intelligence: 18, wisdom: 15, charisma: 18 },
    modifiers: { strength: 5, dexterity: -1, constitution: 2, intelligence: 4, wisdom: 2, charisma: 4 },
    saving_throws: { strength: 5, dexterity: 3, constitution: 6, intelligence: 8, wisdom: 6, charisma: 4 },
    skill_bonuses: { history: 12, perception: 10 },
    resistances_and_immunities: { damage_immunities_display: 'psychic', damage_resistances: [], condition_immunities: [], damage_vulnerabilities: [] },
    darkvision_range: 120, passive_perception: 20,
    languages: { as_string: 'Deep Speech' }, initiative_bonus: 7,
    traits: [{ name: 'Amphibious', desc: 'Respire.' }],
    actions: [
      { name: 'Multiattack', desc: 'Trois attaques.', action_type: 'ACTION', order_in_statblock: 1 },
      { name: 'Lash', desc: 'Réaction légendaire.', action_type: 'LEGENDARY_ACTION', order_in_statblock: 2 },
      { name: 'Esquive', desc: 'Réaction.', action_type: 'REACTION', order_in_statblock: 3 }
    ]
  };
  const n2 = B.normaliser(api, 'SRD 2024');
  eq(n2.size, 'Large', 'taille désimbriquée');
  eq(n2.type, 'Aberration', 'type désimbriqué');
  eq(n2.speed.swim, 40, 'vitesse de nage');
  eq(n2.mods.for, 5, 'modificateur fourni par l API');
  /* L'API donne les six sauvegardes ; seules celles qui dépassent le
     modificateur sont des maîtrises. */
  eq(n2.saves.for, undefined, 'FOR non maîtrisée : écartée');
  eq(n2.saves.int, 8, 'INT maîtrisée : conservée');
  eq(Object.keys(n2.saves).length, 4, 'quatre sauvegardes maîtrisées');
  eq(n2.immunites, ['psychic'], 'immunités lues depuis le champ d affichage');
  eq(n2.sens.pp, 20, 'Perception passive de l API');
  ok(n2.sens.texte.includes('darkvision 120'), 'portée de vision dans le noir présente');
  ok(n2.sens.texte.includes('passive Perception 20'), 'Perception passive dans le texte des sens');
  eq(n2.initiative, 7, 'initiative fournie par l API');
  eq(n2.actions.length, 1, 'seules les ACTION dans actions');
  eq(n2.legendaires.length, 1, 'actions légendaires triées à part');
  eq(n2.reactions.length, 1, 'réactions triées à part');
  eq(n2.traits.length, 1, 'traits v2');
  eq(B.normaliser(null), null, 'entrée nulle refusée');
  eq(B.normaliser({}), null, 'entrée sans nom refusée');

  /* Tranches de FP du filtre */
  ok(B.dansTrancheCr(0, '0'), 'FP 0 dans la tranche 0');
  ok(!B.dansTrancheCr(1, '0'), 'FP 1 hors de la tranche « moins de 1 »');
  ok(B.dansTrancheCr('1/2', '0'), 'FP 1/2 dans la tranche « moins de 1 »');
  ok(!B.dansTrancheCr('1/2', '5'), 'FP 1/2 hors de la tranche 1-5');
  ok(B.dansTrancheCr(5, '5'), 'FP 5 borne haute incluse');
  ok(!B.dansTrancheCr(6, '5'), 'FP 6 hors tranche 1-5');
  ok(B.dansTrancheCr(10, '10'), 'FP 10 dans 6-10');
  ok(B.dansTrancheCr(25, '21'), 'FP 25 dans 21+');
  ok(B.dansTrancheCr(3, ''), 'filtre vide : tout passe');

  /* Recherche */
  const catalogue = [n1, n2];
  eq(B.filtrer(catalogue, { q: 'sbi' }).length, 1, 'recherche par nom');
  eq(B.filtrer(catalogue, { q: 'aberration' }).length, 1, 'recherche par type');
  eq(B.filtrer(catalogue, { q: 'zzz' }).length, 0, 'recherche sans résultat');
  eq(B.filtrer(catalogue, { type: 'Humanoid' }).length, 1, 'filtre de type');
  eq(B.filtrer(catalogue, { cr: '10' }).length, 1, 'filtre de FP');
  eq(B.filtrer(catalogue, {}).length, 2, 'aucun filtre');
  eq(B.filtrer(null, {}), [], 'liste absente');

  /* Tri : FP croissant puis nom */
  const tri = B.trier([{ name: 'B', cr: 5 }, { name: 'A', cr: 5 }, { name: 'C', cr: 1 }]);
  eq(tri.map(m => m.name), ['C', 'A', 'B'], 'tri par FP puis par nom');

  eq(B.typesConnus(catalogue), ['Aberration', 'Humanoid'], 'types du catalogue');

  /* Rendu : la fiche doit contenir les repères que le MJ cherche */
  const html = B.ficheHtml(n2);
  ok(html.includes('CA</b> 17'), 'fiche : CA');
  ok(html.includes('150'), 'fiche : PV');
  ok(html.includes('FP</b> 10'), 'fiche : FP');
  ok(html.includes('Actions légendaires'), 'fiche : section légendaire');
  ok(html.includes('Amphibious'), 'fiche : trait');
  eq(B.ficheHtml(null), '', 'fiche vide sans monstre');

  /* Échappement : un nom hostile ne doit pas produire de balise */
  const mechant = B.normaliser({ name: '<img src=x onerror=alert(1)>', armor_class: 1, hit_points: 1 }, 'x');
  ok(!B.ficheHtml(mechant).includes('<img'), 'fiche : nom échappé');

  eq(B.vitesseTexte({ walk: 30, fly: 60 }), '30 ft, vol 60 ft', 'vitesses en texte');
  eq(B.vitesseTexte({}), '—', 'aucune vitesse');
}

/* ══════════ Modificateur de dégâts ══════════ */
{
  const J = staged('joueurs.html');
  eval(extract(J, 'function getDmgMod('));
  eval(extract(J, 'function dmgModLabel('));

  /* getDmgMod lit le personnage courant : on lui en fournit un. */
  let _perso = { mods: [] };
  C = () => _perso;

  eq(getDmgMod(), '', 'aucun modificateur');

  _perso.mods = [{ name:'Divine Favor', cible:'dmg', val:'1d4', on:true }];
  eq(getDmgMod(), '+1d4', 'signe ajoute a un de sans signe');
  eq(dmgModLabel(), ' (Divine Favor)', 'nom de la source');

  _perso.mods[0].on = false;
  eq(getDmgMod(), '', 'modificateur desactive : ignore');

  _perso.mods = [{ cible:'dmg', val:'+1d6', on:true }];
  eq(getDmgMod(), '+1d6', 'signe deja present : conserve');

  _perso.mods = [{ cible:'dmg', val:'-2', on:true }];
  eq(getDmgMod(), '-2', 'malus conserve');

  _perso.mods = [
    { name:'Divine Favor', cible:'dmg', val:'1d4', on:true },
    { name:'Rage',         cible:'dmg', val:'2',   on:true }
  ];
  eq(getDmgMod(), '+1d4+2', 'deux bonus se cumulent dans l expression');
  eq(dmgModLabel(), ' (Divine Favor, Rage)', 'les deux sources nommees');

  /* Une valeur vide ne doit pas produire un « + » orphelin qui casserait le jet */
  _perso.mods = [{ name:'Vide', cible:'dmg', val:'', on:true },
                 { name:'Bon',  cible:'dmg', val:'1d4', on:true }];
  eq(getDmgMod(), '+1d4', 'valeur vide ignoree');
  eq(dmgModLabel(), ' (Bon)', 'source vide non nommee');

  /* Les autres cibles ne polluent pas les degats */
  _perso.mods = [{ cible:'atk', val:2, on:true }, { cible:'ac', val:1, on:true }];
  eq(getDmgMod(), '', 'seules les cibles dmg comptent');
}

/* ══════════ Verdict ══════════ */
if (failures.length) {
  console.error(`✗ Smoke-tests : ${failures.length} échec(s) sur ${assertions} assertions`);
  failures.forEach(f => console.error('  • ' + f));
  process.exit(1);
}
console.log(`✓ Smoke-tests OK (${assertions} assertions)`);
