/* ══ Bestiaire — chargement, normalisation et rendu des fiches de monstre ══

   Deux sources, deux schémas incompatibles :

   - API Open5e v2 (`/v2/creatures/`, SRD 2024) : objets imbriqués, valeurs
     numériques, actions regroupées dans un seul tableau porteur d'un
     `action_type` (ACTION, BONUS_ACTION, REACTION, LEGENDARY_ACTION).
   - fichiers locaux (monsters-eberron.json, monsters-faerun-*.json) : champs à
     plat, valeurs en texte (« 40 ft. », « +4 »), tableaux séparés pour actions,
     actions bonus et réactions.

   `normaliser` ramène les deux à une forme unique. Tout ce qui calcule est pur
   et testé par les smoke-tests ; seul `charger` touche au réseau.
   ═══════════════════════════════════════════════════════════════════════ */
(function (global) {

  const O5E = 'https://api.open5e.com';
  const DOC = 'srd-2024';
  /* Suppléments maison, chargés après l'API pour passer devant elle en cas
     d'homonyme : une version locale corrigée doit gagner. */
  const LOCAUX = [
    ['monsters-eberron.json',           'Eberron'],
    ['monsters-faerun-heroes.json',     'Faerûn'],
    ['monsters-faerun-adventures.json', 'Faerûn']
  ];

  const ABILS = [
    ['for', 'strength',     'FOR'],
    ['dex', 'dexterity',    'DEX'],
    ['con', 'constitution', 'CON'],
    ['int', 'intelligence', 'INT'],
    ['sag', 'wisdom',       'SAG'],
    ['cha', 'charisma',     'CHA']
  ];

  /* ── Calculs purs ──────────────────────────────────────────────────── */

  function mod(score) {
    return Math.floor(((parseInt(score, 10) || 10) - 10) / 2);
  }

  /* Bonus de maîtrise d'un monstre : +2 jusqu'à FP 4, puis +1 tous les 4 FP. */
  function pbFromCr(cr) {
    const n = crValue(cr);
    return 2 + Math.floor(Math.max(0, n - 1) / 4);
  }

  /* '1/2' → 0.5 ; 0.125 → 0.125 ; '—' → 0 */
  function crValue(cr) {
    if (typeof cr === 'number') return cr;
    if (cr == null) return 0;
    const s = String(cr).trim();
    if (s.includes('/')) {
      const [a, b] = s.split('/').map(Number);
      return b ? a / b : 0;
    }
    const n = parseFloat(s);
    return isNaN(n) ? 0 : n;
  }

  /* 0.5 → '1/2' — l'affichage d'un FP fractionnaire se fait en fraction. */
  function crLabel(cr) {
    const n = crValue(cr);
    if (n === 0.125) return '1/8';
    if (n === 0.25)  return '1/4';
    if (n === 0.5)   return '1/2';
    return String(n);
  }

  const XP_PAR_FP = {
    0: 10, 0.125: 25, 0.25: 50, 0.5: 100,
    1: 200, 2: 450, 3: 700, 4: 1100, 5: 1800, 6: 2300, 7: 2900, 8: 3900,
    9: 5000, 10: 5900, 11: 7200, 12: 8400, 13: 10000, 14: 11500, 15: 13000,
    16: 15000, 17: 18000, 18: 20000, 19: 22000, 20: 25000, 21: 33000,
    22: 41000, 23: 50000, 24: 62000, 25: 75000, 26: 90000, 27: 105000,
    28: 120000, 29: 135000, 30: 155000
  };

  function xpFromCr(cr) {
    const n = crValue(cr);
    return XP_PAR_FP[n] != null ? XP_PAR_FP[n] : 0;
  }

  /* '20d10 + 40' → 150. Sert de repli quand la source ne donne pas les PV. */
  function avgHitDice(dice) {
    if (!dice) return 0;
    const m = String(dice).replace(/\s+/g, '').match(/^(\d+)d(\d+)([+-]\d+)?$/);
    if (!m) return 0;
    const n = +m[1], face = +m[2], bonus = m[3] ? +m[3] : 0;
    return Math.floor(n * (face + 1) / 2) + bonus;
  }

  /* Les vitesses arrivent en nombre (API) ou en texte « 40 ft. » (local). */
  function vitesseNombre(v) {
    if (typeof v === 'number') return v;
    if (!v) return 0;
    const m = String(v).match(/\d+/);
    return m ? +m[0] : 0;
  }

  function nettoieSigne(v) {
    if (v == null || v === '') return null;
    const n = typeof v === 'number' ? v : parseInt(String(v).replace('+', ''), 10);
    return isNaN(n) ? null : n;
  }

  function signe(n) {
    return (n >= 0 ? '+' : '') + n;
  }

  /* ── Normalisation ─────────────────────────────────────────────────── */

  function normaliser(brut, source) {
    if (!brut || !brut.name) return null;
    const v2 = !!brut.ability_scores;          // seule l'API v2 imbrique les scores

    const scores = {}, mods = {};
    ABILS.forEach(([cle, champ]) => {
      const s = v2 ? brut.ability_scores[champ] : brut[champ];
      scores[cle] = parseInt(s, 10) || 10;
      const m = v2 && brut.modifiers ? brut.modifiers[champ] : null;
      mods[cle] = m != null ? m : mod(scores[cle]);
    });

    const cr = v2 ? brut.challenge_rating : (brut.cr != null ? brut.cr : brut.challenge_rating);
    const pb = brut.proficiency_bonus != null ? brut.proficiency_bonus : pbFromCr(cr);

    /* Sauvegardes : l'API les donne toutes, maîtrisées ou non. On ne garde que
       celles qui dépassent le modificateur — les autres n'apportent rien. */
    const saves = {};
    const savesBruts = brut.saving_throws || {};
    ABILS.forEach(([cle, champ]) => {
      const val = nettoieSigne(savesBruts[champ] != null ? savesBruts[champ] : savesBruts[cle]);
      if (val != null && (!v2 || val !== mods[cle])) saves[cle] = val;
    });

    const skills = {};
    const skillsBruts = v2 ? (brut.skill_bonuses || {}) : (brut.skills || {});
    Object.keys(skillsBruts).forEach(k => {
      const val = nettoieSigne(skillsBruts[k]);
      if (val != null) skills[k] = val;
    });

    const speed = {};
    const speedBrut = brut.speed || {};
    ['walk', 'fly', 'swim', 'climb', 'burrow'].forEach(k => {
      const n = vitesseNombre(speedBrut[k]);
      if (n) speed[k] = n;
    });
    if (speedBrut.hover || brut.speed_all?.hover) speed.hover = true;

    const ri = brut.resistances_and_immunities || {};
    const liste = (v2Champ, localChamp) => {
      if (v2) {
        const aff = ri[v2Champ + '_display'];
        if (aff) return [aff];
        const arr = ri[v2Champ];
        return Array.isArray(arr) && arr.length ? arr.map(x => x.name || x) : [];
      }
      const arr = brut[localChamp];
      return Array.isArray(arr) ? arr : (arr ? [arr] : []);
    };

    return {
      key:   brut.key || (brut.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name:  brut.name,
      source: source || (v2 ? 'SRD 2024' : 'Local'),
      size:  v2 ? (brut.size?.name || '') : (brut.size || ''),
      type:  v2 ? (brut.type?.name || '') : (brut.type || ''),
      subtype: brut.subtype || '',
      alignment: brut.alignment || '',
      ac:      parseInt(brut.armor_class, 10) || 10,
      acDesc:  brut.armor_detail || brut.armor_desc || '',
      hp:      parseInt(brut.hit_points, 10) || avgHitDice(brut.hit_dice),
      hitDice: brut.hit_dice || '',
      speed,
      scores, mods, saves, skills,
      resistances:   liste('damage_resistances',    'damage_resistances'),
      immunites:     liste('damage_immunities',     'damage_immunities'),
      vulnerabilites: liste('damage_vulnerabilities', 'damage_vulnerabilities'),
      immunitesEtat: liste('condition_immunities',  'condition_immunities'),
      sens: sensDe(brut, v2, mods),
      langues: v2 ? (brut.languages?.as_string || '') : (brut.languages || ''),
      cr, pb, xp: xpFromCr(cr),
      initiative: brut.initiative_bonus != null ? brut.initiative_bonus : mods.dex,
      traits:       actionsDe(brut, v2, 'traits'),
      actions:      actionsDe(brut, v2, 'actions'),
      bonusActions: actionsDe(brut, v2, 'bonus'),
      reactions:    actionsDe(brut, v2, 'reactions'),
      legendaires:  actionsDe(brut, v2, 'legendary')
    };
  }

  /* Les sens sont éclatés en portées côté API, réunis en une phrase côté local. */
  function sensDe(brut, v2, mods) {
    if (!v2) {
      const txt = brut.senses || '';
      const pp = (txt.match(/passive Perception\s+(\d+)/i) || [])[1];
      return { texte: txt, pp: pp ? +pp : null };
    }
    /* Les sens restent en anglais : c'est de la donnée de règles, au même titre
       que le nom du monstre et le texte de ses actions. La fiche sert les deux
       pages, dont celle des joueurs qui est entièrement en anglais. */
    const bouts = [];
    const ajoute = (label, portee) => { if (portee) bouts.push(label + ' ' + portee + ' ft.'); };
    ajoute('blindsight', brut.blindsight_range);
    ajoute('darkvision', brut.darkvision_range);
    ajoute('tremorsense', brut.tremorsense_range);
    ajoute('truesight', brut.truesight_range);
    const pp = brut.passive_perception != null ? brut.passive_perception : 10 + (mods.sag || 0);
    bouts.push('passive Perception ' + pp);
    return { texte: bouts.join(', '), pp };
  }

  /* L'API range tout dans `actions` et distingue par action_type ; les fichiers
     locaux ont un tableau par catégorie et appellent les traits
     `special_abilities`. */
  function actionsDe(brut, v2, categorie) {
    const propre = a => ({ name: a.name || '', desc: a.desc || a.description || '' });
    if (!v2) {
      const champ = { traits: 'special_abilities', actions: 'actions',
                      bonus: 'bonus_actions', reactions: 'reactions',
                      legendary: 'legendary_actions' }[categorie];
      const arr = brut[champ];
      return Array.isArray(arr) ? arr.map(propre) : [];
    }
    if (categorie === 'traits') {
      return Array.isArray(brut.traits) ? brut.traits.map(propre) : [];
    }
    const type = { actions: 'ACTION', bonus: 'BONUS_ACTION',
                   reactions: 'REACTION', legendary: 'LEGENDARY_ACTION' }[categorie];
    const arr = Array.isArray(brut.actions) ? brut.actions : [];
    return arr.filter(a => (a.action_type || 'ACTION') === type)
              .sort((a, b) => (a.order_in_statblock || 0) - (b.order_in_statblock || 0))
              .map(propre);
  }

  /* ── Recherche et filtres ──────────────────────────────────────────── */

  /* Les tranches de FP reprennent celles du compendium joueur : la valeur du
     filtre est la borne haute de la tranche. */
  function dansTrancheCr(cr, tranche) {
    if (tranche === '' || tranche == null) return true;
    const n = crValue(cr);
    if (tranche === '0')  return n < 1;   // couvre 0, 1/8, 1/4, 1/2
    if (tranche === '5')  return n >= 1 && n <= 5;
    if (tranche === '10') return n >= 6 && n <= 10;
    if (tranche === '20') return n >= 11 && n <= 20;
    if (tranche === '21') return n > 20;
    return crValue(tranche) === n;
  }

  function filtrer(liste, f) {
    const q = (f && f.q ? String(f.q) : '').trim().toLowerCase();
    const type = (f && f.type) || '';
    const cr = f ? f.cr : '';
    return (liste || []).filter(m => {
      if (type && (m.type || '').toLowerCase() !== type.toLowerCase()) return false;
      if (!dansTrancheCr(m.cr, cr)) return false;
      if (!q) return true;
      return (m.name || '').toLowerCase().includes(q)
          || (m.type || '').toLowerCase().includes(q)
          || (m.subtype || '').toLowerCase().includes(q);
    });
  }

  /* Tri d'affichage : par FP croissant puis par nom, pour que le MJ balaie une
     tranche de puissance d'un coup d'œil. */
  function trier(liste) {
    return (liste || []).slice().sort((a, b) => {
      const d = crValue(a.cr) - crValue(b.cr);
      return d !== 0 ? d : (a.name || '').localeCompare(b.name || '');
    });
  }

  /* ── Chargement ────────────────────────────────────────────────────── */

  let _cache = null;
  let _enCours = null;

  async function _pagine(url) {
    let out = [], next = url, garde = 0;
    while (next && garde++ < 20) {
      const r = await fetch(next);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const d = await r.json();
      out = out.concat(d.results || []);
      next = d.next;
    }
    return out;
  }

  /* L'API peut être lente ou absente : les suppléments locaux sont chargés dans
     tous les cas, pour que le bestiaire reste utilisable hors ligne. */
  async function charger() {
    if (_cache) return _cache;
    if (_enCours) return _enCours;
    _enCours = (async () => {
      const locaux = [];
      for (const [fichier, source] of LOCAUX) {
        try {
          const r = await fetch(fichier);
          if (!r.ok) continue;
          const d = await r.json();
          (Array.isArray(d) ? d : []).forEach(b => {
            const m = normaliser(b, source);
            if (m) locaux.push(m);
          });
        } catch (e) { /* un supplément manquant ne doit pas tout arrêter */ }
      }
      let api = [];
      try {
        const bruts = await _pagine(`${O5E}/v2/creatures/?document__key__in=${DOC}&limit=300`);
        api = bruts.map(b => normaliser(b, 'SRD 2024')).filter(Boolean);
      } catch (e) { /* hors ligne : on se contente des suppléments */ }

      /* Un monstre local remplace son homonyme du SRD. */
      const parNom = new Map();
      api.forEach(m => parNom.set(m.name.toLowerCase(), m));
      locaux.forEach(m => parNom.set(m.name.toLowerCase(), m));
      _cache = trier([...parNom.values()]);
      return _cache;
    })();
    return _enCours;
  }

  function typesConnus(liste) {
    return [...new Set((liste || []).map(m => m.type).filter(Boolean))].sort();
  }

  /* ── Rendu ─────────────────────────────────────────────────────────── */

  function esc(v) {
    if (v == null) return '';
    return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  const NOM_VITESSE = { walk: '', fly: 'vol', swim: 'nage', climb: 'escalade', burrow: 'fouissement' };

  function vitesseTexte(speed) {
    const bouts = [];
    if (speed.walk) bouts.push(speed.walk + ' ft');
    ['fly', 'swim', 'climb', 'burrow'].forEach(k => {
      if (speed[k]) bouts.push(NOM_VITESSE[k] + ' ' + speed[k] + ' ft');
    });
    if (speed.hover) bouts.push('vol stationnaire');
    return bouts.join(', ') || '—';
  }

  function listeTexte(arr) {
    return (arr || []).join(', ');
  }

  function sousTitre(m) {
    const bouts = [m.size, m.type + (m.subtype ? ' (' + m.subtype + ')' : '')].filter(Boolean);
    let s = bouts.join(' ');
    if (m.alignment) s += ', ' + m.alignment;
    return s;
  }

  function blocActions(titre, arr) {
    if (!arr || !arr.length) return '';
    return `<div class="mst-sect"><div class="mst-sect-t">${esc(titre)}</div>`
      + arr.map(a => `<p class="mst-a"><b>${esc(a.name)}.</b> ${esc(a.desc)}</p>`).join('')
      + '</div>';
  }

  /* Fiche complète, telle qu'affichée dans le panneau de combat. */
  function ficheHtml(m) {
    if (!m) return '';
    const abil = ABILS.map(([cle, , label]) =>
      `<div class="mst-ab"><span class="mst-ab-l">${label}</span>`
      + `<span class="mst-ab-s">${m.scores[cle]}</span>`
      + `<span class="mst-ab-m">${signe(m.mods[cle])}</span></div>`).join('');

    const lignes = [];
    const savesTxt = ABILS.filter(([c]) => m.saves[c] != null)
      .map(([c, , l]) => l + ' ' + signe(m.saves[c])).join(', ');
    if (savesTxt) lignes.push(['Sauvegardes', savesTxt]);
    const skillsTxt = Object.keys(m.skills)
      .map(k => k.charAt(0).toUpperCase() + k.slice(1).replace(/_/g, ' ') + ' ' + signe(m.skills[k]))
      .join(', ');
    if (skillsTxt) lignes.push(['Compétences', skillsTxt]);
    if (m.vulnerabilites.length) lignes.push(['Vulnérabilités', listeTexte(m.vulnerabilites)]);
    if (m.resistances.length)    lignes.push(['Résistances',    listeTexte(m.resistances)]);
    if (m.immunites.length)      lignes.push(['Immunités',      listeTexte(m.immunites)]);
    if (m.immunitesEtat.length)  lignes.push(['Immunités d’état', listeTexte(m.immunitesEtat)]);
    if (m.sens.texte)            lignes.push(['Sens',           m.sens.texte]);
    if (m.langues)               lignes.push(['Langues',        m.langues]);

    return `<div class="mst">
      <div class="mst-sub">${esc(sousTitre(m))}</div>
      <div class="mst-core">
        <span><b>CA</b> ${m.ac}${m.acDesc ? ' (' + esc(m.acDesc) + ')' : ''}</span>
        <span><b>PV</b> ${m.hp}${m.hitDice ? ' (' + esc(m.hitDice) + ')' : ''}</span>
        <span><b>Vitesse</b> ${esc(vitesseTexte(m.speed))}</span>
      </div>
      <div class="mst-abils">${abil}</div>
      <div class="mst-lines">
        ${lignes.map(([l, v]) => `<div><b>${l}</b> ${esc(v)}</div>`).join('')}
        <div><b>FP</b> ${esc(crLabel(m.cr))} (${m.xp.toLocaleString('fr-FR')} PX) · <b>PB</b> ${signe(m.pb)}</div>
      </div>
      ${blocActions('Traits', m.traits)}
      ${blocActions('Actions', m.actions)}
      ${blocActions('Actions bonus', m.bonusActions)}
      ${blocActions('Réactions', m.reactions)}
      ${blocActions('Actions légendaires', m.legendaires)}
    </div>`;
  }

  global.Bestiaire = {
    charger, normaliser, filtrer, trier, typesConnus,
    ficheHtml, vitesseTexte, sousTitre,
    mod, pbFromCr, crValue, crLabel, xpFromCr, avgHitDice, dansTrancheCr
  };

})(window);
