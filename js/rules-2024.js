/* ════════════════════════════════════════════════════════════
   KALEYSUR — Données de règles D&D 2024 (PHB)
   Extrait de joueurs.html : classes, sous-classes, espèces, backgrounds,
   feats, emplacements de sorts, ressources, équipement de départ.
   Chargé en script classique AVANT le script principal — les const du
   global lexical environment restent visibles par les scripts suivants.
   ════════════════════════════════════════════════════════════ */
/* ── Classes D&D 2024 — hit die + spellcasting ability ── */
const DND_CLASSES = {
  'Artificer': { de: '1d8',  sort: 'INT' },
  'Barbarian': { de: '1d12', sort: '' },
  'Bard':      { de: '1d8',  sort: 'CHA' },
  'Cleric':    { de: '1d8',  sort: 'SAG' },
  'Druid':     { de: '1d8',  sort: 'SAG' },
  'Fighter':   { de: '1d10', sort: '' },
  'Monk':      { de: '1d8',  sort: '' },
  'Paladin':   { de: '1d10', sort: 'CHA' },
  'Psion':     { de: '1d6',  sort: 'INT' },   // Unearthed Arcana 2025 (playtest)
  'Ranger':    { de: '1d10', sort: 'SAG' },
  'Rogue':     { de: '1d8',  sort: '' },
  'Sorcerer':  { de: '1d6',  sort: 'CHA' },
  'Warlock':   { de: '1d8',  sort: 'CHA' },
  'Wizard':    { de: '1d6',  sort: 'INT' },
};

/* ── Sorts préparés par niveau de classe (PHB 2024) ──
   En 2024 ce n'est plus « niveau + modificateur » mais une table fixe par classe.
   Index 0 = niveau 1. Les classes absentes ne préparent pas de sorts. */
const PREPARED_SPELLS = {
  // Lanceurs complets « standard »
  'Bard':      [4,5,6,7,9,10,11,12,14,15,16,16,17,17,18,18,19,20,21,22],
  'Cleric':    [4,5,6,7,9,10,11,12,14,15,16,16,17,17,18,18,19,20,21,22],
  'Druid':     [4,5,6,7,9,10,11,12,14,15,16,16,17,17,18,18,19,20,21,22],
  'Psion':     [4,5,6,7,9,10,11,12,14,15,16,16,17,17,18,18,19,20,21,22], // UA 2025
  'Sorcerer':  [2,4,6,7,9,10,11,12,14,15,16,16,17,17,18,18,19,20,21,22],
  'Wizard':    [4,5,6,7,9,10,11,12,14,15,16,16,17,18,19,21,22,23,24,25],
  // Demi-lanceurs et pacte
  'Warlock':   [2,3,4,5,6,7,8,9,10,10,11,11,12,12,13,13,14,14,15,15],
  'Paladin':   [2,3,4,5,6,6,7,7,9,9,10,10,11,11,12,12,14,14,15,15],
  'Ranger':    [2,3,4,5,6,6,7,7,9,9,10,10,11,11,12,12,14,14,15,15],
  'Artificer': [2,3,4,5,6,6,7,7,9,9,10,10,11,11,12,12,14,14,15,15],
};

/* ── Style de préparation des sorts (PHB 2024) ──
   La 2024 a supprimé les « sorts connus » : toutes les classes préparent des sorts.
   Ce qui change, c'est QUAND on peut les échanger — et le Magicien garde un grimoire.
     swap : 'long'  → échange à chaque repos long
            'level' → liste fixe, échange seulement en montant de niveau
     book : true    → les sorts non préparés restent accessibles (grimoire) */
const SPELL_PREP_STYLE = {
  'Artificer': { swap:'long',  book:false },
  'Cleric':    { swap:'long',  book:false },
  'Druid':     { swap:'long',  book:false },
  'Paladin':   { swap:'long',  book:false },
  'Psion':     { swap:'long',  book:false },   // UA 2025
  'Wizard':    { swap:'long',  book:true  },   // grimoire + sorts préparés du jour
  'Bard':      { swap:'level', book:false },
  'Ranger':    { swap:'level', book:false },
  'Sorcerer':  { swap:'level', book:false },
  'Warlock':   { swap:'level', book:false },
};

/* ── Spell Slot Tables ── */
const FULL_CASTER_SLOTS = {
  1:[2,0,0,0,0,0,0,0,0], 2:[3,0,0,0,0,0,0,0,0], 3:[4,2,0,0,0,0,0,0,0],
  4:[4,3,0,0,0,0,0,0,0], 5:[4,3,2,0,0,0,0,0,0], 6:[4,3,3,0,0,0,0,0,0],
  7:[4,3,3,1,0,0,0,0,0], 8:[4,3,3,2,0,0,0,0,0], 9:[4,3,3,3,1,0,0,0,0],
  10:[4,3,3,3,2,0,0,0,0], 11:[4,3,3,3,2,1,0,0,0], 12:[4,3,3,3,2,1,0,0,0],
  13:[4,3,3,3,2,1,1,0,0], 14:[4,3,3,3,2,1,1,0,0], 15:[4,3,3,3,2,1,1,1,0],
  16:[4,3,3,3,2,1,1,1,0], 17:[4,3,3,3,2,1,1,1,1], 18:[4,3,3,3,3,1,1,1,1],
  19:[4,3,3,3,3,2,1,1,1], 20:[4,3,3,3,3,2,2,1,1]
};
const HALF_CASTER_SLOTS = {
  1:[0,0,0,0,0,0,0,0,0], 2:[2,0,0,0,0,0,0,0,0], 3:[3,0,0,0,0,0,0,0,0],
  4:[3,0,0,0,0,0,0,0,0], 5:[4,2,0,0,0,0,0,0,0], 6:[4,2,0,0,0,0,0,0,0],
  7:[4,3,0,0,0,0,0,0,0], 8:[4,3,0,0,0,0,0,0,0], 9:[4,3,2,0,0,0,0,0,0],
  10:[4,3,2,0,0,0,0,0,0], 11:[4,3,3,0,0,0,0,0,0], 12:[4,3,3,0,0,0,0,0,0],
  13:[4,3,3,1,0,0,0,0,0], 14:[4,3,3,1,0,0,0,0,0], 15:[4,3,3,2,0,0,0,0,0],
  16:[4,3,3,2,0,0,0,0,0], 17:[4,3,3,3,1,0,0,0,0], 18:[4,3,3,3,1,0,0,0,0],
  19:[4,3,3,3,2,0,0,0,0], 20:[4,3,3,3,2,0,0,0,0]
};
const WARLOCK_SLOTS = {
  1:[1,0,0,0,0,0,0,0,0], 2:[2,0,0,0,0,0,0,0,0], 3:[0,2,0,0,0,0,0,0,0],
  4:[0,2,0,0,0,0,0,0,0], 5:[0,0,2,0,0,0,0,0,0], 6:[0,0,2,0,0,0,0,0,0],
  7:[0,0,0,2,0,0,0,0,0], 8:[0,0,0,2,0,0,0,0,0], 9:[0,0,0,0,2,0,0,0,0],
  10:[0,0,0,0,2,0,0,0,0], 11:[0,0,0,0,3,0,0,0,0], 12:[0,0,0,0,3,0,0,0,0],
  13:[0,0,0,0,3,0,0,0,0], 14:[0,0,0,0,3,0,0,0,0], 15:[0,0,0,0,3,0,0,0,0],
  16:[0,0,0,0,3,0,0,0,0], 17:[0,0,0,0,4,0,0,0,0], 18:[0,0,0,0,4,0,0,0,0],
  19:[0,0,0,0,4,0,0,0,0], 20:[0,0,0,0,4,0,0,0,0]
};
const ARTIFICER_SLOTS = {
  1:[2,0,0,0,0,0,0,0,0], 2:[2,0,0,0,0,0,0,0,0], 3:[3,0,0,0,0,0,0,0,0],
  4:[3,0,0,0,0,0,0,0,0], 5:[4,2,0,0,0,0,0,0,0], 6:[4,2,0,0,0,0,0,0,0],
  7:[4,3,0,0,0,0,0,0,0], 8:[4,3,0,0,0,0,0,0,0], 9:[4,3,2,0,0,0,0,0,0],
  10:[4,3,2,0,0,0,0,0,0], 11:[4,3,3,0,0,0,0,0,0], 12:[4,3,3,0,0,0,0,0,0],
  13:[4,3,3,1,0,0,0,0,0], 14:[4,3,3,1,0,0,0,0,0], 15:[4,3,3,2,0,0,0,0,0],
  16:[4,3,3,2,0,0,0,0,0], 17:[4,3,3,3,1,0,0,0,0], 18:[4,3,3,3,1,0,0,0,0],
  19:[4,3,3,3,2,0,0,0,0], 20:[4,3,3,3,2,0,0,0,0]
};

/* ════════════════════════════════════════════════════════════
   MULTICLASS SPELL SLOTS  (PHB 5e / 2024 combined table)
   ════════════════════════════════════════════════════════════ */
const MULTICLASS_SLOTS = {
  1:[2,0,0,0,0,0,0,0,0], 2:[3,0,0,0,0,0,0,0,0], 3:[4,2,0,0,0,0,0,0,0],
  4:[4,3,0,0,0,0,0,0,0], 5:[4,3,2,0,0,0,0,0,0], 6:[4,3,3,0,0,0,0,0,0],
  7:[4,3,3,1,0,0,0,0,0], 8:[4,3,3,2,0,0,0,0,0], 9:[4,3,3,3,1,0,0,0,0],
  10:[4,3,3,3,2,0,0,0,0],11:[4,3,3,3,2,1,0,0,0],12:[4,3,3,3,2,1,0,0,0],
  13:[4,3,3,3,2,1,1,0,0],14:[4,3,3,3,2,1,1,0,0],15:[4,3,3,3,2,1,1,1,0],
  16:[4,3,3,3,2,1,1,1,0],17:[4,3,3,3,2,1,1,1,1],18:[4,3,3,3,3,1,1,1,1],
  19:[4,3,3,3,3,2,1,1,1],20:[4,3,3,3,3,2,2,1,1]
};

/* ════════════════════════════════════════════════════════════
   D&D 2024 CLASS DATA  (PHB, base classes)
   Each feature: { name, desc, type }
   type: 'feature' | 'asi' | 'subclass' | 'epic'
   ════════════════════════════════════════════════════════════ */
/* ── Équipement de départ 2024 (PHB) — utilisé par l'assistant de création et le compendium ── */
/* ── Armes et armures de départ ──
   Sert à dériver la CA et les lignes d'attaque à la création du personnage.
   Les clés correspondent exactement aux `name` de STARTING_EQUIP.
   `mode`/`baseAC` alimentent c.armorConfig (voir calcAndSetAC dans joueurs.html). */
const STARTING_ARMOR = {
  'Leather Armor':          { mode:'light',  baseAC:11, armorName:'Leather' },
  'Studded Leather Armor':  { mode:'light',  baseAC:12, armorName:'Studded Leather' },
  'Chain Shirt':            { mode:'medium', baseAC:13, armorName:'Chain Shirt' },
  'Chain Mail':             { mode:'heavy',  baseAC:16, armorName:'Chain Mail' },
};

/* dmg = dé de base, abil = 'for' | 'dex', finesse = le joueur prend le meilleur des deux */
const STARTING_WEAPONS = {
  'Dagger':         { dmg:'1d4',  type:'piercing',    abil:'for', finesse:true },
  'Flail':          { dmg:'1d8',  type:'bludgeoning', abil:'for' },
  'Greataxe':       { dmg:'1d12', type:'slashing',    abil:'for' },
  'Greatsword':     { dmg:'2d6',  type:'slashing',    abil:'for' },
  'Handaxe':        { dmg:'1d6',  type:'slashing',    abil:'for' },
  'Javelin':        { dmg:'1d6',  type:'piercing',    abil:'for' },
  'Light Crossbow': { dmg:'1d8',  type:'piercing',    abil:'dex' },
  'Longbow':        { dmg:'1d8',  type:'piercing',    abil:'dex' },
  'Longsword':      { dmg:'1d8',  type:'slashing',    abil:'for' },
  'Mace':           { dmg:'1d6',  type:'bludgeoning', abil:'for' },
  'Quarterstaff':   { dmg:'1d6',  type:'bludgeoning', abil:'for' },
  'Scimitar':       { dmg:'1d6',  type:'slashing',    abil:'for', finesse:true },
  'Shortbow':       { dmg:'1d6',  type:'piercing',    abil:'dex' },
  'Shortsword':     { dmg:'1d6',  type:'piercing',    abil:'for', finesse:true },
  'Sickle':         { dmg:'1d4',  type:'slashing',    abil:'for', finesse:true },
  'Spear':          { dmg:'1d6',  type:'piercing',    abil:'for' },
};

const STARTING_EQUIP = {
  Artificer: [
    { label:'Option A', gold:8, items:[{qty:1,name:'Studded Leather Armor'},{qty:1,name:'Dagger'},{qty:1,name:'Light Crossbow'},{qty:20,name:'Bolt'},{qty:1,name:"Thieves' Tools"},{qty:1,name:"Artisan's Tools ou Instrument"},{qty:1,name:"Dungeoneer's Pack"}] },
    { label:'Option B — Or uniquement', gold:100, items:[] }
  ],
  Barbarian: [
    { label:'Option A', gold:15, items:[{qty:1,name:'Greataxe'},{qty:4,name:'Handaxe'},{qty:1,name:"Explorer's Pack"}] },
    { label:'Option B — Or uniquement', gold:75, items:[] }
  ],
  Bard: [
    { label:'Option A', gold:19, items:[{qty:1,name:'Leather Armor'},{qty:2,name:'Dagger'},{qty:1,name:'Musical Instrument'},{qty:1,name:"Entertainer's Pack"}] },
    { label:'Option B — Or uniquement', gold:90, items:[] }
  ],
  Cleric: [
    { label:'Option A', gold:7, items:[{qty:1,name:'Chain Shirt'},{qty:1,name:'Shield'},{qty:1,name:'Mace'},{qty:1,name:'Holy Symbol'},{qty:1,name:"Priest's Pack"}] },
    { label:'Option B — Or uniquement', gold:110, items:[] }
  ],
  Druid: [
    { label:'Option A', gold:9, items:[{qty:1,name:'Leather Armor'},{qty:1,name:'Shield'},{qty:1,name:'Sickle'},{qty:1,name:'Druidic Focus (Quarterstaff)'},{qty:1,name:"Explorer's Pack"},{qty:1,name:'Herbalism Kit'}] },
    { label:'Option B — Or uniquement', gold:50, items:[] }
  ],
  Fighter: [
    { label:'Option A', gold:4, items:[{qty:1,name:'Chain Mail'},{qty:1,name:'Greatsword'},{qty:1,name:'Flail'},{qty:8,name:'Javelin'},{qty:1,name:"Dungeoneer's Pack"}] },
    { label:'Option B', gold:11, items:[{qty:1,name:'Studded Leather Armor'},{qty:1,name:'Scimitar'},{qty:1,name:'Shortsword'},{qty:1,name:'Longbow'},{qty:20,name:'Arrow'},{qty:1,name:'Quiver'},{qty:1,name:"Dungeoneer's Pack"}] },
    { label:'Option C — Or uniquement', gold:155, items:[] }
  ],
  Monk: [
    { label:'Option A', gold:11, items:[{qty:1,name:'Spear'},{qty:5,name:'Dagger'},{qty:1,name:"Artisan's Tools ou Instrument"},{qty:1,name:"Explorer's Pack"}] },
    { label:'Option B — Or uniquement', gold:50, items:[] }
  ],
  Paladin: [
    { label:'Option A', gold:9, items:[{qty:1,name:'Chain Mail'},{qty:1,name:'Shield'},{qty:1,name:'Longsword'},{qty:6,name:'Javelin'},{qty:1,name:'Holy Symbol'},{qty:1,name:"Priest's Pack"}] },
    { label:'Option B — Or uniquement', gold:150, items:[] }
  ],
  Psion: [
    { label:'Option A', gold:6, items:[{qty:1,name:'Spear'},{qty:2,name:'Dagger'},{qty:1,name:'Light Crossbow'},{qty:20,name:'Bolt'},{qty:1,name:'Case'},{qty:1,name:"Dungeoneer's Pack"}] },
    { label:'Option B — Or uniquement', gold:50, items:[] }
  ],
  Ranger: [
    { label:'Option A', gold:7, items:[{qty:1,name:'Studded Leather Armor'},{qty:1,name:'Scimitar'},{qty:1,name:'Shortsword'},{qty:1,name:'Longbow'},{qty:20,name:'Arrow'},{qty:1,name:'Quiver'},{qty:1,name:'Druidic Focus (sprig of mistletoe)'},{qty:1,name:"Explorer's Pack"}] },
    { label:'Option B — Or uniquement', gold:150, items:[] }
  ],
  Rogue: [
    { label:'Option A', gold:8, items:[{qty:1,name:'Leather Armor'},{qty:2,name:'Dagger'},{qty:1,name:'Shortsword'},{qty:1,name:'Shortbow'},{qty:20,name:'Arrow'},{qty:1,name:'Quiver'},{qty:1,name:"Thieves' Tools"},{qty:1,name:"Burglar's Pack"}] },
    { label:'Option B — Or uniquement', gold:100, items:[] }
  ],
  Sorcerer: [
    { label:'Option A', gold:28, items:[{qty:1,name:'Spear'},{qty:2,name:'Dagger'},{qty:1,name:'Arcane Focus (crystal)'},{qty:1,name:"Dungeoneer's Pack"}] },
    { label:'Option B — Or uniquement', gold:50, items:[] }
  ],
  Warlock: [
    { label:'Option A', gold:15, items:[{qty:1,name:'Leather Armor'},{qty:1,name:'Sickle'},{qty:2,name:'Dagger'},{qty:1,name:'Arcane Focus (orb)'},{qty:1,name:'Book (occult lore)'},{qty:1,name:"Scholar's Pack"}] },
    { label:'Option B — Or uniquement', gold:100, items:[] }
  ],
  Wizard: [
    { label:'Option A', gold:5, items:[{qty:2,name:'Dagger'},{qty:1,name:'Arcane Focus (Quarterstaff)'},{qty:1,name:'Robe'},{qty:1,name:'Spellbook'},{qty:1,name:"Scholar's Pack"}] },
    { label:'Option B — Or uniquement', gold:55, items:[] }
  ]
};

/* ════════════════════════════════════════════════════════════
   D&D 2024 GENERAL FEATS (PHB) — disponibles aux niveaux 4/8/12/16
   (et 19 pour certaines classes) en remplacement d'un ASI.
   Un feat marqué asi:true donne aussi +1 dans une caractéristique.
   ════════════════════════════════════════════════════════════ */
const GENERAL_FEATS = {
  'Ability Score Improvement': { asi:false, prereq:'', desc:"Increase one ability score by 2, or two ability scores by 1 each (max 20). Can be taken multiple times." },
  'Actor':              { asi:true, abil:'CHA', prereq:'CHA 13+', desc:"Advantage on Deception and Performance checks when trying to pass yourself off as someone else. You can mimic a voice or sound you've heard (Insight vs your Deception to detect)." },
  'Athlete':            { asi:true, abil:'FOR or DEX', prereq:'FOR or DEX 13+', desc:"Standing up from Prone costs only 5 ft of movement. You can Climb without extra movement cost, and make a running Long/High Jump after moving only 5 ft." },
  'Charger':            { asi:true, abil:'FOR or DEX', prereq:'FOR or DEX 13+', desc:"When you take the Dash action, you can make one melee attack as a Bonus Action: +1d8 damage if you moved 10+ ft straight, or push the target 10 ft." },
  'Chef':               { asi:true, abil:'CON or SAG', prereq:'CON or SAG 13+', desc:"Proficiency with Cook's Utensils. Short Rest: cook a meal for up to 4+PB creatures, each regains 1d8 extra HP. Long Rest: bake PB treats granting 1d8 Temp HP each." },
  'Crossbow Expert':    { asi:true, abil:'DEX', prereq:'DEX 13+', desc:"Ignore the Loading property of crossbows. Being within 5 ft of an enemy doesn't impose Disadvantage on your ranged attacks. When you use the Attack action with a one-handed weapon, you can attack with a Hand Crossbow as a Bonus Action." },
  'Crusher':            { asi:true, abil:'FOR or CON', prereq:'FOR or CON 13+', desc:"Once per turn when you deal Bludgeoning damage, move the target 5 ft. On a Critical Hit, attacks against that creature have Advantage until your next turn." },
  'Defensive Duelist':  { asi:true, abil:'DEX', prereq:'DEX 13+', desc:"Reaction when hit by a melee attack while wielding a Finesse weapon: add your Proficiency Bonus to AC, possibly causing the attack to miss." },
  'Dual Wielder':       { asi:true, abil:'FOR or DEX', prereq:'FOR or DEX 13+', desc:"+1 AC while wielding a Melee weapon in each hand. You can use two-weapon fighting even with non-Light weapons. You can draw or stow two weapons at once." },
  'Durable':            { asi:true, abil:'CON', prereq:'CON 13+', desc:"When you roll a Hit Die to regain HP, the minimum equals twice your CON modifier (min 2). As a Bonus Action, spend a Hit Die to regain HP (PB times/Long Rest)." },
  'Elemental Adept':    { asi:true, abil:'INT, SAG or CHA', prereq:'Spellcasting/Pact Magic', desc:"Choose a damage type (Acid, Cold, Fire, Lightning, Thunder). Your spells ignore Resistance to it, and treat any 1 on a damage die as a 2." },
  'Fey-Touched':        { asi:true, abil:'INT, SAG or CHA', prereq:'', desc:"Learn Misty Step and one level-1 Divination or Enchantment spell. Cast each once per Long Rest without a slot, or with slots." },
  'Grappler':           { asi:true, abil:'FOR or DEX', prereq:'FOR or DEX 13+', desc:"Advantage on attacks against a creature you're grappling. Grappling doesn't cost extra movement. You can move a grappled creature of your size or smaller at full speed." },
  'Great Weapon Master':{ asi:true, abil:'FOR', prereq:'FOR 13+', desc:"When you score a Critical Hit or reduce a creature to 0 HP with a Heavy weapon, make one melee attack as a Bonus Action. When you hit with a Heavy weapon, add your Proficiency Bonus to the damage (once per turn)." },
  'Heavily Armored':    { asi:true, abil:'FOR', prereq:'Medium armor proficiency', desc:"Gain proficiency with Heavy armor." },
  'Heavy Armor Master': { asi:true, abil:'FOR or CON', prereq:'Heavy armor proficiency', desc:"While wearing Heavy armor, reduce Bludgeoning/Piercing/Slashing damage taken by your Proficiency Bonus." },
  'Inspiring Leader':   { asi:true, abil:'SAG or CHA', prereq:'SAG or CHA 13+', desc:"After a Rest, give up to 6 creatures (including yourself) Temp HP equal to your PB + your SAG or CHA modifier." },
  'Keen Mind':          { asi:true, abil:'INT', prereq:'INT 13+', desc:"You always know which way is north and the number of hours until sunrise/sunset. As a Magic action, gain Advantage on your next INT (History/Investigation/Nature/Religion) check (PB/Long Rest)." },
  'Lightly Armored':    { asi:true, abil:'FOR or DEX', prereq:'', desc:"Gain proficiency with Light armor and Shields." },
  'Mage Slayer':        { asi:true, abil:'FOR or DEX', prereq:'', desc:"Reaction: when a creature within 5 ft casts a spell, make one melee attack against it. Advantage on saves against spells cast by creatures within 5 ft." },
  'Martial Weapon Training': { asi:true, abil:'FOR or DEX', prereq:'', desc:"Gain proficiency with Martial weapons." },
  'Medium Armor Master':{ asi:true, abil:'FOR or DEX', prereq:'Medium armor proficiency', desc:"Wearing Medium armor doesn't impose Disadvantage on Stealth, and you can add 3 (instead of 2) to your AC from DEX." },
  'Moderately Armored': { asi:true, abil:'FOR or DEX', prereq:'Light armor proficiency', desc:"Gain proficiency with Medium armor." },
  'Mounted Combatant':  { asi:true, abil:'FOR, DEX or WIS', prereq:'', desc:"Advantage on melee attacks against unmounted creatures smaller than your mount. Your mount takes no damage on a successful DEX save (half on failure). You can force an attack targeting your mount to target you instead." },
  'Observant':          { asi:true, abil:'INT or SAG', prereq:'INT or SAG 13+', desc:"As a Bonus Action, make a WIS (Perception) or INT (Investigation) check (PB/Long Rest). You can read lips if you can see a creature's mouth and know the language." },
  'Piercer':            { asi:true, abil:'FOR or DEX', prereq:'FOR or DEX 13+', desc:"Once per turn when you deal Piercing damage, reroll one damage die. On a Critical Hit, roll one additional damage die." },
  'Poisoner':           { asi:true, abil:'DEX or INT', prereq:'', desc:"Proficiency with the Poisoner's Kit. Apply poison as a Bonus Action. Your poisons ignore Resistance to Poison. Craft doses that deal 2d8 Poison damage (CON save DC 14 or Poisoned)." },
  'Polearm Master':     { asi:true, abil:'FOR or DEX', prereq:'FOR or DEX 13+', desc:"Bonus Action: attack with the opposite end of a Quarterstaff/Spear/Glaive/Halberd/Pike (1d4 Bludgeoning). Opportunity attack when a creature enters your reach with these weapons." },
  'Resilient':          { asi:true, abil:'choice', prereq:'', desc:"Increase one ability score by 1 and gain proficiency in saving throws using that ability." },
  'Ritual Caster':      { asi:true, abil:'INT, SAG or CHA', prereq:'Spellcasting', desc:"Gain a ritual book with two level-1 ritual spells from a chosen class list. You can add more rituals found in your adventures." },
  'Sentinel':           { asi:true, abil:'FOR or DEX', prereq:'FOR or DEX 13+', desc:"When you hit with an Opportunity Attack, the creature's Speed becomes 0 for the turn. Creatures provoke Opportunity Attacks even if they Disengage. Reaction: attack a creature within 5 ft that attacks a target other than you." },
  'Sharpshooter':       { asi:true, abil:'DEX', prereq:'DEX 13+', desc:"Attacking at Long Range doesn't impose Disadvantage. Your ranged attacks ignore Half and Three-Quarters Cover. When you hit with a ranged weapon, add your Proficiency Bonus to damage (once per turn)." },
  'Shield Master':      { asi:true, abil:'FOR', prereq:'Shield proficiency', desc:"Bonus Action: shove a creature within 5 ft with your Shield. Add your Shield's AC bonus to DEX saves against effects targeting only you. Reaction: take no damage on a successful DEX save." },
  'Skulker':            { asi:true, abil:'DEX', prereq:'DEX 13+', desc:"You can Hide when only Lightly Obscured. Missing with a ranged attack doesn't reveal your position. Dim light doesn't impose Disadvantage on Perception checks." },
  'Slasher':            { asi:true, abil:'FOR or DEX', prereq:'FOR or DEX 13+', desc:"Once per turn when you deal Slashing damage, reduce the target's Speed by 10 ft. On a Critical Hit, the target has Disadvantage on attacks until your next turn." },
  'Speedy':             { asi:true, abil:'DEX or CON', prereq:'DEX or CON 13+', desc:"Your Speed increases by 10 ft. Difficult Terrain doesn't slow your Dash. Opportunity attacks against you have Disadvantage when you Dash." },
  'Spell Sniper':       { asi:true, abil:'INT, SAG or CHA', prereq:'Spellcasting/Pact Magic', desc:"Your attack-roll spells have double range and ignore Half and Three-Quarters Cover. Learn one attack cantrip." },
  'Shadow-Touched':     { asi:true, abil:'INT, SAG or CHA', prereq:'', desc:"Learn Invisibility and one level-1 Illusion or Necromancy spell. Cast each once per Long Rest without a slot, or with slots." },
  'Telekinetic':        { asi:true, abil:'INT, SAG or CHA', prereq:'', desc:"Learn Mage Hand (invisible, cast without components). Bonus Action: telekinetically shove a creature 5 ft (STR save)." },
  'Telepathic':         { asi:true, abil:'INT, SAG or CHA', prereq:'', desc:"Speak telepathically to any creature within 60 ft that understands a language. You always have Detect Thoughts prepared — cast once per Long Rest without a slot." },
  'War Caster':         { asi:true, abil:'INT, SAG or CHA', prereq:'Spellcasting/Pact Magic', desc:"Advantage on CON saves to maintain Concentration. Perform somatic components with weapons/shield in hand. Cast a spell (1 action, targeting one creature) instead of an Opportunity Attack." },
  'Weapon Master':      { asi:true, abil:'FOR or DEX', prereq:'', desc:"You gain the Mastery property for one kind of weapon you're proficient with; you can change it on a Long Rest." },
};
const ASI_LEVELS = [4, 8, 12, 16, 19];

/* ════════════════════════════════════════════════════════════
   D&D 2024 BACKGROUNDS (PHB) — chaque background donne :
   +2/+1 (ou +1/+1/+1) réparti sur 3 caractéristiques, un Origin Feat,
   2 compétences, 1 outil et un équipement de départ.
   ════════════════════════════════════════════════════════════ */
const ORIGIN_FEATS = {
  'Alert':            "Add your Proficiency Bonus to Initiative. You can swap your Initiative with a willing ally's.",
  'Crafter':          "Tool proficiency with three Artisan's Tools. 20% discount on nonmagical items. Craft one item from a list during a Long Rest.",
  'Healer':           "As a Utility action, use a Healer's Kit to let a creature spend a Hit Die: heal that die + its CON modifier (minimum 1). Also restores 1 HP on a 0-HP creature.",
  'Lucky':            "You have Luck Points equal to your Proficiency Bonus (regained on Long Rest). Spend one to gain Advantage on a d20 Test, or to impose Disadvantage on an attack against you.",
  'Magic Initiate':   "Learn 2 cantrips and one level-1 spell from a chosen class list (Cleric, Druid or Wizard). Cast the level-1 spell once per Long Rest for free, or with slots.",
  'Musician':         "Proficiency with three Musical Instruments. After a Rest, give Heroic Inspiration to allies equal to your Proficiency Bonus.",
  'Savage Attacker':  "Once per turn when you hit with a weapon, you can reroll the damage dice and use either total.",
  'Skilled':          "Proficiency in any combination of three skills or tools of your choice.",
  'Tavern Brawler':   "Unarmed Strike deals 1d4. Once per turn, deal extra damage equal to your Proficiency Bonus. You can push a creature 5 ft on an Unarmed Strike hit. Proficiency with improvised weapons.",
  'Tough':            "Your Hit Point maximum increases by twice your character level.",
};
const BACKGROUND_DATA = {
  'Acolyte':      { abilities:['int','sag','cha'], feat:'Magic Initiate',  skills:'Insight, Religion',        skillKeys:['perspicacite','religion'],   tool:"Calligrapher's Supplies" },
  'Artisan':      { abilities:['for','dex','int'], feat:'Crafter',         skills:'Investigation, Persuasion', skillKeys:['investigation','persuasion'], tool:"Artisan's Tools (choice)" },
  'Charlatan':    { abilities:['dex','con','cha'], feat:'Skilled',         skills:'Deception, Sleight of Hand', skillKeys:['duperie','prestidig'],     tool:"Forgery Kit" },
  'Criminal':     { abilities:['dex','con','int'], feat:'Alert',           skills:'Sleight of Hand, Stealth',  skillKeys:['prestidig','discret'],       tool:"Thieves' Tools" },
  'Entertainer':  { abilities:['for','dex','cha'], feat:'Musician',        skills:'Acrobatics, Performance',   skillKeys:['acrobaties','performance'],  tool:"Musical Instrument (choice)" },
  'Farmer':       { abilities:['for','con','sag'], feat:'Tough',           skills:'Animal Handling, Nature',   skillKeys:['animaux','nature'],          tool:"Carpenter's Tools" },
  'Guard':        { abilities:['for','int','sag'], feat:'Alert',           skills:'Athletics, Perception',     skillKeys:['athletisme','perception'],   tool:"Gaming Set (choice)" },
  'Guide':        { abilities:['dex','con','sag'], feat:'Magic Initiate',  skills:'Stealth, Survival',         skillKeys:['discret','survie'],          tool:"Cartographer's Tools" },
  'Hermit':       { abilities:['con','sag','cha'], feat:'Healer',          skills:'Medicine, Religion',        skillKeys:['medecine','religion'],       tool:"Herbalism Kit" },
  'Merchant':     { abilities:['con','int','cha'], feat:'Lucky',           skills:'Animal Handling, Persuasion', skillKeys:['animaux','persuasion'],    tool:"Navigator's Tools" },
  'Noble':        { abilities:['for','int','cha'], feat:'Skilled',         skills:'History, Persuasion',       skillKeys:['histoire','persuasion'],     tool:"Gaming Set (choice)" },
  'Sage':         { abilities:['con','int','sag'], feat:'Magic Initiate',  skills:'Arcana, History',           skillKeys:['arcanes','histoire'],        tool:"Calligrapher's Supplies" },
  'Sailor':       { abilities:['for','dex','sag'], feat:'Tavern Brawler',  skills:'Acrobatics, Perception',    skillKeys:['acrobaties','perception'],   tool:"Navigator's Tools" },
  'Scribe':       { abilities:['dex','int','sag'], feat:'Skilled',         skills:'Investigation, Perception', skillKeys:['investigation','perception'], tool:"Calligrapher's Supplies" },
  'Soldier':      { abilities:['for','dex','con'], feat:'Savage Attacker', skills:'Athletics, Intimidation',   skillKeys:['athletisme','intimidation'], tool:"Gaming Set (choice)" },
  'Wayfarer':     { abilities:['dex','sag','cha'], feat:'Lucky',           skills:'Insight, Stealth',          skillKeys:['perspicacite','discret'],    tool:"Thieves' Tools" },
};

/* ════════════════════════════════════════════════════════════
   D&D 2024 SPECIES DATA (PHB)
   traits: { niveau: [{name, desc}] } — lineages: { nom: {niveau: [...]}}
   ════════════════════════════════════════════════════════════ */
const SPECIES_DATA = {

'Aasimar': {
  size: 'Medium or Small', speed: 30,
  traits: {
    1: [
      { name:'Celestial Resistance', desc:'You have Resistance to Necrotic and Radiant damage.' },
      { name:'Darkvision', desc:'Darkvision 60 ft.' },
      { name:'Healing Hands', desc:'Magic action: touch a creature — it regains HP equal to your Proficiency Bonus d4s. 1/Long Rest.' },
      { name:'Light Bearer', desc:'You know the Light cantrip (Charisma is your spellcasting ability for it).' }
    ],
    3: [
      { name:'Celestial Revelation', desc:'Bonus action (1/Long Rest, 1 minute): choose Heavenly Wings (fly speed = your speed), Inner Radiance (bright light 10 ft, Radiant damage = PB to creatures within 10 ft at end of your turn), or Necrotic Shroud (creatures within 10 ft make CHA save or Frightened until end of your next turn). While active, once per turn deal extra Radiant/Necrotic damage = your Proficiency Bonus.' }
    ]
  }
},

'Dragonborn': {
  size: 'Medium', speed: 30,
  traits: {
    1: [
      { name:'Draconic Ancestry', desc:'Choose a dragon type (Black/Copper: Acid · Blue/Bronze: Lightning · Brass/Gold/Red: Fire · Green: Poison · Silver/White: Cold). It sets your Breath Weapon and Damage Resistance.' },
      { name:'Breath Weapon', desc:'Replace one attack of the Attack action: exhale a 15-ft cone or 30×5-ft line (your choice). DEX save DC 8 + CON mod + PB; 1d10 damage of your ancestry type, half on success. Damage : 2d10 au niv.5, 3d10 au niv.11, 4d10 au niv.17. Uses = Proficiency Bonus / Long Rest.' },
      { name:'Damage Resistance', desc:'Resistance to the damage type of your Draconic Ancestry.' },
      { name:'Darkvision', desc:'Darkvision 60 ft.' }
    ],
    5: [
      { name:'Draconic Flight', desc:'Bonus action (1/Long Rest): spectral wings for 10 minutes — fly speed equal to your speed.' }
    ]
  }
},

'Dwarf': {
  size: 'Medium', speed: 30,
  // effects : valeurs mécaniques applicables en un clic à la fiche
  effects: { hpPerLevel: 1 },
  traits: {
    1: [
      { name:'Darkvision', desc:'Darkvision 120 ft.' },
      { name:'Dwarven Resilience', desc:'Resistance to Poison damage, and Advantage on saves to avoid or end the Poisoned condition.' },
      { name:'Dwarven Toughness', desc:'+1 HP maximum per level.' },
      { name:'Stonecunning', desc:'Bonus action (PB/Long Rest): Tremorsense 60 ft for 10 minutes while on a stone surface.' }
    ]
  }
},

'Elf': {
  size: 'Medium', speed: 30,
  traits: {
    1: [
      { name:'Darkvision', desc:'Darkvision 60 ft.' },
      { name:'Fey Ancestry', desc:'Advantage on saves to avoid or end the Charmed condition.' },
      { name:'Keen Senses', desc:'Proficiency in Insight, Perception, or Survival (choose one).' },
      { name:'Trance', desc:"You don't need sleep: 4 hours of trance give the benefits of a Long Rest." }
    ]
  },
  lineages: {
    'Drow': {
      1: [{ name:'Drow Lineage', desc:'Darkvision 120 ft. You know the Dancing Lights cantrip. Spellcasting: INT, WIS or CHA (choose).' }],
      3: [{ name:'Faerie Fire', desc:'You always have Faerie Fire prepared — cast 1/Long Rest without a slot (or with your slots).' }],
      5: [{ name:'Darkness', desc:'You always have Darkness prepared — cast 1/Long Rest without a slot (or with your slots).' }]
    },
    'High Elf': {
      1: [{ name:'High Elf Lineage', desc:'You know the Prestidigitation cantrip; on Long Rest you can swap it for another Wizard cantrip. Spellcasting: INT, WIS or CHA (choose).' }],
      3: [{ name:'Detect Magic', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' }],
      5: [{ name:'Misty Step', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' }]
    },
    'Wood Elf': {
      effects: { speed: 35 },
      1: [{ name:'Wood Elf Lineage', desc:'Speed 35 ft. You know the Druidcraft cantrip. Spellcasting: INT, WIS or CHA (choose).' }],
      3: [{ name:'Longstrider', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' }],
      5: [{ name:'Pass without Trace', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' }]
    }
  }
},

'Gnome': {
  size: 'Small', speed: 30,
  traits: {
    1: [
      { name:'Darkvision', desc:'Darkvision 60 ft.' },
      { name:'Gnomish Cunning', desc:'Advantage on Intelligence, Wisdom, and Charisma saving throws.' }
    ]
  },
  lineages: {
    'Forest Gnome': {
      1: [{ name:'Forest Gnome Lineage', desc:'You know the Minor Illusion cantrip. You always have Speak with Animals prepared — cast PB/Long Rest without a slot. Spellcasting: INT, WIS or CHA (choose).' }]
    },
    'Rock Gnome': {
      1: [{ name:'Rock Gnome Lineage', desc:'You know Mending and Prestidigitation. You can spend 10 min to create a Tiny clockwork device (up to 3) reproducing a Prestidigitation effect. Spellcasting: INT, WIS or CHA (choose).' }]
    }
  }
},

'Goliath': {
  size: 'Medium', speed: 35,
  effects: { speed: 35 },
  traits: {
    1: [
      { name:'Giant Ancestry', desc:"Choose a boon usable PB/Long Rest: Cloud's Jaunt (bonus action: teleport 30 ft) · Fire's Burn (+1d10 Fire on a hit) · Frost's Chill (+1d6 Cold + speed −10 on a hit) · Hill's Tumble (knock Prone a Large- creature you hit) · Stone's Endurance (reaction: reduce damage by 1d12 + CON) · Storm's Thunder (reaction: 1d8 Thunder to an attacker within 60 ft)." },
      { name:'Powerful Build', desc:'Advantage on saves to end the Grappled condition; you count as one size larger for carrying capacity.' }
    ],
    5: [
      { name:'Large Form', desc:'Bonus action (1/Long Rest, 10 min): become Large — Advantage on Strength checks, speed +10 ft.' }
    ]
  }
},

'Halfling': {
  size: 'Small', speed: 30,
  traits: {
    1: [
      { name:'Brave', desc:'Advantage on saves to avoid or end the Frightened condition.' },
      { name:'Halfling Nimbleness', desc:'You can move through the space of any creature larger than you (not a stopping place).' },
      { name:'Luck', desc:'When you roll a 1 on a d20 Test, reroll — you must use the new roll.' },
      { name:'Naturally Stealthy', desc:'You can take the Hide action even when only obscured by a creature one size larger than you.' }
    ]
  }
},

'Human': {
  size: 'Medium or Small', speed: 30,
  traits: {
    1: [
      { name:'Resourceful', desc:'You gain Heroic Inspiration whenever you finish a Long Rest.' },
      { name:'Skillful', desc:'Proficiency in one skill of your choice.' },
      { name:'Versatile', desc:'You gain an Origin feat of your choice (Skilled by default).' }
    ]
  }
},

'Orc': {
  size: 'Medium', speed: 30,
  traits: {
    1: [
      { name:'Adrenaline Rush', desc:'Bonus action: take the Dash action and gain Temp HP = your Proficiency Bonus. Uses = PB / Short or Long Rest.' },
      { name:'Darkvision', desc:'Darkvision 120 ft.' },
      { name:'Relentless Endurance', desc:'When reduced to 0 HP without being killed outright, drop to 1 HP instead. 1/Long Rest.' }
    ]
  }
},

'Tiefling': {
  size: 'Medium or Small', speed: 30,
  traits: {
    1: [
      { name:'Darkvision', desc:'Darkvision 60 ft.' },
      { name:'Otherworldly Presence', desc:'You know the Thaumaturgy cantrip (same spellcasting ability as your Fiendish Legacy).' }
    ]
  },
  lineages: {
    'Abyssal': {
      1: [{ name:'Abyssal Legacy', desc:'Resistance to Poison damage. You know the Poison Spray cantrip. Spellcasting: INT, WIS or CHA (choose).' }],
      3: [{ name:'Ray of Sickness', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' }],
      5: [{ name:'Hold Person', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' }]
    },
    'Chthonic': {
      1: [{ name:'Chthonic Legacy', desc:'Resistance to Necrotic damage. You know the Chill Touch cantrip. Spellcasting: INT, WIS or CHA (choose).' }],
      3: [{ name:'False Life', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' }],
      5: [{ name:'Ray of Enfeeblement', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' }]
    },
    'Infernal': {
      1: [{ name:'Infernal Legacy', desc:'Resistance to Fire damage. You know the Fire Bolt cantrip. Spellcasting: INT, WIS or CHA (choose).' }],
      3: [{ name:'Hellish Rebuke', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' }],
      5: [{ name:'Darkness', desc:'Always prepared — cast 1/Long Rest without a slot (or with your slots).' }]
    }
  }
}
};

const CLASS_DATA = {

'Barbarian': {
  saves: ['for','con'],
  skillChoices: 2, skillList: ['animaux','athletisme','intimidation','nature','perception','survie'],
  armorProf: 'Light, Medium, Shields',
  weaponProf: 'Simple and Martial weapons',
  features: {
    1: [
      { name:'Rage', type:'feature', desc:"Bonus action. Gain advantage on STR checks and saves, resistance to Bludgeoning/Piercing/Slashing damage, and a damage bonus. You can't cast or concentrate spells while raging. Ends if you don't attack or take damage. Uses: 2/Long Rest, scaling with level." },
      { name:'Unarmored Defense', type:'feature', desc:"While wearing no armor, your AC = 10 + DEX modifier + CON modifier. You can use a shield and still gain this benefit." },
      { name:'Weapon Mastery', type:'feature', desc:"Use the Mastery property of 2 Simple or Martial weapons, choosing them on Long Rest." }
    ],
    2: [
      { name:'Danger Sense', type:'feature', desc:"Advantage on DEX saving throws against effects you can see (traps, spells, etc.), as long as you are not Incapacitated." },
      { name:'Reckless Attack', type:'feature', desc:"Before making your first attack on your turn, choose to attack recklessly. You gain advantage on STR-based attacks this turn, but attack rolls against you have advantage until your next turn." }
    ],
    3: [
      { name:'Barbarian Subclass', type:'subclass', desc:"Choose a subclass: Berserker, Wild Heart, World Tree, or Zealot. You gain the first subclass feature." },
      { name:'Primal Knowledge', type:'feature', desc:"Gain proficiency in one skill from the Barbarian list: Athletics, Intimidation, Nature, Perception, or Survival." }
    ],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    5: [
      { name:'Extra Attack', type:'feature', desc:"You can attack twice instead of once whenever you take the Attack action on your turn." },
      { name:'Fast Movement', type:'feature', desc:"While not wearing heavy armor, your walking speed increases by 10 feet." }
    ],
    6: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your chosen Barbarian subclass." }],
    7: [
      { name:'Feral Instinct', type:'feature', desc:"You have advantage on Initiative rolls. If surprised, you can act normally on your first turn after entering your Rage as a Bonus Action." },
      { name:'Instinctive Pounce', type:'feature', desc:"When you enter your Rage, you can move up to half your speed as part of the same Bonus Action." }
    ],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    9: [{ name:'Brutal Strike', type:'feature', desc:"When you use Reckless Attack, you can forgo advantage on one attack to make a Brutal Strike: deal extra 1d10 damage and choose an effect (Forceful Blow: push 15 ft; Hamstring Blow: target speed −15 ft until your next turn)." }],
    10: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your chosen Barbarian subclass." }],
    11: [{ name:'Relentless Rage', type:'feature', desc:"If reduced to 0 HP while Raging, make a DC 10 CON save to drop to 1 HP instead. DC increases by 5 each time you succeed; resets on Long Rest." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    13: [{ name:'Improved Brutal Strike', type:'feature', desc:"Brutal Strike damage increases to 2d10, and you can choose two effects on a Brutal Strike." }],
    14: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your chosen Barbarian subclass." }],
    15: [{ name:'Persistent Rage', type:'feature', desc:"Your Rage can only end early if you choose to end it or you fall Unconscious. You no longer need to attack or take damage to maintain it." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    17: [{ name:'Improved Brutal Strike', type:'feature', desc:"Brutal Strike damage increases to 3d10." }],
    18: [{ name:'Indomitable Might', type:'feature', desc:"If your total on a STR check is less than your STR score, use your STR score instead." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Primal Champion', type:'feature', desc:"Your STR score increases by 4 and your CON score increases by 4. Your maximum for those scores is also increased by 4." }]
  }
},

'Bard': {
  saves: ['dex','cha'],
  skillChoices: 3, skillList: ['acrobaties','animaux','arcanes','athletisme','discret','duperie','histoire','intimidation','investigation','medecine','nature','perception','performance','persuasion','prestidig','religion','survie','perspicacite'],
  armorProf: 'Light armor',
  weaponProf: 'Simple weapons, Hand crossbow, Longsword, Rapier, Shortsword',
  features: {
    1: [
      { name:'Bardic Inspiration', type:'feature', desc:"Bonus action: give one creature within 60 ft a Bardic Inspiration die (d6). They can roll it and add it to one ability check, attack roll, or saving throw within the next 10 minutes. You can use this CHA modifier times (minimum 1), regaining uses on Long Rest." },
      { name:'Spellcasting', type:'feature', desc:"You are a full spellcaster using Charisma. You know 2 cantrips and 4 spells at 1st level. You prepare spells by learning them from any class's list (Magical Secrets at 10th)." }
    ],
    2: [
      { name:'Expertise', type:'feature', desc:"Choose 2 skills you are proficient in. Your proficiency bonus is doubled for any check using those skills." },
      { name:'Jack of All Trades', type:'feature', desc:"Add half your proficiency bonus (rounded down) to ability checks that don't already use your proficiency bonus." }
    ],
    3: [{ name:'Bard Subclass', type:'subclass', desc:"Choose a Bard College: Dance, Glamour, Lore, Valor, or Whispers. You gain the first subclass feature." }],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    5: [{ name:'Font of Inspiration', type:'feature', desc:"You now regain expended Bardic Inspiration uses when you finish a Short or Long Rest." }],
    6: [
      { name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your chosen Bard College." },
      { name:'Countercharm', type:'feature', desc:"As an action, start a performance. Until you stop, each creature within 30 ft of you has advantage on saving throws against being Frightened or Charmed." }
    ],
    7: [{ name:'Expertise', type:'feature', desc:"Choose 2 more skills. Your proficiency bonus is doubled for checks using those skills (4 total)." }],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    9: [{ name:'Superior Bardic Inspiration', type:'feature', desc:"When you roll initiative and have no Bardic Inspiration uses remaining, you regain 1 use." }],
    10: [
      { name:'Magical Secrets', type:'feature', desc:"You can choose spells from any class's spell list when you learn or swap Bard spells." },
      { name:'Bardic Inspiration — d8', type:'feature', desc:"Your Bardic Inspiration die increases to a d8." }
    ],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    14: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your chosen Bard College." }],
    15: [{ name:'Bardic Inspiration — d10', type:'feature', desc:"Your Bardic Inspiration die increases to a d10." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    18: [
      { name:'Superior Inspiration', type:'feature', desc:"When you roll Initiative and have no Bardic Inspiration uses, you regain 2 uses." },
      { name:'Bardic Inspiration — d12', type:'feature', desc:"Your Bardic Inspiration die increases to a d12." }
    ],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Words of Creation', type:'feature', desc:"Power Word Heal and Power Word Kill are always prepared for you and don't count against your prepared spells. You can cast each once without expending a spell slot, regaining those casts on a Long Rest." }]
  }
},

'Cleric': {
  saves: ['sag','cha'],
  skillChoices: 2, skillList: ['histoire','perspicacite','medecine','persuasion','religion'],
  armorProf: 'Light, Medium, Shields',
  weaponProf: 'Simple weapons',
  features: {
    1: [
      { name:'Divine Order', type:'feature', desc:"Choose Protector (proficiency with Martial weapons, Heavy armor) or Thaumaturge (one additional Cleric cantrip, Expertise in Arcana or Religion)." },
      { name:'Spellcasting', type:'feature', desc:"You are a full spellcaster using Wisdom. You prepare spells from the Cleric spell list equal to your WIS modifier + Cleric level." }
    ],
    2: [{ name:'Channel Divinity', type:'feature', desc:"You gain Channel Divinity (2/Long Rest). Turn Undead: action, each Undead within 30 ft makes a WIS save or is Turned for 1 minute. Your subclass grants additional Channel Divinity options." }],
    3: [{ name:'Cleric Subclass', type:'subclass', desc:"Choose a Divine Domain: Life, Light, Trickery, War, Knowledge, Nature, Tempest, or others. You gain the domain spells and first subclass feature." }],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    5: [{ name:'Smite Undead', type:'feature', desc:"When you use Turn Undead, any Undead that fails its save also takes Radiant damage equal to 2d8 + your WIS modifier." }],
    6: [
      { name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your chosen Divine Domain." },
      { name:'Channel Divinity (3/Long Rest)', type:'feature', desc:"You can now use Channel Divinity 3 times per Long Rest." }
    ],
    7: [{ name:'Blessed Strikes', type:'feature', desc:"Once per turn when you hit a creature with a weapon or deal damage with a Cleric cantrip, you deal an extra 1d8 Radiant damage." }],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    10: [{ name:'Divine Intervention', type:'feature', desc:"As an action, call on your deity. You can cast any Cleric spell of 5th level or lower without expending a spell slot. After use, you must finish a Long Rest before using it again." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    14: [{ name:'Improved Blessed Strikes', type:'feature', desc:"Blessed Strikes now deals 2d8 extra Radiant damage instead of 1d8." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    18: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your chosen Divine Domain." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Greater Divine Intervention', type:'feature', desc:"Your Divine Intervention now works automatically — no roll required. In addition, you can cast any Cleric spell without preparing it. You can't use Divine Intervention again until 2d4 days have passed." }]
  }
},

'Druid': {
  saves: ['int','sag'],
  skillChoices: 2, skillList: ['arcanes','animaux','perspicacite','medecine','nature','perception','religion','survie'],
  armorProf: 'Light, Medium, Shields (non-metal)',
  weaponProf: 'Simple weapons',
  features: {
    1: [
      { name:'Druidic', type:'feature', desc:"You know Druidic, the secret language of druids. You can speak it and use it to leave hidden messages. Creatures who don't know Druidic can detect a message exists with a DC 15 Perception check." },
      { name:'Primal Order', type:'feature', desc:"Choose Magician (one extra cantrip from any list, Nature spell always prepared per level) or Warden (proficiency with Martial weapons and Medium Armor)." },
      { name:'Spellcasting', type:'feature', desc:"You are a full spellcaster using Wisdom. You prepare spells from the Druid spell list equal to your WIS modifier + Druid level." },
      { name:'Wild Shape', type:'feature', desc:"Bonus action: transform into a Beast you've seen, CR 1/4 or lower. Lasts 1 hour or until you drop to 0 HP. Regain uses (equal to WIS mod) on Long Rest, or 1 use on Short Rest." }
    ],
    2: [
      { name:'Wild Companion', type:'feature', desc:"You can cast Find Familiar as a Ritual without spell slot or components. The familiar is Fey, not a spirit." }
    ],
    3: [
      { name:'Druid Subclass', type:'subclass', desc:"Choose a Druid Circle: Land, Moon, Sea, Stars, or Wildfire. You gain subclass features that expand your Wild Shape and spellcasting." }
    ],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Also, Wild Shape now allows CR 1/2 Beasts." }],
    5: [{ name:'Wild Resurgence', type:'feature', desc:"Once per Long Rest: spend a spell slot to regain 1 use of Wild Shape, or use Wild Shape to regain one 1st-level spell slot." }],
    6: [
      { name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Druid Circle." },
      { name:'Elemental Fury', type:'feature', desc:"Choose Primal Strike (your Wild Shape melee attacks count as Magical for overcoming resistances) or Potent Spellcasting (add your WIS modifier to the damage of Druid cantrips)." }
    ],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Wild Shape now allows CR 1 Beasts." }],
    10: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Druid Circle." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    14: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Druid Circle. Wild Shape now allows CR 2 Beasts." }],
    15: [{ name:'Improved Elemental Fury', type:'feature', desc:"The damage from your Elemental Fury choice improves: Primal Strike adds +1d6 Elemental damage; Potent Spellcasting adds WIS modifier twice to cantrip damage." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    18: [{ name:'Beast Spells', type:'feature', desc:"While in Wild Shape, you can cast Druid spells that don't require a free hand for material components. You can perform somatic components in Wild Shape form." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Archdruid', type:'feature', desc:"Your Wild Shape uses are unlimited. Choose Primal Beast (powerful Beast form with enhanced attacks) or Mighty Summoner (summoned creatures gain extra HP and attacks count as Magical)." }]
  }
},

'Fighter': {
  saves: ['for','con'],
  skillChoices: 2, skillList: ['acrobaties','animaux','athletisme','histoire','perspicacite','intimidation','persuasion','perception','survie'],
  armorProf: 'All armor, Shields',
  weaponProf: 'Simple and Martial weapons',
  features: {
    1: [
      { name:'Fighting Style', type:'feature', desc:"Choose a fighting style: Archery (+2 ranged attack rolls), Defense (+1 AC in armor), Dueling (+2 damage with one-handed weapon), Great Weapon Fighting (reroll 1s and 2s on damage), Protection (impose disadvantage on attacker vs ally), or Two-Weapon Fighting (add ability mod to off-hand)." },
      { name:'Second Wind', type:'feature', desc:"Bonus action: regain 1d10 + Fighter level HP. You can use this twice per Short Rest. Also, as a Bonus Action on your turn in combat, you can expend a Second Wind use without healing but to add 1d10 to a failed ability check (Tactical Mind)." },
      { name:'Weapon Mastery', type:'feature', desc:"Use the Mastery property of 3 Simple or Martial weapons. You can swap your choices on Long Rest." }
    ],
    2: [
      { name:'Action Surge', type:'feature', desc:"Once per Short Rest, on your turn you can take one additional Action. This extra action cannot be another Action Surge." },
      { name:'Tactical Mind', type:'feature', desc:"On a failed ability check, you can expend a Second Wind use to add 1d10 to the check. If this causes the check to succeed, you don't regain HP from Second Wind." }
    ],
    3: [{ name:'Fighter Subclass', type:'subclass', desc:"Choose a Martial Archetype: Battle Master, Champion, Eldritch Knight, Psi Warrior, or others. You gain your first subclass feature." }],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    5: [{ name:'Extra Attack', type:'feature', desc:"You can attack twice instead of once whenever you take the Attack action on your turn." }],
    6: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    7: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your chosen Fighter subclass." }],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    9: [
      { name:'Indomitable', type:'feature', desc:"When you fail a saving throw, you can reroll it and must use the new result. 1/Long Rest (increases at higher levels)." },
      { name:'Tactical Shift', type:'feature', desc:"Whenever you use Action Surge, you can also move up to your speed and take one Object Interaction without using an action." }
    ],
    10: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your chosen Fighter subclass." }],
    11: [{ name:'Two Extra Attacks', type:'feature', desc:"You can attack three times whenever you take the Attack action on your turn." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    13: [{ name:'Studied Attacks', type:'feature', desc:"When you miss an attack roll, you gain advantage on your next attack roll against the same target before the end of your turn." }],
    14: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    15: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your chosen Fighter subclass." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    17: [
      { name:'Action Surge (2/Short Rest)', type:'feature', desc:"You can now use Action Surge twice per Short Rest." },
      { name:'Indomitable (2/Long Rest)', type:'feature', desc:"You can now use Indomitable twice per Long Rest." }
    ],
    18: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your chosen Fighter subclass." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Three Extra Attacks', type:'feature', desc:"You can attack four times whenever you take the Attack action on your turn." }]
  }
},

'Monk': {
  saves: ['for','dex'],
  skillChoices: 2, skillList: ['acrobaties','athletisme','histoire','perspicacite','religion','discret'],
  armorProf: 'None',
  weaponProf: 'Simple weapons, Shortsword',
  features: {
    1: [
      { name:'Martial Arts', type:'feature', desc:"Gain these benefits while unarmored or wearing monk weapons: use DEX for attacks/damage, use the Martial Arts damage die (d6) for unarmed strikes, and make one Unarmed Strike as a Bonus Action after an Attack action." },
      { name:'Unarmored Defense', type:'feature', desc:"While wearing no armor and not using a shield, your AC = 10 + DEX modifier + WIS modifier." }
    ],
    2: [
      { name:"Monk's Focus", type:'feature', desc:"You have Focus Points = your Monk level. Spend them on: Flurry of Blows (2 pts, 2 extra Unarmed Strikes after Attack), Patient Defense (1 pt, Dodge as Bonus Action), Step of the Wind (1 pt, Disengage/Dash as Bonus Action; jump distance doubled)." },
      { name:'Unarmored Movement', type:'feature', desc:"Your speed increases by 10 ft while not wearing armor. This bonus increases at higher levels." },
      { name:'Uncanny Metabolism', type:'feature', desc:"When you roll Initiative and have no Focus Points, regain Focus Points equal to your Proficiency Bonus, and regain HP equal to one Martial Arts die roll." }
    ],
    3: [
      { name:'Deflect Attacks', type:'feature', desc:"Reaction: when hit by an attack, reduce damage by 1d10 + DEX modifier + Monk level. If damage is reduced to 0, you can spend 1 Focus Point to redirect it: make a ranged attack (20/60 ft) using the absorbed energy, dealing the original damage type." },
      { name:'Monk Subclass', type:'subclass', desc:"Choose a Monastic Tradition: Mercy, Open Hand, Shadow, or Four Elements. You gain the first subclass feature." }
    ],
    4: [
      { name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." },
      { name:'Slow Fall', type:'feature', desc:"Reaction: reduce fall damage by 5 × your Monk level." }
    ],
    5: [
      { name:'Extra Attack', type:'feature', desc:"You can attack twice instead of once when you take the Attack action. Martial Arts die increases to d8." },
      { name:'Stunning Strike', type:'feature', desc:"After hitting a creature with a Monk weapon or Unarmed Strike, spend 1 Focus Point to attempt to stun it. Target makes a CON save (DC = 8 + PB + WIS modifier) or is Stunned until the start of your next turn." }
    ],
    6: [
      { name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Monastic Tradition." },
      { name:'Empowered Strikes', type:'feature', desc:"Your Unarmed Strikes now count as Magical for the purpose of overcoming resistance and immunity." }
    ],
    7: [{ name:'Evasion', type:'feature', desc:"When you are subjected to an effect that allows a DEX save for half damage: success = no damage, failure = half damage. You must not be Incapacitated." }],
    8: [
      { name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." },
      { name:'Self-Restoration', type:'feature', desc:"At the end of your turn, end one effect on yourself: Frightened, Poisoned, or Stunned (free). Spend 1 Focus Point to also end Paralyzed, Poisoned (stronger), or remove disease." }
    ],
    9: [{ name:'Acrobatic Movement', type:'feature', desc:"While not Incapacitated, you can move across vertical surfaces and across liquids on your turn without falling. Martial Arts die increases to d10." }],
    10: [{ name:'Heightened Focus', type:'feature', desc:"Flurry of Blows can now impose effects: Burning (ongoing fire damage), Pushing (move target 15 ft), or Toppling (knock Prone)." }],
    11: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Monastic Tradition." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    13: [{ name:'Deflect Energy', type:'feature', desc:"Deflect Attacks can now be used against all damage types, not just physical weapon attacks. Martial Arts die increases to d10." }],
    14: [{ name:'Disciplined Survivor', type:'feature', desc:"You are proficient in all saving throws. Additionally, when you succeed on a saving throw, you have advantage on the next saving throw you make before the start of your next turn." }],
    15: [{ name:'Perfect Focus', type:'feature', desc:"When you roll Initiative and have fewer than 4 Focus Points remaining, you regain points up to 4." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    17: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Monastic Tradition. Martial Arts die increases to d12." }],
    18: [{ name:'Superior Defense', type:'feature', desc:"When you spend a Focus Point, you gain resistance to all damage except Force until the start of your next turn." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Body and Mind', type:'feature', desc:"Your DEX score increases by 4 and your WIS score increases by 4. Your maximum for those scores is also increased by 4." }]
  }
},

'Paladin': {
  saves: ['sag','cha'],
  skillChoices: 2, skillList: ['athletisme','perspicacite','intimidation','medecine','persuasion','religion'],
  armorProf: 'All armor, Shields',
  weaponProf: 'Simple and Martial weapons',
  features: {
    1: [
      { name:'Lay on Hands', type:'feature', desc:"You have a pool of HP = 5 × your Paladin level. As a Bonus Action, restore HP to a creature you touch (any amount from your pool), or expend 5 HP to cure one disease or poison." },
      { name:'Spellcasting', type:'feature', desc:"You are a half-caster using Charisma. You prepare spells from the Paladin list equal to your CHA modifier + half your Paladin level (rounded up)." },
      { name:'Weapon Mastery', type:'feature', desc:"Use the Mastery property of 2 weapons. You can swap choices on Long Rest." }
    ],
    2: [
      { name:'Fighting Style', type:'feature', desc:"Choose a fighting style: Defense, Dueling, Great Weapon Fighting, or Protection. Blessed Warrior grants two Cleric cantrips." },
      { name:"Paladin's Smite", type:'feature', desc:"When you hit a creature with a melee or thrown weapon, you can expend a spell slot (no action required) to deal extra Radiant damage: 2d8 + 1d8 per slot level above 1st. Extra 1d8 vs Undead/Fiends. This is not a spell — no concentration. 1/turn." }
    ],
    3: [
      { name:'Channel Divinity', type:'feature', desc:"Use Channel Divinity 2/Short Rest. Sacred Weapon: bonus action, weapon sheds bright light 20 ft and dim 20 ft more, add CHA modifier to attack rolls for 1 minute. Your subclass grants additional options." },
      { name:'Paladin Subclass', type:'subclass', desc:"Swear your sacred oath: Ancients, Devotion, Glory, or Vengeance. You gain Oath Spells (always prepared) and the first subclass feature." }
    ],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    5: [
      { name:'Extra Attack', type:'feature', desc:"You can attack twice instead of once whenever you take the Attack action." },
      { name:'Faithful Steed', type:'feature', desc:"Find Steed is always prepared for you. You can cast it as a Ritual without expending a spell slot." }
    ],
    6: [{ name:'Aura of Protection', type:'feature', desc:"While conscious, you and friendly creatures within 10 ft add your CHA modifier (minimum +1) to all saving throws." }],
    7: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your sacred Oath." }],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    9: [{ name:'Abjure Foes', type:'feature', desc:"As an action, use Channel Divinity. Up to CHA modifier creatures within 60 ft must make a WIS save or become Frightened and have their speed reduced to 0 for 1 minute. Affected creatures repeat the save each turn." }],
    10: [{ name:'Aura of Courage', type:'feature', desc:"While conscious, you and friendly creatures within 10 ft cannot be Frightened." }],
    11: [{ name:'Radiant Strikes', type:'feature', desc:"Your weapon attacks (melee and Unarmed Strikes) deal an extra 1d8 Radiant damage on hit." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    14: [{ name:'Restoring Touch', type:'feature', desc:"When you use Lay on Hands, you can also remove one condition affecting the target: Blinded, Deafened, Frightened, Paralyzed, Poisoned, or Stunned." }],
    15: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your sacred Oath." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    18: [{ name:'Aura Expansion', type:'feature', desc:"Your Aura of Protection and Aura of Courage now extend to 30 ft radius instead of 10 ft." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Holy Nimbus', type:'feature', desc:"As an action: aura 10 ft emits bright light 10 ft and dim 10 ft more. Enemies starting their turn in the aura take 10 Radiant damage. You have advantage on saving throws against spells cast by Fiends and Undead. 1/Long Rest." }]
  }
},

/* ── Psion — Unearthed Arcana 2025 (matériel de playtest, non officiel) ── */
'Psion': {
  saves: ['int','sag'],
  skillChoices: 2, skillList: ['arcanes','perspicacite','intimidation','investigation','medecine','perception','persuasion'],
  armorProf: 'None',
  weaponProf: 'Simple weapons',
  features: {
    1: [
      { name:'Spellcasting', type:'feature', desc:"Full spellcaster using Intelligence. Prepare Psion spells; you know 2 cantrips at level 1 (3 at level 10, 4 at level 14). <em>Psionic Spellcasting</em>: your Psion spells need no Verbal or Material component (except costly materials)." },
      { name:'Psionic Power', type:'feature', desc:"You have Psionic Energy Dice (d6 at level 1, growing to d12; 4 dice at level 1, up to 12). Regain one on a Short Rest, all on a Long Rest. Save DC = your spell save DC. Two powers: <em>Telekinetic Propel</em> (bonus action, push/pull a Large or smaller creature within 30 ft on a failed STR save, 5 ft × the roll) and <em>Telepathic Connection</em> (bonus action, expend a die to extend your 5-ft telepathy by 10 ft × the roll for a number of minutes equal to your level)." },
      { name:'Subtle Telekinesis', type:'feature', desc:"You know Mage Hand. You can cast it without Somatic components and make the spectral hand Invisible." }
    ],
    2: [
      { name:'Psionic Discipline', type:'feature', desc:"Learn 2 disciplines fuelled by your Psionic Energy Dice (e.g. Destructive Thoughts, Ego Whip, Expanded Awareness, Inerrant Aim). One discipline per turn. You gain 2 more at levels 10 and 17, and can swap one each level." },
      { name:'Psionic Modes', type:'feature', desc:"Bonus action, 1 minute — <em>Attack Mode</em>: your damage ignores Psychic Resistance and you can expend a die to reroll damage dice up to your INT modifier. <em>Defense Mode</em>: Resistance to Psychic damage, and on a failed INT/WIS/CHA save you can react to expend a die and add the roll. Two uses, regained on a Long Rest." }
    ],
    3: [{ name:'Psion Subclass', type:'subclass', desc:"Choose a subclass: Metamorph, Psi Warper, Psykinetic, or Telepath." }],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    5: [{ name:'Psionic Restoration', type:'feature', desc:"On a Short Rest, regain expended Psionic Energy Dice up to half your number of dice (round down). Once per Long Rest." }],
    6: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Psion subclass." }],
    7: [{ name:'Psionic Surge', type:'feature', desc:"When you roll Initiative, you can expend one Hit Point Die to regain an expended use of Psionic Modes." }],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    10: [
      { name:'Psionic Discipline', type:'feature', desc:"You learn 2 additional Psionic Disciplines." },
      { name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Psion subclass." }
    ],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    14: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Psion subclass." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    17: [{ name:'Psionic Discipline', type:'feature', desc:"You learn 2 additional Psionic Disciplines." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice. Boon of Energy Resistance is recommended." }],
    20: [{ name:'Enkindled Lifeforce', type:'feature', desc:"Once per turn, when you expend and roll a Psionic Energy Die for a Psion feature or Discipline, you can expend two Hit Point Dice to roll two extra Psionic Energy Dice and add their results." }]
  }
},

'Ranger': {
  saves: ['for','dex'],
  skillChoices: 3, skillList: ['animaux','athletisme','perspicacite','investigation','nature','perception','discret','survie'],
  armorProf: 'Light, Medium, Shields',
  weaponProf: 'Simple and Martial weapons',
  features: {
    1: [
      { name:'Expertise', type:'feature', desc:"Choose 2 skills you are proficient in. Your proficiency bonus is doubled for those skills." },
      { name:'Favored Enemy', type:'feature', desc:"Hunter's Mark is always prepared for you. You can cast it without expending a spell slot a number of times equal to your WIS modifier (minimum 1)/Long Rest." },
      { name:'Spellcasting', type:'feature', desc:"You are a half-caster using Wisdom. Spells start at 2nd level." },
      { name:'Weapon Mastery', type:'feature', desc:"Use the Mastery property of 2 weapons. You can swap choices on Long Rest." }
    ],
    2: [
      { name:'Deft Explorer', type:'feature', desc:"Choose Expertise (double prof in one more skill) or Canny (learn one extra language and one additional Ranger spell of 1st level, always prepared)." },
      { name:'Fighting Style', type:'feature', desc:"Choose a fighting style: Archery, Defense, Druidic Warrior (2 Druid cantrips), or Two-Weapon Fighting." }
    ],
    3: [{ name:'Ranger Subclass', type:'subclass', desc:"Choose a Ranger Archetype: Beast Master, Fey Wanderer, Gloom Stalker, or Hunter. You gain subclass features." }],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    5: [{ name:'Extra Attack', type:'feature', desc:"You can attack twice instead of once whenever you take the Attack action." }],
    6: [{ name:'Roving', type:'feature', desc:"Your walking speed increases by 10 ft. You gain a Climb speed equal to your walking speed and a Swim speed equal to your walking speed." }],
    7: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Ranger Archetype." }],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    9: [{ name:'Expertise', type:'feature', desc:"Double your proficiency bonus in 2 more skills (4 total)." }],
    10: [{ name:'Tireless', type:'feature', desc:"As an action, give yourself temporary HP equal to 1d8 + WIS modifier. Use this WIS modifier times/Long Rest. On Short Rest, reduce your exhaustion level by 1." }],
    11: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Ranger Archetype." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    13: [{ name:'Relentless Hunter', type:'feature', desc:"Hunter's Mark no longer requires concentration from you." }],
    14: [{ name:"Nature's Veil", type:'feature', desc:"Bonus action: you become Invisible until the start of your next turn. You can use this WIS modifier times/Long Rest." }],
    15: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Ranger Archetype." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    17: [{ name:'Precise Hunter', type:'feature', desc:"You have advantage on attack rolls against creatures marked by Hunter's Mark." }],
    18: [{ name:'Feral Senses', type:'feature', desc:"You are aware of Invisible creatures within 30 ft of you, provided you aren't Blinded or Deafened. You also don't need to see a creature to avoid disadvantage on attack rolls against it." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Foe Slayer', type:'feature', desc:"Hunter's Mark deals extra damage equal to your WIS modifier (instead of 1d6), and when it ends it no longer requires concentration." }]
  }
},

'Rogue': {
  saves: ['dex','int'],
  skillChoices: 4, skillList: ['acrobaties','athletisme','duperie','perspicacite','intimidation','investigation','perception','persuasion','prestidig','discret'],
  armorProf: 'Light armor',
  weaponProf: 'Simple weapons, Hand crossbow, Longsword, Rapier, Shortsword',
  features: {
    1: [
      { name:'Expertise', type:'feature', desc:"Choose 2 skills you are proficient in. Your proficiency bonus is doubled for those skills." },
      { name:'Sneak Attack', type:'feature', desc:"Once per turn, deal 1d6 extra damage to one creature you hit with a Finesse or ranged weapon attack if you have advantage, or if an ally is adjacent to the target. Scales by 1d6 every odd level." },
      { name:"Thieves' Cant", type:'feature', desc:"You know Thieves' Cant, a secret mix of slang and signals used by criminals. You can also hide messages in conversation only other Cant speakers recognize." },
      { name:'Weapon Mastery', type:'feature', desc:"Use the Mastery property of 2 Finesse or Ranged weapons. Change choices on Long Rest." }
    ],
    2: [{ name:'Cunning Action', type:'feature', desc:"Bonus action: Dash, Disengage, or Hide." }],
    3: [
      { name:'Rogue Subclass', type:'subclass', desc:"Choose a Roguish Archetype: Arcane Trickster, Assassin, Soulknife, Swashbuckler, or Thief. You gain the first subclass feature." },
      { name:'Steady Aim', type:'feature', desc:"Bonus action: give yourself advantage on your next attack roll this turn. Your speed becomes 0 for the rest of the turn if you use this." }
    ],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    5: [
      { name:'Cunning Strike', type:'feature', desc:"When you deal Sneak Attack damage, replace 1d6 of it to impose one effect: Disarm (target drops held item, STR save), Poison (target is Poisoned 1 min, CON save), Trip (target is Prone, DEX save), or Withdraw (Disengage as part of the attack)." },
      { name:'Uncanny Dodge', type:'feature', desc:"Reaction: when an attacker you can see hits you, halve the attack's damage." }
    ],
    6: [{ name:'Expertise', type:'feature', desc:"Double your proficiency bonus in 2 more skills (4 total)." }],
    7: [
      { name:'Evasion', type:'feature', desc:"When you are subjected to an effect that allows a DEX save for half damage: success = no damage, failure = half damage." },
      { name:'Reliable Talent', type:'feature', desc:"Whenever you make an ability check using a skill or tool you are proficient in, treat any d20 roll of 9 or lower as a 10." }
    ],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    9: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Roguish Archetype." }],
    10: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    11: [{ name:'Improved Cunning Strike', type:'feature', desc:"You can now use two Cunning Strike effects on the same Sneak Attack by replacing 2d6 instead of 1d6." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    13: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Roguish Archetype." }],
    14: [{ name:'Devious Strikes', type:'feature', desc:"New Cunning Strike options: Daze (target is Incapacitated until end of your next turn, CON save), Knock Out (target is Unconscious for 1 min or until damaged, CON save; works only on Sneak Attacks dealing damage), Obscure (target is Blinded until start of your next turn, DEX save)." }],
    15: [{ name:'Slippery Mind', type:'feature', desc:"You gain proficiency in WIS and CHA saving throws." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    17: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Roguish Archetype." }],
    18: [{ name:'Elusive', type:'feature', desc:"No attack roll has advantage against you while you are not Incapacitated." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Stroke of Luck', type:'feature', desc:"If you fail an ability check, you can turn the roll into a 20. If you miss an attack roll, you can turn the miss into a hit. Once used, you regain this ability after a Short or Long Rest." }]
  }
},

'Sorcerer': {
  saves: ['con','cha'],
  skillChoices: 2, skillList: ['arcanes','duperie','perspicacite','intimidation','persuasion','religion'],
  armorProf: 'None',
  weaponProf: 'Simple weapons',
  features: {
    1: [
      { name:'Innate Sorcery', type:'feature', desc:"Bonus action: unleash your inner power for 1 minute. Your spell save DC increases by 1 and you have advantage on Concentration saving throws. Uses = your Sorcerer level; regain all on Long Rest." },
      { name:'Spellcasting', type:'feature', desc:"You are a full spellcaster using Charisma. You know a fixed number of spells from the Sorcerer list (fewer than a Wizard, but always available)." }
    ],
    2: [
      { name:'Font of Magic', type:'feature', desc:"You have Sorcery Points = your Sorcerer level. Flexible Casting: create spell slots from Sorcery Points (2 pts = 1st, 3 = 2nd, 4 = 3rd, 5 = 4th, 6 = 5th) or convert spell slots into Sorcery Points (slot level = points gained)." },
      { name:'Metamagic', type:'feature', desc:"Choose 2 Metamagic options: Careful (protect allies from spells), Distant (double range), Empowered (reroll damage dice), Extended (double duration), Heightened (disadvantage on save), Quickened (cast with Bonus Action), Seeking (reroll missed attacks), Subtle (no verbal/somatic components), Transmuted (change damage type), or Twinned (target two creatures)." }
    ],
    3: [{ name:'Sorcerous Origin', type:'subclass', desc:"Choose your magical origin: Aberrant Mind, Clockwork Soul, Draconic Bloodline, Shadow Magic, or Wild Magic. You gain spells and the first subclass feature." }],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    5: [{ name:'Sorcerous Restoration', type:'feature', desc:"When you roll Initiative and have fewer Sorcery Points than half your Sorcerer level (rounded up), you regain Sorcery Points up to half your Sorcerer level. 1/Long Rest." }],
    6: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Sorcerous Origin." }],
    7: [{ name:'Sorcery Incarnate', type:'feature', desc:"While Innate Sorcery is active: you can use one Metamagic option that costs Sorcery Points without expending points once per turn. You can also apply one additional Metamagic option to a spell simultaneously." }],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    10: [{ name:'Metamagic (2 more)', type:'feature', desc:"You learn 2 more Metamagic options (4 total)." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    14: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Sorcerous Origin." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    18: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Sorcerous Origin." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Arcane Apotheosis', type:'feature', desc:"While Innate Sorcery is active, once per turn when you cast a spell, you can apply a Metamagic option to the spell without expending Sorcery Points." }]
  }
},

'Warlock': {
  saves: ['sag','cha'],
  skillChoices: 2, skillList: ['arcanes','duperie','histoire','intimidation','investigation','nature','religion'],
  armorProf: 'Light armor',
  weaponProf: 'Simple weapons',
  features: {
    1: [
      { name:'Eldritch Invocations', type:'feature', desc:"You gain 1 Eldritch Invocation (gaining more at higher levels). Invocations grant permanent magical abilities such as Agonizing Blast (add CHA to Eldritch Blast damage), Devil's Sight (see in magical darkness), or Mask of Many Faces (cast Disguise Self at will)." },
      { name:'Pact Magic', type:'feature', desc:"You are a spellcaster using Charisma with a unique slot system. All your spell slots are the same level (ascending with your level). Slots recharge on a Short or Long Rest. Slot level scales as you level up." }
    ],
    2: [{ name:'Magical Cunning', type:'feature', desc:"As an action (once per Long Rest), if you have expended all your Pact Magic slots, you can regain half your maximum Pact Magic slots (rounded up)." }],
    3: [{ name:'Warlock Subclass', type:'subclass', desc:"Choose your Otherworldly Patron: Archfey, Celestial, Fiend, Great Old One, or others. You gain Patron spells (always prepared) and the first subclass feature." }],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    5: [{ name:'Contact Patron', type:'feature', desc:"Contact Other Plane is always prepared for you. You can cast it as a ritual targeting your patron without the risk of damage, once per Long Rest without expending a spell slot." }],
    6: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Otherworldly Patron." }],
    7: [{ name:'Eldritch Invocations', type:'feature', desc:"You gain additional Eldritch Invocations (total of 5). New invocations become available, including some that require a Pact Boon." }],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    10: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Otherworldly Patron." }],
    11: [{ name:'Mystic Arcanum — 6th Level', type:'feature', desc:"Choose one 6th-level spell from the Warlock spell list. You can cast it once per Long Rest without expending a spell slot." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    13: [{ name:'Mystic Arcanum — 7th Level', type:'feature', desc:"Choose one 7th-level Warlock spell. Cast it once per Long Rest without a spell slot." }],
    14: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Otherworldly Patron." }],
    15: [{ name:'Mystic Arcanum — 8th Level', type:'feature', desc:"Choose one 8th-level Warlock spell. Cast it once per Long Rest without a spell slot." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    17: [{ name:'Mystic Arcanum — 9th Level', type:'feature', desc:"Choose one 9th-level Warlock spell. Cast it once per Long Rest without a spell slot." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Eldritch Master', type:'feature', desc:"By spending 1 minute entreating your patron, you regain all expended Pact Magic slots. 1/Long Rest." }]
  }
},

'Wizard': {
  saves: ['int','sag'],
  skillChoices: 2, skillList: ['arcanes','histoire','perspicacite','investigation','medecine','religion'],
  armorProf: 'None',
  weaponProf: 'Simple weapons',
  features: {
    1: [
      { name:'Arcane Recovery', type:'feature', desc:"Once per day when you finish a Short Rest, recover expended spell slots with a total level equal to half your Wizard level (rounded up). Can't recover 6th-level or higher slots this way." },
      { name:'Spellcasting', type:'feature', desc:"You are a full spellcaster using Intelligence. You have a spellbook of known spells and prepare spells equal to your INT modifier + Wizard level each day." }
    ],
    2: [
      { name:'Scholar', type:'feature', desc:"You gain Expertise in your choice of Arcana or History. You also learn one additional language of your choice." }
    ],
    3: [
      { name:'Wizard Subclass', type:'subclass', desc:"Choose an Arcane Tradition: Abjuration, Conjuration, Divination, Enchantment, Evocation, Illusion, Necromancy, or Transmutation. You gain the first subclass feature." },
      { name:'Cantrip Formulas', type:'feature', desc:"When you finish a Long Rest, you can study your spellbook for 1 minute to swap one Wizard cantrip you know for another Wizard cantrip." }
    ],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    5: [{ name:'Memorize Spell', type:'feature', desc:"When you finish a Long Rest, choose one spell from your spellbook. That spell is always prepared and doesn't count against your number of prepared spells. You can change it each Long Rest." }],
    6: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Arcane Tradition." }],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    10: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Arcane Tradition." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    14: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Arcane Tradition." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    18: [{ name:'Spell Mastery', type:'feature', desc:"Choose one 1st-level and one 2nd-level Wizard spell. You can cast each of them at their lowest level without expending a spell slot. You can change these spells on a Long Rest (taking 8 hours of study)." }],
    19: [{ name:'Epic Boon', type:'epic', desc:"Gain an Epic Boon feat or another feat of your choice." }],
    20: [{ name:'Signature Spells', type:'feature', desc:"Choose two 3rd-level Wizard spells. They are always prepared and don't count against your prepared spells. You can cast each once per turn without expending a spell slot; regain these free casts on a Short or Long Rest." }]
  }
},

'Artificer': {
  saves: ['con','int'],
  skillChoices: 2, skillList: ['arcanes','histoire','investigation','medecine','nature','perception','prestidig'],
  armorProf: 'Light, Medium, Shields',
  weaponProf: 'Simple weapons, Hand crossbow, Heavy crossbow',
  features: {
    1: [
      { name:'Magical Tinkering', type:'feature', desc:"Touch a Tiny nonmagical object and give it a magical property: emit light, emit a recorded message, emit an odor, or display a static visual. You can have INT modifier such objects active at once." },
      { name:'Spellcasting', type:'feature', desc:"You are a spellcaster using Intelligence. You prepare spells from the Artificer list equal to your INT modifier + half your Artificer level (rounded up)." }
    ],
    2: [
      { name:'Infuse Item', type:'feature', desc:"You gain 4 Infusion recipes (more at higher levels). After a Long Rest, infuse up to 2 items simultaneously (increasing as you level). Infused items count as magic items." },
      { name:'The Right Tool for the Job', type:'feature', desc:"In 1 hour, you can produce any artisan's tool in an unoccupied space using your own tools. It vanishes when you use this feature again." }
    ],
    3: [
      { name:'Artificer Subclass', type:'subclass', desc:"Choose your Artificer Specialist: Alchemist, Armorer, Artillerist, or Battle Smith. You gain Replicate Magic Item infusions and subclass features." },
      { name:'Subclass Feature', type:'subclass', desc:"You gain the first feature of your Artificer Specialist." }
    ],
    4: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    5: [{ name:'Arcane Armament', type:'feature', desc:"You can now attune to up to 4 magic items at once (instead of the normal 3)." }],
    6: [
      { name:'Tool Expertise', type:'feature', desc:"Your Proficiency Bonus is doubled for any ability check you make that uses your proficiency with a tool." },
      { name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Artificer Specialist." }
    ],
    7: [{ name:'Flash of Genius', type:'feature', desc:"Reaction: when you or a creature you can see within 30 ft makes an ability check or saving throw, add your INT modifier to the roll. Uses = INT modifier/Long Rest." }],
    8: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    9: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Artificer Specialist." }],
    10: [{ name:'Magic Item Adept', type:'feature', desc:"You can attune to up to 5 magic items. If you craft a Common or Uncommon magic item, it takes 1/4 the normal time and costs 1/2 the gold." }],
    11: [{ name:'Spell-Storing Item', type:'feature', desc:"After a Long Rest, cast a 1st or 2nd level Artificer spell (1-action casting time) into an item you hold. A creature holding the item can use an action to cast the spell using your spell save DC. The item holds the spell until you use this feature again." }],
    12: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    14: [{ name:'Magic Item Savant', type:'feature', desc:"Attune to up to 6 magic items. You can ignore class, race, spell, and level requirements for attuning to or using magic items." }],
    15: [{ name:'Subclass Feature', type:'subclass', desc:"You gain a feature from your Artificer Specialist." }],
    16: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    18: [{ name:'Magic Item Master', type:'feature', desc:"You can now attune to up to 7 magic items at once." }],
    19: [{ name:'Ability Score Improvement', type:'asi', desc:"Increase one ability score by 2, or two scores by 1. Alternatively, take a feat." }],
    20: [{ name:'Soul of Artifice', type:'feature', desc:"You gain a +1 bonus to all saving throws for each magic item you are currently attuned to. If reduced to 0 HP, use your Reaction to end one Artificer Infusion and drop to 1 HP instead." }]
  }
}

}; // end CLASS_DATA

/* ════════════════════════════════════════════════════════════
   SUBCLASS DATA  (D&D 2024 PHB)
   Keys match SUBCLASS_DATA[className][subclassName][level]
   ════════════════════════════════════════════════════════════ */
const SUBCLASS_DATA = {

'Barbarian': {
  'Path of the Berserker': {
    3:[{ name:'Frenzy', desc:'When you Rage, you can go into a Frenzy. For the duration, you can make one melee weapon attack as a Bonus Action each turn. When your Rage ends, gain 1 Exhaustion level.' }],
    6:[{ name:'Mindless Rage', desc:'You cannot be Charmed or Frightened while Raging. If you are when you enter Rage, the condition ends.' }],
    10:[{ name:'Retaliation', desc:'When you take damage from a creature within 5 ft, use your Reaction to make one melee weapon attack against that creature.' }],
    14:[{ name:'Intimidating Presence', desc:'Bonus Action: one creature within 30 ft makes a WIS save (DC 8+PB+STR) or becomes Frightened until end of your next turn.' }],
  },
  'Path of the Wild Heart': {
    3:[
      { name:'Animal Speaker', desc:'Cast Beast Sense and Speak with Animals once each per Long Rest without spell slots.' },
      { name:'Rage of the Wilds', desc:'Your Rage adds options: Ape (unarmed strikes deal 1d10 + 1d10 while Raging), Eagle (Fly speed = walk speed while Raging), Wolf (you and allies within 10 ft have advantage on attacks vs Prone).' }
    ],
    6:[{ name:'Aspect of the Wilds', desc:'Choose: Cheetah (+10 ft speed, STR adv.), Elephant (push/topple on Reckless hit), or Owl (Perception adv., dim light = bright, init. adv.).' }],
    10:[{ name:'Nature Speaker', desc:'Cast Commune with Nature once per Long Rest without a spell slot.' }],
    14:[{ name:'Power of the Wilds', desc:'Your Rage form upgrades: Ape (reckless damage), Eagle (full Fly during Rage), or Wolf (Large Beast form).' }],
  },
  'Path of the World Tree': {
    3:[{ name:'Vitality of the Tree', desc:'When you Rage, one creature within 10 ft regains HP equal to PB + CON. Also gain temp HP equal to Barbarian level at start of each Rage turn.' }],
    6:[{ name:'Branches of the Tree', desc:'While Raging, Reaction: when a creature moves within 10 ft, teleport to its side and make one melee weapon attack.' }],
    10:[{ name:'Battering Roots', desc:'Melee attacks deal extra 1d6 Force while Raging. Reckless Attack hits can push 15 ft.' }],
    14:[{ name:'Travel Along the Tree', desc:'When you activate Rage and at end of each Rage turn, teleport up to 60 ft. Once per Rage, bring up to 6 willing creatures.' }],
  },
  'Path of the Zealot': {
    3:[
      { name:'Divine Fury', desc:'While Raging, first hit each turn deals extra Radiant or Necrotic = 1d6 + half Barbarian level.' },
      { name:'Warrior of the Gods', desc:'Spells that solely restore you to life need no material components when targeting you.' }
    ],
    6:[{ name:'Fanatical Focus', desc:'Once per Rage, reroll a failed saving throw (must use new result).' }],
    10:[{ name:'Zealous Presence', desc:'Bonus Action: choose up to 10 creatures within 60 ft. They gain advantage on attacks and saves until start of your next turn. 1/Long Rest.' }],
    14:[{ name:'Rage Beyond Death', desc:'While Raging, 0 HP doesn\'t make you Unconscious. You still make death saves. Rage ends when you reach 0 HP.' }],
  },
},

'Bard': {
  'College of Dance': {
    3:[
      { name:'Dazzling Footwork', desc:'No-armor AC = 10+DEX+CHA. On a weapon hit, target makes DEX save or falls Prone.' },
      { name:'Inspiring Movement', desc:'Reaction + 1 Bardic Inspiration: an ally hit by an attack within 5 ft can move half their speed, and you can also move up to your speed (no OA).' }
    ],
    6:[{ name:'Tandem Footwork', desc:'Roll Initiative without Surprise: spend 1 Bardic Inspiration, roll the die, add to yours and all allies within 60 ft.' }],
    10:[{ name:'Leading Evasion', desc:'On a DEX save you succeed: take no damage. Up to 3 allies within 5 ft who failed take half.' }],
    14:[{ name:'Irresistible Dance', desc:'Always have Otto\'s Irresistible Dance prepared. Cast it as a Bonus Action without a slot (no concentration). 1/Long Rest.' }],
  },
  'College of Glamour': {
    3:[
      { name:'Beguiling Magic', desc:'When you cast an Enchantment or Illusion spell, one creature within 60 ft makes WIS save or is Charmed or Frightened until end of next turn. Uses = CHA mod/Long Rest.' },
      { name:'Mantle of Inspiration', desc:'Bonus Action + Bardic Inspiration die: targets within 60 ft gain temp HP = roll and can move their speed immediately (no OA).' }
    ],
    6:[{ name:'Mantle of Majesty', desc:'Bonus Action: assume majesty for 1 minute. Cast Command as a Bonus Action each turn without a slot. Charmed creatures auto-fail save vs Command. 1/Long Rest.' }],
    10:[{ name:'Unbreakable Majesty', desc:'Bonus Action: if a creature attacks you before your next turn, it must pass CHA save or its attack auto-misses and it can\'t attack you again this turn. 1/Long Rest.' }],
    14:[{ name:'Mantle of Dreams', desc:'Use Mantle of Inspiration without spending a Bardic Inspiration die by expending a 1st-level or higher spell slot.' }],
  },
  'College of Lore': {
    3:[
      { name:'Bonus Proficiencies', desc:'Gain proficiency in 3 skills of your choice.' },
      { name:'Cutting Words', desc:'Reaction: spend 1 Bardic Inspiration to subtract the die roll from a creature\'s attack, ability check, or damage roll within 60 ft.' }
    ],
    6:[{ name:'Magical Discoveries', desc:'Learn 2 spells from any class list. They count as Bard spells and don\'t count against prepared spells.' }],
    10:[{ name:'Peerless Skill', desc:'When you make an ability check, spend a Bardic Inspiration die and add the result. If still failing, recover the die.' }],
    14:[{ name:'Unmatched Lore', desc:'Gain Expertise in 3 skills of your choice.' }],
  },
  'College of Valor': {
    3:[
      { name:'Combat Inspiration', desc:'Bardic Inspiration can also be used: roll die and add to a weapon damage roll, or use as a Reaction to add to AC vs one attack.' },
      { name:'Martial Training', desc:'Gain proficiency with Medium Armor, Shields, and Martial weapons.' }
    ],
    6:[{ name:'Extra Attack', desc:'Attack twice when you take the Attack action.' }],
    10:[{ name:'Battle Magic', desc:'When you cast a Bard spell as your action, make one weapon attack as a Bonus Action.' }],
    14:[{ name:'Valor\'s Triumph', desc:'Allies who use your Bardic Inspiration for damage or AC rolls add 1 extra Bardic die to the roll.' }],
  },
  'College of Whispers': {
    3:[
      { name:'Psychic Blades', desc:'When you hit with a weapon, spend Bardic Inspiration to deal extra Psychic: 2d6 (Lv.3), 3d6 (Lv.5), 5d6 (Lv.10), 8d6 (Lv.15).' },
      { name:'Words of Terror', desc:'Spend 1 minute talking to a Humanoid. Deception vs Insight: on success, it\'s Frightened of a named creature for 1 hour. 1/Short or Long Rest per target.' }
    ],
    6:[{ name:'Mantle of Whispers', desc:'Reaction when a Humanoid dies within 30 ft: capture their shadow. Wear it to impersonate them (Disguise Self) for 1 hour. 1/Short or Long Rest.' }],
    10:[{ name:'Shadow Lore', desc:'Whisper at one creature within 30 ft. WIS save or Frightened for 8 hours (can\'t react, must flee). 1/Long Rest.' }],
    14:[{ name:'Master of Intrigue', desc:'Disguise Self at will. Mimic the speech patterns of anyone you\'ve heard for at least 1 minute.' }],
  },
  'College of the Moon': {
    3:[
      { name:'Moonlit Inspiration', desc:'When you grant Bardic Inspiration to an ally, they regain HP equal to your CHA mod (min 1). You can cast Invisibility on yourself once per Long Rest without a spell slot.' },
      { name:'Moon Spells', desc:'Always prepared: Faerie Fire, Moonbeam.' }
    ],
    6:[{ name:'Radiant Moonbeam', desc:'When you cast Moonbeam, the radius doubles to 10 ft and creatures that fail their save take maximum damage on the first roll.' }],
    14:[{ name:'Moonlit Mantle', desc:'You can cast Invisibility on another willing creature once per Long Rest. Whenever a creature uses your Bardic Inspiration, you or they regain HP equal to your Bard level without expending a spell slot or Inspiration die.' }],
  },

},

'Cleric': {
  'Life Domain': {
    3:[
      { name:'Disciple of Life', desc:'Healing spells of 1st level or higher restore extra HP = 2 + spell\'s level.' },
      { name:'Domain Spells', desc:'Always prepared: Bless, Cure Wounds (1st); Aid, Lesser Restoration (3rd); Mass Healing Word, Revivify (5th); Death Ward, Guardian of Faith (7th); Mass Cure Wounds, Raise Dead (9th).' }
    ],
    6:[{ name:'Blessed Healer', desc:'When you heal another creature with a 1st+ spell, you also regain HP = 2 + spell\'s level.' }],
    8:[{ name:'Supreme Healing', desc:'When you roll dice to restore HP with a spell, use the maximum possible result for each die.' }],
    17:[{ name:'Divine Intervention (Life)', desc:'Your Divine Intervention calls a 9th-level Cleric spell automatically.' }],
  },
  'Light Domain': {
    3:[
      { name:'Warding Flare', desc:'Reaction: when a creature attacks you within 30 ft, impose disadvantage on the roll. Uses = WIS mod/Long Rest.' },
      { name:'Domain Spells', desc:'Always prepared: Burning Hands, Faerie Fire (1st); Flaming Sphere, Scorching Ray (3rd); Daylight, Fireball (5th); Guardian of Faith, Wall of Fire (7th); Flame Strike, Scrying (9th).' }
    ],
    6:[{ name:'Radiance of the Dawn', desc:'Channel Divinity: each Hostile creature within 30 ft makes CON save or takes 2d10+Cleric level Radiant (half on success). Dispels magical darkness in the area.' }],
    8:[{ name:'Improved Warding Flare', desc:'Warding Flare now also deals Radiant damage = WIS mod to the attacker when it fires.' }],
    17:[{ name:'Corona of Light', desc:'Action: sunlight aura 60 ft bright / 30 ft dim for 1 minute. Enemies in bright light have disadvantage on saves vs Fire and Radiant spells.' }],
  },
  'Trickery Domain': {
    3:[
      { name:'Blessing of the Trickster', desc:'Action: touch a willing creature. It gains advantage on DEX (Stealth) checks until your next Long Rest.' },
      { name:'Domain Spells', desc:'Always prepared: Charm Person, Disguise Self (1st); Mirror Image, Pass Without Trace (3rd); Blink, Dispel Magic (5th); Dimension Door, Polymorph (7th); Dominate Person, Modify Memory (9th).' }
    ],
    6:[{ name:'Invoke Duplicity', desc:'Channel Divinity: create an illusory duplicate within 30 ft for 1 minute (Concentration). Cast spells as if in its space; advantage on attacks if adjacent to target.' }],
    8:[{ name:'Cloak of Shadows', desc:'Channel Divinity: become Invisible until end of next turn.' }],
    17:[{ name:'Improved Duplicity', desc:'Create 4 duplicates with Invoke Duplicity. Each can be the origin of your spells.' }],
  },
  'War Domain': {
    3:[
      { name:'War Priest', desc:'When you take the Attack action, make one weapon attack as a Bonus Action. Uses = WIS mod/Long Rest.' },
      { name:'Domain Spells', desc:'Always prepared: Divine Favor, Shield of Faith (1st); Magic Weapon, Spiritual Weapon (3rd); Crusader\'s Mantle, Spirit Guardians (5th); Fire Shield, Freedom of Movement (7th); Flame Strike, Hold Monster (9th).' }
    ],
    6:[{ name:'Guided Strike', desc:'Channel Divinity: when you or an ally within 30 ft misses an attack, add +10 to the roll after seeing it miss.' }],
    8:[{ name:'War God\'s Blessing', desc:'Reaction: Channel Divinity to grant an ally within 30 ft +10 to an attack roll.' }],
    17:[{ name:'Avatar of Battle', desc:'Resistance to Bludgeoning, Piercing, and Slashing damage from nonmagical attacks.' }],
  },
  'Knowledge Domain': {
    3:[
      { name:'Blessings of Knowledge', desc:'Learn 2 languages and gain Expertise in 2 of: Arcana, History, Nature, Religion.' },
      { name:'Domain Spells', desc:'Always prepared: Command, Identify (1st); Augury, Suggestion (3rd); Nondetection, Speak with Dead (5th); Arcane Eye, Confusion (7th); Legend Lore, Scrying (9th).' }
    ],
    6:[{ name:'Channel Divinity: Knowledge of the Ages', desc:'Gain proficiency with one Skill or Tool of your choice for 10 minutes.' }],
    8:[{ name:'Channel Divinity: Read Thoughts', desc:'Read the thoughts of one creature within 60 ft. It makes WIS save; on fail, read thoughts for 1 minute and can cast Suggestion without a slot.' }],
    17:[{ name:'Visions of the Past', desc:'Meditate 1 minute to see brief scenes from the history of an object held or a location you occupy.' }],
  },
},

'Druid': {
  'Circle of the Land': {
    2:[
      { name:'Circle Spells', desc:'Choose a terrain (Arctic, Coast, Desert, Forest, Grassland, Mountain, Swamp, Underdark). You always have terrain-specific spells prepared.' },
      { name:'Natural Recovery', desc:'Once per day after a Short Rest, recover spell slots totaling up to half your Druid level (rounded up). Cannot recover 6th+ slots.' }
    ],
    6:[{ name:'Land\'s Aid', desc:'Magic action: choose a point within 60 ft. One creature within 5 ft makes CON save or takes 2d6 Necrotic. One creature within 5 ft regains 2d6 HP.' }],
    10:[{ name:'Natural Ward', desc:'Immunity to poison and disease. Resistance to your terrain\'s associated damage type.' }],
    14:[{ name:'Nature\'s Sanctuary', desc:'Beasts and Plants must make WIS save to attack you, or they must choose a new target.' }],
  },
  'Circle of the Moon': {
    2:[
      { name:'Circle Forms', desc:'Wild Shape as a Bonus Action. Transform into Beasts with CR = Druid level ÷ 3 (min CR 1). Gain temp HP = 3× Beast\'s CR.' },
      { name:'Combat Wild Shape', desc:'While in Wild Shape, Bonus Action: expend a spell slot to regain 1d8 HP per slot level.' }
    ],
    6:[{ name:'Elemental Wild Shape', desc:'Expend 2 Wild Shape uses to transform into an Air, Earth, Fire, or Water Elemental.' }],
    10:[{ name:'Thousand Forms', desc:'Cast Alter Self at will without expending a spell slot.' }],
    14:[{ name:'Beast Spells (Moon)', desc:'Cast Druid spells in Wild Shape form as long as the form has a mouth and equivalent hands.' }],
  },
  'Circle of the Sea': {
    2:[
      { name:'Wrath of the Sea', desc:'Bonus Action: summon water spirits in a 5-ft sphere within 60 ft for 1 minute (Concentration). Creatures starting turn inside make CON save or take 1d6+WIS Cold and are pushed 15 ft.' },
      { name:'Ocean\'s Gift', desc:'Breathe underwater. Gain a Swim speed equal to your walking speed.' }
    ],
    6:[{ name:'Aquatic Affinity', desc:'Cast Water Walk at will. Wrath of the Sea sphere damage increases to 2d6+WIS.' }],
    10:[{ name:'Stormborn', desc:'Gain a Fly speed equal to your walking speed.' }],
    14:[{ name:'Oceanic Gift', desc:'Cast Control Water once per Long Rest without a spell slot.' }],
  },
  'Circle of Stars': {
    2:[
      { name:'Star Map', desc:'Your spellbook is a star chart. You can cast Guidance and Guiding Bolt (WIS mod uses/Long Rest) without spell slots. Both are always prepared.' },
      { name:'Starry Form', desc:'Wild Shape → starry form instead of a Beast: Archer (Bonus Action ranged attack, 1d8+WIS Radiant), Chalice (healing spells also heal self or ally for 1d8+WIS), Dragon (advantage on Concentration saves; spells deal +10 Radiant).' }
    ],
    6:[{ name:'Cosmic Omen', desc:'After Long Rest, roll d6: odd = Weal, even = Woe. Reaction: add d6 (Weal) or subtract d6 (Woe) from a creature\'s roll within 30 ft. Uses = WIS mod/Long Rest.' }],
    10:[{ name:'Twinkling Constellations', desc:'Starry Form upgrades: Archer shoots twice, Chalice heals on any spell slot, Dragon grants Fly speed = walk speed.' }],
    14:[{ name:'Full of Stars', desc:'While in Starry Form, gain resistance to Bludgeoning, Piercing, and Slashing damage.' }],
  },
  'Circle of Wildfire': {
    2:[
      { name:'Summon Wildfire Spirit', desc:'Expend a Wild Shape use to summon a wildfire spirit in an unoccupied space within 30 ft. It acts on your initiative, deals fire, and can move 30 ft. Its attacks count as magical.' },
      { name:'Wildfire Spells', desc:'Always prepared: Burning Hands, Cure Wounds (1st); Flaming Sphere, Scorching Ray (3rd); Plant Growth, Revivify (5th); Aura of Life, Fire Shield (7th); Flame Strike, Mass Cure Wounds (9th).' }
    ],
    6:[{ name:'Enhanced Bond', desc:'When you cast a spell that deals Fire or restores HP, roll a bonus 1d8 and add it to one roll (fire dmg or healing). Must be within 60 ft of your wildfire spirit.' }],
    10:[{ name:'Cauterizing Flames', desc:'When a Small or larger creature dies within 30 ft, a spectral flame appears at its space for 1 minute. You or an ally can enter that space to heal 2d10+WIS HP (once per flame). Number of flames = WIS mod/Long Rest.' }],
    14:[{ name:'Blazing Revival', desc:'When your wildfire spirit vanishes and you are at 0 HP, you can have the spirit explode: each creature within 10 ft takes 2d10 Fire (DEX save for half) and you regain 1 HP. 1/Long Rest.' }],
  },
},

'Fighter': {
  'Battle Master': {
    3:[
      { name:'Combat Superiority', desc:'4 Superiority Dice (d8s), refill on Short or Long Rest. Save DC = 8+PB+STR or DEX.' },
      { name:'Maneuvers (3)', desc:'Choose 3: Commander\'s Strike, Disarming Strike, Distracting Strike, Evasive Footwork, Feinting Attack, Goading Attack, Lunging Attack, Maneuvering Attack, Menacing Attack, Parry, Precision Attack, Pushing Attack, Rally, Riposte, Sweeping Attack, Tactical Assessment, Trip Attack.' },
      { name:'Student of War', desc:'Gain proficiency with one Artisan\'s Tool of your choice.' }
    ],
    7:[
      { name:'Know Your Enemy', desc:'Bonus Action: study a creature for 1 minute. Learn if its STR/DEX/CON/AC/HP/levels are higher, lower, or equal to yours.' },
      { name:'Maneuvers (+2)', desc:'Choose 2 more Maneuvers (5 total). Superiority Dice become d10s.' }
    ],
    10:[
      { name:'Improved Combat Superiority', desc:'Gain 2 more Maneuvers (7 total). Once per Short Rest, regain 1 Superiority Die when you roll initiative with none remaining.' }
    ],
    15:[{ name:'Relentless', desc:'Superiority Dice become d12s. When you roll Initiative with none remaining, regain 1.' }],
  },
  'Champion': {
    3:[
      { name:'Improved Critical', desc:'Weapon attacks score a critical hit on 19-20.' },
      { name:'Remarkable Athlete', desc:'Add half PB (rounded up) to STR, DEX, CON checks without PB. Jump distance +STR mod.' }
    ],
    7:[{ name:'Additional Fighting Style', desc:'Choose a second Fighting Style.' }],
    10:[{ name:'Heroic Warrior', desc:'During a Short Rest, expend a Second Wind use to gain Inspiration.' }],
    15:[{ name:'Superior Critical', desc:'Weapon attacks score critical hits on 18-20.' }],
    18:[{ name:'Survivor', desc:'Start of your turn with < half max HP: regain 5+CON mod HP (if you have at least 1 HP).' }],
  },
  'Eldritch Knight': {
    3:[
      { name:'Spellcasting', desc:'INT-based Wizard spellcasting. Know 3 spells, at least 2 from Abjuration or Evocation.' },
      { name:'Weapon Bond', desc:'1-hour ritual to bond a weapon: can\'t be disarmed, teleport it to your hand as a Bonus Action.' }
    ],
    7:[{ name:'War Magic', desc:'When you cast a cantrip as an action, make one weapon attack as a Bonus Action.' }],
    10:[{ name:'Eldritch Strike', desc:'A creature hit by your weapon attack has disadvantage on saves vs the next spell you cast before end of your next turn.' }],
    15:[{ name:'Arcane Charge', desc:'When you use Action Surge, you can also teleport up to 30 ft to an unoccupied space you can see.' }],
    18:[{ name:'Improved War Magic', desc:'When you cast a spell as an action, make one weapon attack as a Bonus Action.' }],
  },
  'Psi Warrior': {
    3:[{ name:'Psionic Power', desc:'Psionic Energy Dice (d6s) = 2× PB. Spend on: Protective Field (Reaction: reduce damage 1d6+INT mod), Psionic Strike (after weapon hit: extra 1d6+INT Psychic), Mind Thrust (Bonus Action: target INT save or speed −10 ft, no Reactions).' }],
    7:[{ name:'Telekinetic Movement', desc:'Action: move a Large or smaller creature or object within 30 ft up to 30 ft in any direction. STR save to resist.' }],
    10:[{ name:'Guarded Mind', desc:'Resistance to Psychic damage. Spend a Psionic die to end Charmed or Frightened at start of your turn.' }],
    15:[{ name:'Bulwark of Force', desc:'Bonus Action: choose up to PB creatures within 30 ft. Each gains Half Cover until start of your next turn. Uses = INT mod/Long Rest.' }],
    18:[{ name:'Telekinetic Master', desc:'Cast Telekinesis (Concentration) without a slot. Still make weapon attacks while concentrating. 1/Long Rest.' }],
  },
  'Banneret': {
    3:[
      { name:'Banneret Proficiencies', desc:'Gain proficiency in one skill of your choice and one additional language. You can cast Comprehend Languages as a ritual without a spell slot.' },
      { name:'Quick Study', desc:'After observing a language for 1 hour, you can attempt to understand and speak it. After 7 days of study you learn the language permanently.' }
    ],
    7:[{ name:'Team Tactics', desc:'When you take the Attack action, choose an ally within 30 ft. Until the start of your next turn, that ally has Advantage on attack rolls against creatures you attacked this turn.' }],
    10:[{ name:'Rallying Surge', desc:'When you use Action Surge, one ally within 60 ft can immediately use their Reaction to make one weapon attack and move up to their speed.' }],
    15:[{ name:'Stalwart Spirit', desc:'When you fail a saving throw, you can reroll it with a +5 bonus. You must use the new result. 1/Long Rest.' }],
    18:[{ name:'Inspiring Leader', desc:'You are immune to the Charmed and Frightened conditions. Your Team Tactics and Rallying Surge now affect up to 2 allies simultaneously.' }],
  },

},

'Monk': {
  'Warrior of Mercy': {
    3:[
      { name:'Hand of Harm', desc:'Once per turn, after hitting with Unarmed Strike spend 1 Focus Point: deal extra Necrotic = 1 Martial Arts die + WIS mod. Target must CON save or be Poisoned until your next turn.' },
      { name:'Hand of Healing', desc:'Magic action, 1 Focus Point: touch a creature to restore 1 Martial Arts die + WIS mod HP and end one condition (Blinded, Deafened, Paralyzed, Poisoned, or Stunned).' },
      { name:'Implements of Mercy', desc:'Proficiency with Healer\'s Kit, Insight, and Medicine.' }
    ],
    6:[{ name:'Physician\'s Touch', desc:'Hand of Healing can end Disease too. Hand of Harm can Paralyze until end of next turn (+1 Focus Point).' }],
    11:[{ name:'Flurry of Healing and Harm', desc:'Use Flurry of Blows without spending Focus Points if you also use Hand of Healing or Hand of Harm this turn.' }],
    17:[{ name:'Hand of Ultimate Mercy', desc:'Action, 5 Focus Points: touch a creature dead ≤24 hours. It returns to life with 4d10+WIS HP. 1/Long Rest.' }],
  },
  'Warrior of the Open Hand': {
    3:[{ name:'Open Hand Technique', desc:'Each hit of Flurry of Blows can impose one effect (target makes save): Push 15 ft (STR save), Topple (DEX save = Prone), or Stagger (can\'t take Reactions until your next turn).' }],
    6:[{ name:'Wholeness of Body', desc:'Bonus Action: regain HP = 3 Martial Arts die rolls. 1/Long Rest.' }],
    11:[{ name:'Fleet Step', desc:'Step of the Wind costs 0 Focus Points once per turn if you already used a Bonus Action.' }],
    17:[{ name:'Quivering Palm', desc:'4 Focus Points: set a creature vibrating on an Unarmed Strike hit. Within 1 day, action to trigger: CON save or drop to 0 HP; on success, 10d10 Necrotic damage.' }],
  },
  'Warrior of Shadow': {
    3:[{ name:'Shadow Arts', desc:'Know Minor Illusion. Cast Darkness, Darkvision, Pass Without Trace, or Silence by spending Focus Points = spell level. See through magical darkness.' }],
    6:[{ name:'Shadow Step', desc:'Bonus Action (from dim light/dark): teleport 60 ft to another dim/dark space. Advantage on first melee attack this turn.' }],
    11:[{ name:'Cloak of Shadows', desc:'Bonus Action, 3 Focus Points: become Invisible until end of turn (ends if you attack, cast, or enter bright light).' }],
    17:[{ name:'Opportunist', desc:'Reaction: when an ally hits a creature within 5 ft of you, make one Unarmed Strike against it.' }],
  },
  'Warrior of the Four Elements': {
    3:[
      { name:'Elemental Attunement', desc:'Learn 2 Elemental Disciplines. Many cost Focus Points to use (1 Focus Point = 1st-level equivalent). Examples: Fangs of the Fire Snake, Fist of Unbroken Air, Rush of the Gale Spirits, Shape the Flowing River, etc.' },
      { name:'Elemental Burst', desc:'When you hit with an Unarmed Strike, spend 1 Focus Point to deal extra elemental damage (Acid/Cold/Fire/Lightning/Thunder) = 1 Martial Arts die.' }
    ],
    6:[{ name:'Environmental Burst', desc:'Elemental Burst also creates a 5-ft radius at impact. Others in range make DEX save or take the same elemental damage (half on success).' }],
    11:[{ name:'Stride of the Elements', desc:'Spend 2 Focus Points: gain Fly or Swim speed = walking speed for 10 minutes.' }],
    17:[{ name:'Elemental Epitome', desc:'Spend 4 Focus Points: resistance to Acid, Cold, Fire, Lightning, Thunder for 1 minute. Once per turn, deal extra 1 Martial Arts die elemental damage on a hit.' }],
  },
},

'Paladin': {
  'Oath of Ancients': {
    3:[
      { name:'Oath Spells', desc:'Always prepared: Ensnaring Strike, Speak with Animals (1st); Misty Step, Moonbeam (3rd); Plant Growth, Protection from Energy (5th); Ice Storm, Stoneskin (7th); Commune with Nature, Tree Stride (9th).' },
      { name:'Nature\'s Wrath', desc:'Channel Divinity: spectral vines restrain creatures you choose within 10 ft (STR or DEX save, their choice) until end of their next turn.' }
    ],
    7:[{ name:'Aura of Warding', desc:'You and friendly creatures within 10 ft (30 ft at 18th) resist damage from spells.' }],
    15:[{ name:'Undying Sentinel', desc:'When you would drop to 0 HP, drop to 1 HP instead. 1/Long Rest. You no longer age.' }],
    20:[{ name:'Elder Champion', desc:'Action: assume an ancient nature spirit form for 1 minute. Regain 10 HP/turn, cast Paladin spells as Bonus Actions, enemies save at disadvantage vs your spells within 10 ft. 1/Long Rest.' }],
  },
  'Oath of Devotion': {
    3:[
      { name:'Oath Spells', desc:'Always prepared: Protection from Evil and Good, Shield of Faith (1st); Aid, Zone of Truth (3rd); Beacon of Hope, Dispel Magic (5th); Freedom of Movement, Guardian of Faith (7th); Commune, Flame Strike (9th).' },
      { name:'Sacred Weapon', desc:'Channel Divinity: imbue a weapon for 1 minute. Add CHA mod to attack rolls. Weapon sheds light (20 ft bright, 20 ft dim).' }
    ],
    7:[{ name:'Aura of Devotion', desc:'You and friendly creatures within 10 ft (30 ft at 18th) cannot be Charmed while you are conscious.' }],
    15:[{ name:'Purity of Spirit', desc:'Permanently under the effects of Protection from Evil and Good.' }],
    20:[{ name:'Holy Nimbus', desc:'Action: sunlight aura 10 ft for 1 minute. Enemies in it take 10 Radiant/turn. Adv. on saves vs Fiend/Undead spells. 1/Long Rest.' }],
  },
  'Oath of Glory': {
    3:[
      { name:'Oath Spells', desc:'Always prepared: Guiding Bolt, Heroism (1st); Enhance Ability, Magic Weapon (3rd); Haste, Protection from Energy (5th); Compulsion, Freedom of Movement (7th); Legend Lore, Yolande\'s Regal Presence (9th).' },
      { name:'Inspiring Smite', desc:'After dealing damage with Paladin\'s Smite, distribute temp HP = 2d8+Paladin level among creatures within 30 ft.' },
      { name:'Peerless Athlete', desc:'Channel Divinity: advantage on Athletics and Acrobatics for 10 minutes. Double jump distances.' }
    ],
    7:[{ name:'Aura of Alacrity', desc:'+10 ft to your walking speed. Friendly creatures within 10 ft (30 ft at 18th) also get +10 ft.' }],
    15:[{ name:'Glorious Defense', desc:'Reaction when you or an ally within 10 ft is hit: add CHA mod to AC. If the attack misses, make one weapon attack against the attacker. Uses = CHA mod/Long Rest.' }],
    20:[{ name:'Living Legend', desc:'Bonus Action: legendary presence for 1 minute. Once per turn, a miss becomes a hit. Allies within 30 ft can reroll failed saves (CHA mod times). 1/Long Rest.' }],
  },
  'Oath of Vengeance': {
    3:[
      { name:'Oath Spells', desc:'Always prepared: Bane, Hunter\'s Mark (1st); Hold Person, Misty Step (3rd); Haste, Protection from Energy (5th); Banishment, Dimension Door (7th); Hold Monster, Scrying (9th).' },
      { name:'Vow of Enmity', desc:'Channel Divinity: Bonus Action, choose one creature within 10 ft. Advantage on attacks vs it for 1 minute.' }
    ],
    7:[{ name:'Relentless Avenger', desc:'When you hit with an opportunity attack, move up to half your speed immediately after (no OA).' }],
    15:[{ name:'Soul of Vengeance', desc:'Reaction: when a creature under your Vow of Enmity attacks, make one melee weapon attack against it.' }],
    20:[{ name:'Avenging Angel', desc:'Action: grow wings (Fly 60 ft), frightening aura 30 ft for 1 hour. Creatures entering the aura make WIS save or are Frightened. 1/Long Rest.' }],
  },
  'Oath of the Noble Genies': {
    3:[
      { name:'Oath Spells', desc:'Always prepared: Thunderwave, Burning Hands (3rd); Gust of Wind, Scorching Ray (5th); Call Lightning, Fly (9th); Conjure Minor Elementals, Fire Shield (13th); Conjure Elemental, Cloudkill (17th).' },
      { name:'Elemental Smite', desc:'When you hit with a weapon attack and expend a spell slot, choose one of four options: Tempest Smite (thunder damage, push 10 ft), Flame Smite (fire damage that jumps to adjacent creature), Stone Smite (bludgeoning damage, target Prone), or Wind Smite (teleport target up to 20 ft to unoccupied space).' },
      { name:'Channel Divinity: Elemental Command', desc:'As an Action, conjure an elemental aura of your choice: air (you and allies gain +10 ft speed), fire (enemies in 10 ft take fire damage on their turn), earth (you gain resistance to bludgeoning/piercing/slashing), or water (create difficult terrain zone).' }
    ],
    7:[{ name:'Elemental Resistance', desc:'You and allies within 10 ft gain resistance to fire, cold, lightning, and thunder damage while you are conscious.' }],
    15:[{ name:'Elemental Reaction', desc:'When a creature within 30 ft takes fire, cold, lightning, or thunder damage, use your Reaction to halve that damage. If the damage is halved, you regain HP equal to half the damage prevented.' }],
    20:[{ name:'Genie Apotheosis', desc:'For 1 minute, you gain a Fly speed equal to your walk speed, immunity to fire, cold, lightning, and thunder damage, and once per turn you can turn one failed D20 Test into a success.' }],
  },

},

/* ── Psion (Unearthed Arcana 2025 — playtest) ── */
'Psion': {
  'Metamorph': {
    3:[
      { name:'Metamorph Spells', desc:'Always prepared as you gain levels: Cure Wounds, False Life · Alter Self, Enlarge/Reduce · Vampiric Touch · Polymorph · Contagion.' },
      { name:'Organic Weapons', desc:'On the Attack action or an Opportunity Attack, reshape a free hand into an organic weapon (INT for attack and damage; Psychic damage optional). <em>Bone Blade</em>: Simple melee, Finesse, 1d8 Piercing, Advantage if an ally is within 5 ft of the target. <em>Flesh Maul</em>: Simple melee, 1d10 Bludgeoning, target has Disadvantage on its next STR or CON save. <em>Viscera Launcher</em>: Simple ranged 30/90, 1d6 Acid, +1d6 Acid once per turn on a hit.' },
      { name:'Extend Limbs', desc:'Bonus action, expend a Psionic Energy Die: for 1 minute, +5 ft reach, +5 ft Speed, and your Touch-range spells with a casting time of an action reach 10 ft.' }
    ],
    6:[
      { name:'Extra Attack', desc:'Attack twice on the Attack action. You can replace one attack with a Psion cantrip that has a casting time of an action.' },
      { name:'Quickened Healing', desc:'When you cast Cure Wounds, expend two Psionic Energy Dice to cast it as a Bonus Action; roll one die and add the result to the HP restored.' }
    ],
    10:[{ name:'Mutable Form', desc:'Extend Limbs lasts 10 minutes and grants one benefit: <em>Stony Epidermis</em> (Advantage on CON saves for Concentration + Resistance to a chosen damage type), <em>Superior Stride</em> (Dash as a Bonus Action, Climb and Swim Speed equal to your Speed, unarmoured), or <em>Unnatural Flexibility</em> (+2 AC, squeeze through 1-inch spaces, 5 ft of movement to escape restraints or a grapple).' }],
    14:[{ name:'Life-Bending Weapons', desc:'Once per turn on a hit with your Organic Weapon, expend and roll a Psionic Energy Die: creatures of your choice in a 10-ft Emanation regain HP equal to the roll + your INT modifier, and one creature of your choice there takes that much Necrotic damage.' }],
  },
  'Psi Warper': {
    3:[
      { name:'Psi Warper Spells', desc:'Always prepared as you gain levels: Jump, Longstrider · Misty Step, Shatter · Blink, Thunder Step · Dimension Door · Far Step.' },
      { name:'Teleportation', desc:'Cast Misty Step without a spell slot once per Long Rest — or restore that use by expending one Psionic Energy Die (no action required).' },
      { name:'Warp Propel', desc:'When a target fails its save against your Telekinetic Propel, you can teleport it (instead of pushing) to an unoccupied space you can see within 30 ft, horizontal to you.' }
    ],
    6:[
      { name:'Warp Space', desc:'When you cast Shatter, expend one Psionic Energy Die to widen the Sphere to a 20-ft radius.' },
      { name:'Teleporter Combat', desc:'Right after casting Misty Step, you can cast a Psion cantrip with a casting time of an action as part of that Bonus Action.' }
    ],
    10:[{ name:'Duplicitous Target', desc:'Reaction when a creature you can see attacks you: expend a Psionic Energy Die and swap places with a willing, non-Incapacitated creature within 30 ft. That creature becomes the target of the attack.' }],
    14:[{ name:'Mass Teleportation', desc:'Magic action, expend four Psionic Energy Dice: teleport up to your INT modifier of Huge or smaller creatures within 30 ft to spaces you can see within 150 ft. An unwilling creature is unaffected on a successful WIS save.' }],
  },
  'Psykinetic': {
    3:[
      { name:'Psykinetic Spells', desc:'Always prepared as you gain levels: Shield, Telekinetic Crush · Levitate, Telekinetic Grasp · Fly · Telekinesis.' },
      { name:'Telekinetic Techniques', desc:'When you use Telekinetic Propel, add one effect: <em>Boost</em> (target Speed +10 ft until your next turn), <em>Disorient</em> (no Opportunity Attacks until its next turn), or <em>Telekinetic Bolt</em> (on a failed save, Force damage equal to the die roll).' }
    ],
    6:[
      { name:'Empowered Attack Mode', desc:'While Attack Mode is active you gain a Fly Speed of 60 ft (and can hover), and you add your INT modifier to one damage roll of each Psion spell you cast.' },
      { name:'Rebounding Field', desc:'When Shield makes a triggering attack miss, expend one Psionic Energy Die: the attacker makes a DEX save. Roll two dice — on a failure it takes that much Force damage and you gain that many Temporary HP; half damage on a success.' }
    ],
    10:[{ name:'Enhanced Telekinetic Crush', desc:'When you cast Telekinetic Crush, expend one Psionic Energy Die so the target\'s Speed is halved until the start of your next turn, whether it saves or not.' }],
    14:[{ name:'Heightened Telekinesis', desc:'When you cast Telekinesis, expend four Psionic Energy Dice to drop Concentration (duration becomes 1 minute) and to target Gargantuan creatures and objects.' }],
  },
  'Telepath': {
    3:[
      { name:'Telepath Spells', desc:'Always prepared as you gain levels: Charm Person, Detect Thoughts · Hold Person, Suggestion · Confusion · Modify Memory.' },
      { name:'Mind Infiltrator', desc:'When you cast Detect Thoughts, expend two Psionic Energy Dice so it needs no components or Concentration, and the target doesn\'t notice you probing on a failed WIS save.' },
      { name:'Telepathic Hub', desc:'Your telepathy has a range of 10 ft. When you expend a die to extend it with Telepathic Connection, you can contact 1 + the number rolled creatures at once for the duration.' }
    ],
    6:[
      { name:'Empowered Defense Mode', desc:'While Defense Mode is active you add 1d4 to every saving throw, and you can extend that benefit to creatures you are telepathically connected with.' },
      { name:'Potent Thoughts', desc:'You add your INT modifier to the damage of any Psion cantrip.' }
    ],
    10:[{ name:'Telepathic Bolstering', desc:'Your telepathy reaches 30 ft. Reaction when you or a creature within that range fails an ability check or misses an attack: expend and roll a Psionic Energy Die and add it to the d20. The die is expended only if the roll then succeeds.' }],
    14:[{ name:'Scramble Minds', desc:'When you cast Confusion, expend four Psionic Energy Dice to widen the Sphere to a 30-ft radius. Affected creatures roll two d10s and you choose which result governs their turn.' }],
  },
},

'Ranger': {
  'Beast Master': {
    3:[{ name:'Primal Companion', desc:'Bond with a Primal Beast (Land, Sea, or Sky). Commands it as a Bonus Action. It uses your PB for attacks. Regains HP = 5× PB on Short Rest or when you use Wild Shape.' }],
    7:[{ name:'Exceptional Training', desc:'Your beast can take any action (not just listed ones). Its attacks count as Magical.' }],
    11:[{ name:'Bestial Fury', desc:'Your primal beast can attack twice when it takes the Attack action.' }],
    15:[{ name:'Share Spells', desc:'When you cast a spell targeting yourself, also target your primal beast with the same spell.' }],
  },
  'Fey Wanderer': {
    3:[
      { name:'Dreadful Strikes', desc:'Weapon hit: deal extra 1d4 Psychic damage (1d6 at Lv.11). 1/turn.' },
      { name:'Otherworldly Glamour', desc:'Add WIS mod to CHA checks. Proficiency in Deception, Performance, or Persuasion (your choice).' },
      { name:'Fey Wanderer Spells', desc:'Always prepared: Charm Person (1st); Misty Step (3rd); Dispel Magic (5th); Dimension Door (7th); Mislead (9th).' }
    ],
    7:[{ name:'Beguiling Twist', desc:'Reaction: when a creature within 120 ft succeeds on a Charm or Fright save, redirect that effect to another creature within 30 ft of the first (no save).' }],
    11:[{ name:'Fey Reinforcements', desc:'Cast Summon Fey once per Long Rest without a spell slot (no concentration for first minute). Always prepared.' }],
    15:[{ name:'Misty Wanderer', desc:'Cast Misty Step without a slot (WIS mod/Long Rest). When you do, bring one willing creature within 5 ft with you.' }],
  },
  'Gloom Stalker': {
    3:[
      { name:'Dread Ambusher', desc:'First turn in combat: +10 ft walking speed. When you use the Attack action, make one additional attack (deals +1d8 damage).' },
      { name:'Umbral Sight', desc:'Darkvision 60 ft (or +60 ft if you already have it). You are Invisible to creatures that rely on Darkvision to see you in darkness.' },
      { name:'Gloom Stalker Spells', desc:'Always prepared: Disguise Self (1st); Rope Trick (3rd); Fear (5th); Greater Invisibility (7th); Seeming (9th).' }
    ],
    7:[{ name:'Iron Mind', desc:'Proficiency in WIS saving throws (or INT/CHA if already proficient).' }],
    11:[{ name:'Stalker\'s Flurry', desc:'Once per turn, if you miss an attack, make one more attack against the same target as part of the same action.' }],
    15:[{ name:'Shadowy Dodge', desc:'Reaction: when a creature attacks you, impose disadvantage on that roll.' }],
  },
  'Hunter': {
    3:[
      { name:'Hunter\'s Prey', desc:'Choose one: Colossus Slayer (1d8 extra vs bloodied creatures, 1/turn), Giant Killer (Reaction attack vs Large+ creature that misses you), or Horde Breaker (attack a second adjacent creature).' },
      { name:'Hunter\'s Lore', desc:'Proficiency in 2 of: Animal Handling, Insight, Investigation, Nature, Perception, or Survival.' }
    ],
    7:[{ name:'Defensive Tactics', desc:'Choose one: Escape the Horde (no OA against you), Multiattack Defense (+4 AC after first hit), or Steel Will (advantage vs Frightened).' }],
    11:[{ name:'Multiattack', desc:'Choose: Volley (ranged attack all creatures in 10-ft radius) or Whirlwind Attack (melee attack all creatures within 5 ft).' }],
    15:[{ name:'Superior Hunter\'s Defense', desc:'Choose: Evasion, Stand Against the Tide (redirect misses to another creature), or Uncanny Dodge (halve damage from one attack).' }],
  },
  'Winter Walker': {
    3:[
      { name:'Cold Mastery', desc:'You have Resistance to Cold damage. Your attacks and spells ignore Cold Resistance (but not Immunity). Once per turn when you deal damage to a creature, you can deal an additional 1d6 Cold damage.' },
      { name:'Winter Walker Spells', desc:'Always prepared: Fog Cloud, Ice Knife (3rd); Hold Person, Snilloc\'s Snowball Swarm (5th); Sleet Storm, Slow (9th); Ice Storm, Freedom of Movement (13th); Cone of Cold, Hold Monster (17th).' }
    ],
    7:[{ name:'Winter\'s Cloak', desc:'You ignore difficult terrain caused by ice or snow. You can move across icy surfaces without falling Prone. You can Hide in lightly obscured areas created by blizzards, fog, or falling snow.' }],
    11:[{ name:'Blizzard Strike', desc:'When you hit a creature with a weapon attack, you can expend one spell slot to deal an additional 2d6 Cold damage per slot level. The target\'s speed is reduced by 10 ft until the start of your next turn.' }],
    15:[{ name:'Frozen Tundra', desc:'As an Action, you can create a 30-ft radius zone of supernatural cold centered on you for 1 minute (Concentration). Creatures entering or starting their turn in the zone take 2d8 Cold damage (CON save halves). The area is difficult terrain. 1/Long Rest.' }],
  },

},

'Rogue': {
  'Arcane Trickster': {
    3:[
      { name:'Spellcasting', desc:'INT-based Wizard spellcasting. 3 spells, at least 2 from Enchantment or Illusion. Minor Illusion is always known.' },
      { name:'Mage Hand Legerdemain', desc:'Your Mage Hand is Invisible and can pick locks, pick pockets, and use thieves\' tools.' }
    ],
    9:[{ name:'Magical Ambush', desc:'If hidden when you cast a spell, target has disadvantage on the initial saving throw.' }],
    13:[{ name:'Versatile Trickster', desc:'Bonus Action: designate a creature within 5 ft of your Mage Hand. Advantage on attacks vs it until end of your turn.' }],
    17:[{ name:'Spell Thief', desc:'Reaction when targeted by a spell: caster makes save or loses the spell for 8 hours, and you can cast it once. 1/Long Rest.' }],
  },
  'Assassin': {
    3:[
      { name:'Assassinate', desc:'Advantage on attacks vs creatures that haven\'t taken a turn yet. Hits against Surprised creatures are critical hits.' },
      { name:'Assassin\'s Tools', desc:'Proficiency with Disguise Kit and Poisoner\'s Kit.' }
    ],
    9:[{ name:'Infiltration Expertise', desc:'Spend 7 days + 25 gp to create a flawless false identity.' }],
    13:[{ name:'Impostor', desc:'Perfectly mimic a creature\'s speech, writing, and behavior after 3 hours of observation.' }],
    17:[{ name:'Death Strike', desc:'On a critical hit, double the damage dice before adding modifiers.' }],
  },
  'Soulknife': {
    3:[
      { name:'Psionic Power', desc:'Psionic Energy Dice = 2×PB. Use for: Psi-Bolstered Knack (add die to failed INT/WIS/CHA check) or Psychic Whispers (telepathic link PB creatures for 1 hour).' },
      { name:'Psychic Blades', desc:'Manifest Finesse/Thrown (60 ft) blades dealing 1d6 Psychic. Bonus Action after Attack: make one extra Psychic Blade attack.' }
    ],
    9:[{ name:'Soul Blades', desc:'New uses for Psionic Energy Dice: Homing Strikes (reroll missed attack) or Psychic Teleportation (teleport up to 10× die result in feet).' }],
    13:[{ name:'Psychic Veil', desc:'Invisible for 1 hour (until you deal damage or force a save). 1/Long Rest.' }],
    17:[{ name:'Rend Mind', desc:'Sneak Attack hit with Psychic Blade: target makes WIS save or Stunned until end of next turn. 1/Long Rest.' }],
  },
  'Swashbuckler': {
    3:[
      { name:'Fancy Footwork', desc:'If you melee attack a creature on your turn, it can\'t make opportunity attacks against you for the rest of the turn.' },
      { name:'Rakish Audacity', desc:'Add CHA mod to Initiative. Sneak Attack works when only you and the target are adjacent (no ally required).' }
    ],
    9:[{ name:'Panache', desc:'Bonus Action: Persuasion vs Insight. Hostile = Distracted (disadvantage on attacks vs non-you). Friendly = Charmed for 1 minute.' }],
    13:[{ name:'Elegant Maneuver', desc:'Bonus Action: advantage on your next Acrobatics or Athletics check this turn.' }],
    17:[{ name:'Master Duelist', desc:'Once per Short Rest, when you miss an attack, reroll with advantage.' }],
  },
  'Thief': {
    3:[
      { name:'Fast Hands', desc:'Cunning Action now also allows: Use an Object, pick locks with Thieves\' Tools, or use a magic item (including drinking a potion).' },
      { name:'Second-Story Work', desc:'Climb speed = walking speed. Add DEX mod to jump distances.' }
    ],
    9:[{ name:'Supreme Sneak', desc:'Move ≤ half speed: attempt to Hide as a Bonus Action even if observed.' }],
    13:[{ name:'Use Magic Device', desc:'Ignore class, species, and level requirements for attuning to and using magic items.' }],
    17:[{ name:'Thief\'s Reflexes', desc:'First round of combat: take two turns (normal Initiative and Initiative −10).' }],
  },
  'Scion of the Three': {
    3:[
      { name:'Dark Devotion', desc:'You serve the Dead Three—Bane, Bhaal, and Myrkul. When you use Sneak Attack against a creature that is Bloodied (at or below half its HP maximum), roll one additional Sneak Attack damage die.' },
      { name:'Three-Fold Curse', desc:'Once per Short or Long Rest, you can mark a creature you can see within 60 ft. Until the mark ends (1 hour), you deal maximum damage on Sneak Attacks against it.' }
    ],
    9:[{ name:'Fearful Presence', desc:'When you deal Sneak Attack damage, you can force the target to make a WIS save (DC 8 + PB + INT mod) or become Frightened of you for 1 minute. A Frightened creature repeats the save at the end of each of its turns. 1/Short or Long Rest.' }],
    13:[{ name:'Death\'s Touch', desc:'Once per turn when you deal Sneak Attack damage, you can add your INT modifier (min 1) to the damage roll as Necrotic damage. This damage ignores resistance.' }],
    17:[{ name:'Assassin of the Dead Three', desc:'Your Sneak Attack damage dice increase by one size (d6→d8). You regain one use of Fearful Presence on each Short Rest. When you reduce a creature to 0 HP with Sneak Attack, you regain HP equal to your PB + INT mod.' }],
  },

},

'Sorcerer': {
  'Draconic Bloodline': {
    3:[
      { name:'Draconic Resilience', desc:'AC = 13+DEX when unarmored. HP max increases by 1 per Sorcerer level.' },
      { name:'Elemental Affinity', desc:'Choose a damage type (Acid, Cold, Fire, Lightning, Poison). Add CHA mod to one damage roll of spells dealing that type.' }
    ],
    6:[{ name:'Elemental Affinity (Resistance)', desc:'Spend 1 Sorcery Point when using Elemental Affinity to gain resistance to the chosen damage type for 1 hour.' }],
    14:[{ name:'Dragon Wings', desc:'Bonus Action: sprout wings, gain Fly speed = walking speed for 1 hour. 1/Long Rest.' }],
    18:[{ name:'Draconic Presence', desc:'Spend 5 Sorcery Points: 60-ft aura of awe or fear. Creatures that enter or start their turn in it make WIS save or are Charmed (awe) or Frightened (fear) for 1 minute.' }],
  },
  'Wild Magic': {
    3:[
      { name:'Wild Magic Surge', desc:'When you cast a 1st+ spell, the DM can ask you to roll d20. On a 1, roll on the Wild Magic Surge table.' },
      { name:'Tides of Chaos', desc:'Gain advantage on one attack, ability check, or saving throw. The DM may trigger a Wild Magic Surge before you recharge it.' }
    ],
    6:[{ name:'Bend Luck', desc:'Reaction, 2 Sorcery Points: roll 1d4 and add or subtract it from any creature\'s roll within 60 ft.' }],
    14:[{ name:'Controlled Chaos', desc:'Roll twice on Wild Magic Surge table and choose which result to use.' }],
    18:[{ name:'Spell Bombardment', desc:'Once per turn, when you roll max damage on any spell damage die, roll that die again and add it.' }],
  },
  'Aberrant Mind': {
    3:[
      { name:'Psionic Spells', desc:'Always prepared: Arms of Hadar, Dissonant Whispers (1st); Calm Emotions, Detect Thoughts (3rd); Hunger of Hadar, Sending (5th); Evard\'s Black Tentacles, Summon Aberration (7th); Telepathic Bond, Wall of Force (9th).' },
      { name:'Telepathic Speech', desc:'Bonus Action: telepathic link with one creature within 30 ft for CHA mod minutes. Communicate over 1 mile.' }
    ],
    6:[{ name:'Psionic Sorcery', desc:'When casting a Psionic Spell, pay Sorcery Points = spell\'s level to remove all components (except expensive materials).' }],
    14:[{ name:'Revelation in Flesh', desc:'Bonus Action, spend 1+ Sorcery Points for 10 min: 1pt = see invisible; 2pts = swim + breathe water; 3pts = fly; 4pts = squeeze through Tiny spaces.' }],
    18:[{ name:'Warping Implosion', desc:'Action: teleport up to 120 ft. Creatures within 30 ft of origin make STR save or take 3d10 Force and are pulled to origin. 1/Long Rest or 5 Sorcery Points.' }],
  },
  'Clockwork Soul': {
    3:[
      { name:'Clockwork Spells', desc:'Always prepared: Alarm, Protection from Evil and Good (1st); Aid, Lesser Restoration (3rd); Dispel Magic, Protection from Energy (5th); Freedom of Movement, Summon Construct (7th); Greater Restoration, Wall of Force (9th).' },
      { name:'Restore Balance', desc:'Reaction: prevent advantage or disadvantage on any roll made by a creature within 60 ft. Uses = PB/Long Rest.' }
    ],
    6:[{ name:'Bastion of Law', desc:'Magic action, 1-5 Sorcery Points: create a ward on one creature within 30 ft with HP = 5× points spent. Absorbs damage before the creature does.' }],
    14:[{ name:'Trance of Order', desc:'Bonus Action: any d20 roll of 9 or lower = 10, for 1 minute. 1/Long Rest or 5 Sorcery Points.' }],
    18:[{ name:'Clockwork Cavalcade', desc:'In a 30-ft cube: restore 100 HP, repair magic items, dispel spells ≤6th level, deal 6d10 Force to hostiles (CON save half). 1/Long Rest.' }],
  },
  'Spellfire Sorcery': {
    3:[
      { name:'Spellfire Burst', desc:'As a Bonus Action, spend 1–5 Sorcery Points to unleash raw Weave energy. Spend 2 SP to deal 2d6 radiant or fire damage (your choice) to one creature within 60 ft (DEX save halves); or spend 1 SP to grant yourself or an ally within 30 ft temporary HP equal to your CHA mod + SP spent.' },
      { name:'Weave Sense', desc:'You can cast Detect Magic at will without a spell slot.' }
    ],
    6:[{ name:'Counterspell Mastery', desc:'Counterspell is always prepared and doesn\'t count against your spells known. When you successfully counter a spell, regain Sorcery Points equal to the countered spell\'s level (max 5).' }],
    14:[{ name:'Greater Spellfire', desc:'Your Spellfire Burst damage dice increase to d10s. When you spend 4+ Sorcery Points on Spellfire Burst, affected creatures also have Disadvantage on saving throws against your spells until the start of your next turn.' }],
    18:[{ name:'Spellfire Transcendence', desc:'You gain a Fly speed of 60 ft and resistance to fire, radiant, and force damage. When a spell of 5th level or lower targets you, you can use your Reaction to negate it entirely and regain Sorcery Points equal to the spell\'s level. 1/Long Rest.' }],
  },

},

'Warlock': {
  'The Archfey': {
    3:[
      { name:'Patron Spells', desc:'Always prepared: Calm Emotions, Faerie Fire, Misty Step, Phantasmal Force, Sleep.' },
      { name:'Steps of the Fey', desc:'When you cast Misty Step: also Charm one creature within 10 ft of your origin (CHA save) or Frighten one until end of your next turn.' }
    ],
    6:[{ name:'Misty Escape', desc:'Reaction when you take damage: become Invisible and teleport 60 ft. Invisibility lasts until start of your next turn. 1/Short or Long Rest.' }],
    10:[{ name:'Beguiling Defenses', desc:'Immune to Charmed. Reaction when a creature tries to Charm you: it must make WIS save or become Charmed by you for 1 minute. 1/Long Rest.' }],
    14:[{ name:'Bewitching Magic', desc:'When you cast an Enchantment or Illusion spell with a Pact slot, also cast Misty Step for free as part of the same action.' }],
  },
  'The Celestial': {
    3:[
      { name:'Patron Spells', desc:'Always prepared: Cure Wounds, Guiding Bolt (1st); Flaming Sphere, Lesser Restoration (3rd); Daylight, Revivify (5th); Guardian of Faith, Wall of Fire (7th); Flame Strike, Mass Cure Wounds (9th).' },
      { name:'Healing Light', desc:'Bonus Action: spend dice from a pool of d6s (= 1+Warlock level) to restore HP. Refills on Long Rest.' }
    ],
    6:[{ name:'Radiant Soul', desc:'Resistance to Radiant and Fire damage. Add CHA mod to one damage roll of spells dealing Radiant or Fire.' }],
    10:[{ name:'Celestial Resilience', desc:'After a Short or Long Rest, you and up to 5 allies gain temp HP = Warlock level + CHA mod.' }],
    14:[{ name:'Searing Vengeance', desc:'When you are restored from 0 HP, each creature within 30 ft makes DEX save or takes 2d8+CHA Radiant and is Blinded until end of your next turn. You can also fly half your speed.' }],
  },
  'The Fiend': {
    3:[
      { name:'Patron Spells', desc:'Always prepared: Burning Hands, Command (1st); Blindness/Deafness, Scorching Ray (3rd); Fireball, Stinking Cloud (5th); Fire Shield, Wall of Fire (7th); Flame Strike, Hallow (9th).' },
      { name:'Dark One\'s Blessing', desc:'When you reduce a hostile creature to 0 HP, gain temp HP = CHA mod + Warlock level.' }
    ],
    6:[{ name:'Dark One\'s Own Luck', desc:'Add 1d10 to one ability check or saving throw. 1/Short or Long Rest.' }],
    10:[{ name:'Fiendish Resilience', desc:'After a Short or Long Rest, choose a damage type. Gain resistance to it until next Short or Long Rest.' }],
    14:[{ name:'Hurl Through Hell', desc:'Reaction when you hit a creature: it disappears and travels through Hell. It returns at start of your next turn, Incapacitated, and takes 8d10 Psychic (if not a Fiend). 1/Long Rest.' }],
  },
  'The Great Old One': {
    3:[
      { name:'Patron Spells', desc:'Always prepared: Detect Thoughts, Dissonant Whispers (1st); Phantasmal Force, Sending (3rd); Hunger of Hadar, Telekinesis (5th); Summon Aberration, Black Tentacles (7th); Telepathic Bond, Weird (9th).' },
      { name:'Awakened Mind', desc:'Bonus Action: telepathic link with one creature within 30 ft for 10 minutes. No shared language required. 1/Long Rest.' }
    ],
    6:[{ name:'Entropic Ward', desc:'Reaction: impose disadvantage on one attack roll vs you. If it misses, advantage on your next attack vs it. 1/Short or Long Rest.' }],
    10:[{ name:'Thought Shield', desc:'Thoughts can\'t be read. Resistance to Psychic damage. When you take Psychic damage, the attacker takes the same amount.' }],
    14:[{ name:'Create Thrall', desc:'Action: touch an incapacitated Humanoid. It is Charmed (cured by Remove Curse) and you share a telepathic link with it over any distance on the same plane.' }],
  },
},

'Wizard': {
  'School of Abjuration': {
    2:[
      { name:'Abjuration Savant', desc:'Abjuration spells cost half gold and time to copy into your spellbook.' },
      { name:'Arcane Ward', desc:'Casting an Abjuration spell of 1st+ level creates/restores a ward with HP = 2×level + INT mod. Absorbs damage directed at you. Restore it by casting Abjuration spells (restores 2× spell level HP).' }
    ],
    6:[{ name:'Projected Ward', desc:'Reaction: your Arcane Ward absorbs damage that would hit a creature within 30 ft.' }],
    10:[{ name:'Improved Abjuration', desc:'Add PB to ability checks for Abjuration spells that require them (Counterspell, Dispel Magic, etc.).' }],
    14:[{ name:'Spell Resistance', desc:'Advantage on saves vs spells. Resistance to spell damage.' }],
  },
  'School of Conjuration': {
    2:[
      { name:'Conjuration Savant', desc:'Conjuration spells cost half gold and time to copy.' },
      { name:'Minor Conjuration', desc:'Action: conjure a Tiny nonmagical object (worth ≤25 gp) for 1 hour. Disappears if you move 5+ ft from it.' }
    ],
    6:[{ name:'Benign Transposition', desc:'Bonus Action: teleport 30 ft or swap places with a Small/Medium willing creature within 30 ft. Recharges when you cast a Conjuration spell of 1st+ level. 1/Long Rest.' }],
    10:[{ name:'Focused Conjuration', desc:'While concentrating on a Conjuration spell, your concentration can\'t be broken by taking damage.' }],
    14:[{ name:'Durable Summons', desc:'Creatures you conjure or create with Conjuration spells gain 30 temp HP.' }],
  },
  'School of Divination': {
    2:[
      { name:'Divination Savant', desc:'Divination spells cost half gold and time to copy.' },
      { name:'Portent', desc:'After a Long Rest, roll 2 d20s. Before your next Long Rest, replace any d20 roll you or a visible creature makes with one of your Portent dice (before the roll).' }
    ],
    6:[{ name:'Expert Divination', desc:'When you cast a Divination spell of 2nd+ using a slot, regain one expended slot of lower level (max 5th).' }],
    10:[{ name:'The Third Eye', desc:'Bonus Action: Darkvision 60 ft, Ethereal Sight 60 ft, read any language, or see invisible (as the spell). Lasts until next Short or Long Rest.' }],
    14:[{ name:'Greater Portent', desc:'You now roll 3 Portent dice after a Long Rest instead of 2.' }],
  },
  'School of Enchantment': {
    2:[
      { name:'Enchantment Savant', desc:'Enchantment spells cost half gold and time to copy.' },
      { name:'Hypnotic Gaze', desc:'Action: charm a creature within 5 ft (WIS save). It is Incapacitated, speed 0. Maintain as a Bonus Action each turn for up to 1 minute.' }
    ],
    6:[{ name:'Instinctive Charm', desc:'Reaction: redirect an attack against you to another creature within the attacker\'s range (CHA save to resist). 1/Short or Long Rest.' }],
    10:[{ name:'Split Enchantment', desc:'Enchantment spells targeting 1 creature can instead target 2 creatures.' }],
    14:[{ name:'Alter Memories', desc:'Charm a creature with an Enchantment spell: it forgets INT mod hours of memories (CON save to resist).' }],
  },
  'School of Evocation': {
    2:[
      { name:'Evocation Savant', desc:'Evocation spells cost half gold and time to copy.' },
      { name:'Sculpt Spells', desc:'When casting an Evocation spell, choose up to INT mod creatures you can see. They auto-succeed on saves and take no damage from the spell.' }
    ],
    6:[{ name:'Potent Cantrip', desc:'Damaging cantrips deal half damage on a successful save (if normally no damage on success).' }],
    10:[{ name:'Empowered Evocation', desc:'Add INT mod to one damage roll of any Wizard Evocation spell.' }],
    14:[{ name:'Overchannel', desc:'Evocation spell of 5th level or lower: deal maximum damage. 2nd+ use before Long Rest: take 2d12 Necrotic per spell level.' }],
  },
  'School of Illusion': {
    2:[
      { name:'Illusion Savant', desc:'Illusion spells cost half gold and time to copy.' },
      { name:'Improved Minor Illusion', desc:'Know Minor Illusion. When you cast it, create both a sound and an image in a single casting.' }
    ],
    6:[{ name:'Malleable Illusions', desc:'When you cast an Illusion spell with duration ≥ 1 minute, change its nature once per casting with a Magic action.' }],
    10:[{ name:'Illusory Self', desc:'Reaction: when hit by an attack, interpose an illusory duplicate — the attack hits it instead. 1/Short or Long Rest.' }],
    14:[{ name:'Illusory Reality', desc:'When you cast a 1st+ Illusion spell, choose one nonliving object in the illusion to become real for 1 minute.' }],
  },
  'School of Necromancy': {
    2:[
      { name:'Necromancy Savant', desc:'Necromancy spells cost half gold and time to copy.' },
      { name:'Grim Harvest', desc:'When you kill a creature with a spell, regain HP = 2× spell level (or 3× if Necromancy). No Constructs or Undead.' }
    ],
    6:[{ name:'Undead Thralls', desc:'+1 undead to your Animate Dead limit. Your undead gain +PB damage and +Wizard level max HP.' }],
    10:[{ name:'Inured to Undeath', desc:'Resistance to Necrotic damage. Your HP max can\'t be reduced.' }],
    14:[{ name:'Command Undead', desc:'Action: one undead within 60 ft makes WIS save or comes under your control for 24 hours. INT ≥ 8 = advantage on save.' }],
  },
  'School of Transmutation': {
    2:[
      { name:'Transmutation Savant', desc:'Transmutation spells cost half gold and time to copy.' },
      { name:'Minor Alchemy', desc:'Over 10 minutes, temporarily transform 1 cubic foot of nonmagical material into another basic material. Reverts after 1 hour.' }
    ],
    6:[{ name:'Transmuter\'s Stone', desc:'Create a stone over 8 hours. Holder gains one benefit: Darkvision 60 ft, +10 ft speed, CON save proficiency, or resistance to one energy type.' }],
    10:[{ name:'Shapechanger', desc:'Cast Polymorph on yourself (CR 1 or lower Beast) once per Short or Long Rest without a slot.' }],
    14:[{ name:'Master Transmuter', desc:'Destroy your Transmuter\'s Stone for one of: reshape matter (5-ft cube), cure all diseases and poisons on one creature, cast Raise Dead, or reduce target\'s age by 2d10 years.' }],
  },
  'Bladesinger': {
    2:[
      { name:'Training in War and Song', desc:'You gain proficiency with a one-handed melee weapon of your choice and Performance. You can use INT instead of STR or DEX for attack and damage rolls with your chosen weapon while Bladesinging.' },
      { name:'Bladesong', desc:'Bonus Action: activate Bladesong for 1 minute (can\'t wear medium/heavy armor or use shields, and can\'t cast two-handed spells). While active, gain +INT mod to AC, +10 ft walking speed, Advantage on Acrobatics, and +INT mod to CON saves to maintain Concentration. 2×/Short Rest.' }
    ],
    6:[{ name:'Extra Attack', desc:'You can attack twice instead of once whenever you take the Attack action. One of those attacks can be replaced with a cantrip.' }],
    10:[{ name:'Song of Defense', desc:'While Bladesinging, use your Reaction when you take damage to expend a spell slot and reduce the damage by 5× the slot\'s level.' }],
    14:[{ name:'Song of Victory', desc:'While Bladesinging, add your INT modifier to melee weapon damage rolls.' }],
  },

},

'Artificer': {
  'Alchemist': {
    3:[
      { name:'Tool Proficiency', desc:'Gain proficiency with Alchemist\'s Supplies if you don\'t already have it.' },
      { name:'Alchemist Spells', desc:'Always prepared (scales with level): Healing Word, Ray of Sickness (3rd); Flaming Sphere, Melf\'s Acid Arrow (5th); Gaseous Form, Mass Healing Word (9th); Blight, Death Ward (13th); Cloudkill, Raise Dead (17th).' },
      { name:'Experimental Elixir', desc:'When you finish a Long Rest, create 1 Experimental Elixir (more at higher levels). Roll a d6 on the table: Healing (2d4+INT), Swiftness (+10 ft speed), Resilience (temp HP = 2d6+INT), Boldness (Bless), Flight (Fly speed 10 ft), Transformation (Alter Self). Also brew as a Bonus Action using a spell slot.' }
    ],
    9:[{ name:'Restorative Reagents', desc:'Cast Lesser Restoration without a spell slot (INT mod/Long Rest). Experimental Elixirs also grant temp HP = 2d6+INT when consumed.' }],
    15:[{ name:'Chemical Mastery', desc:'Resistance to Acid and Poison damage. Immune to Poisoned. Cast Greater Restoration and Heal once each per Long Rest without spell slots.' }],
  },
  'Armorer': {
    3:[
      { name:'Arcane Armor', desc:'Imbue your armor with arcane power over a Long Rest. Your armor can\'t be removed without your permission, replaces a missing limb, and doesn\'t impose Stealth disadvantage (if you choose). Gain a Thunder Gauntlets or Force-Empowered Rend special attack.' },
      { name:'Armor Model', desc:'Choose Guardian (melee-focused: Thunder Gauntlets, unarmed strikes) or Infiltrator (stealth/ranged: Lightning Launcher, advantage on Stealth).' },
      { name:'Tool Proficiency', desc:'Gain proficiency with Heavy Armor and Smith\'s Tools if not already proficient.' }
    ],
    9:[{ name:'Armor Modifications', desc:'Your Armor can hold up to 4 infusions (instead of 1). The breastplate and boots each count as separate items for infusions.' }],
    15:[{ name:'Perfected Armor', desc:'Guardian: when a creature within 30 ft is hit, use Reaction to use Defensive Field (temp HP = INT mod). Infiltrator: when you hit with Lightning Launcher, the target must make STR save or be pulled 10 ft toward you.' }],
  },
  'Artillerist': {
    3:[
      { name:'Tool Proficiency', desc:'Gain proficiency with Woodcarver\'s Tools if not already.' },
      { name:'Artillerist Spells', desc:'Always prepared: Shield, Thunderwave (3rd); Scorching Ray, Shatter (5th); Fireball, Wind Wall (9th); Ice Storm, Wall of Fire (13th); Cone of Cold, Wall of Force (17th).' },
      { name:'Eldritch Cannon', desc:'Action (or 1 minute ritual): create a magical cannon in an unoccupied space within 5 ft. Choose: Flamethrower (15-ft cone, 2d8 Fire, DEX save half), Force Ballista (ranged spell attack, 2d8 Force + push 5 ft), or Protector (temp HP = 1d8+INT to you and allies within 10 ft). Lasts 1 hour or until destroyed. 1/Long Rest (or spend a spell slot).' }
    ],
    9:[{ name:'Explosive Cannon', desc:'Your cannon\'s damage increases to 3d8. Action: detonate it (60 ft range, 3d8 Force, DEX save DC = spell save DC, for half).' }],
    15:[{ name:'Fortified Position', desc:'Create 2 cannons at once with Eldritch Cannon. You and allies gain Half Cover while within 10 ft of a cannon.' }],
  },
  'Battle Smith': {
    3:[
      { name:'Tool Proficiency', desc:'Gain proficiency with Smith\'s Tools if not already.' },
      { name:'Battle Smith Spells', desc:'Always prepared: Heroism, Shield (3rd); Branding Smite, Warding Bond (5th); Aura of Vitality, Conjure Barrage (9th); Aura of Purity, Fire Shield (13th); Banishing Smite, Mass Cure Wounds (17th).' },
      { name:'Battle Ready', desc:'Gain proficiency with Martial weapons. Use INT instead of STR or DEX for attack and damage rolls with magic weapons.' },
      { name:'Steel Defender', desc:'Create a magical steel defender (companion). It acts on your turn (Bonus Action to command: Attack, Dash, Disengage, Dodge, Help). It uses your PB, your spell save DC, and INT mod for its attack bonus.' }
    ],
    9:[{ name:'Arcane Jolt', desc:'When you or your Steel Defender hits with a Magic weapon or the defender\'s attack, deal extra 2d6 Force or heal one creature within 30 ft for 2d6 HP. Uses = INT mod/Long Rest.' }],
    15:[{ name:'Improved Defender', desc:'Arcane Jolt damage/healing increases to 4d6. Your Steel Defender gains a +2 bonus to its AC.' }],
  },
  'Cartographer': {
    3:[
      { name:'Tool Proficiencies', desc:'You gain proficiency with Calligrapher\'s Supplies and Cartographer\'s Tools. You can scribe spell scrolls in half the normal time and cost.' },
      { name:'Magical Maps', desc:'After each Long Rest, create a number of magical maps equal to your INT modifier (min 1). Map holders: gain +1d4 to Initiative rolls; always know each other\'s locations (same plane); and can target each other with effects that require sight even if they can\'t see each other.' },
      { name:'Illuminated Cartography', desc:'You can cast Faerie Fire without a spell slot a number of times equal to your INT modifier per Long Rest.' }
    ],
    5:[{ name:'Guided Precision', desc:'Your Concentration on Faerie Fire can\'t be broken by taking damage. When a spell you cast deals damage to a creature affected by your Faerie Fire, add your INT modifier to the damage roll.' }],
    15:[
      { name:'Safe Haven', desc:'When a map holder drops to 0 HP, they can destroy the map to immediately regain HP equal to twice your Artificer level and teleport to within 5 ft of you or another map holder (no distance limit).' },
      { name:'Cartographer\'s Path', desc:'Each map holder can cast Find the Path once per Long Rest for free. When you use your Flash of Genius reaction, you or the map holder can additionally teleport up to 30 ft to an unoccupied space.' }
    ],
  },
},

}; // end SUBCLASS_DATA

/* ── Ressources de classe par défaut ── */
const CLASS_RESOURCES = {
  Barbarian: lvl => [
    { name:'Rages', used:0, max:[2,2,3,3,4,4,4,4,4,4,4,5,5,5,5,5,6,6,6,99][Math.min(lvl,20)-1], reset:'long' }
  ],
  Bard: lvl => {
    const r = [{ name:'Bardic Inspiration', used:0, max:null, reset:'short', note:'= CHA mod' }];
    if (lvl >= 5) r.push({ name:'Font of Inspiration', used:0, max:1, reset:'short' });
    return r;
  },
  Cleric: lvl => [
    { name:'Channel Divinity', used:0, max:lvl>=18?3:lvl>=6?2:1, reset:'short' }
  ],
  Druid: lvl => {
    const r = [{ name:'Wild Shape', used:0, max:2, reset:'short' }];
    if (lvl >= 18) r.push({ name:'Beast Spells', used:0, max:1, reset:'long' });
    return r;
  },
  Fighter: lvl => {
    const r = [{ name:'Second Wind', used:0, max:1, reset:'short' }];
    if (lvl >= 2) r.push({ name:'Action Surge', used:0, max:lvl>=17?2:1, reset:'short' });
    if (lvl >= 9) r.push({ name:'Indomitable', used:0, max:lvl>=17?3:lvl>=13?2:1, reset:'long' });
    return r;
  },
  Monk: lvl => [
    { name:'Discipline Points', used:0, max:lvl, reset:'short' }
  ],
  Paladin: lvl => {
    const r = [{ name:'Lay on Hands', used:0, max:lvl*5, reset:'long' }];
    if (lvl >= 2) r.push({ name:'Channel Divinity', used:0, max:lvl>=11?3:lvl>=6?2:1, reset:'short' });
    return r;
  },
  Psion: lvl => [
    // Dés d'Énergie Psionique — d6 → d12, 4 → 12 dés (UA 2025)
    { name:'Psionic Energy Dice', used:0,
      max:[4,4,4,6,6,6,8,8,8,10,10,10,12,12,12,12,12,12,12,12][Math.min(lvl,20)-1], reset:'long' },
    { name:'Psionic Modes', used:0, max:2, reset:'long' }
  ],
  Ranger: lvl => [
    { name:"Hunter's Mark", used:0, max:lvl>=17?3:lvl>=9?2:1, reset:'long' }
  ],
  Rogue: lvl => {
    const r = [];
    if (lvl >= 5) r.push({ name:'Uncanny Dodge', used:0, max:1, reset:'short' });
    if (lvl >= 7) r.push({ name:'Evasion', used:0, max:1, reset:'short' });
    return r;
  },
  Sorcerer: lvl => [
    { name:'Sorcery Points', used:0, max:lvl, reset:'long' }
  ],
  Warlock: lvl => [
    { name:'Spell Slots', used:0, max:lvl>=17?4:lvl>=11?3:lvl>=2?2:1, reset:'short' },
    { name:'Mystic Arcanum', used:0, max:lvl>=17?4:lvl>=15?3:lvl>=13?2:lvl>=11?1:0, reset:'long' }
  ],
  Wizard: lvl => [
    { name:'Arcane Recovery', used:0, max:1, reset:'long' }
  ],
  Artificer: lvl => [
    { name:'Infuse Item', used:0, max:Math.floor(lvl/2)+1, reset:'long' }
  ]
};
