/* ============================================================
   KALEYSUR WIKI — Script principal
   ============================================================ */

// --- Chemin de base (gère les sous-dossiers) ---------------
// Les URL dans SEARCH_INDEX sont relatives à la racine du wiki.
// Cette fonction calcule le préfixe à ajouter selon la profondeur de la page courante.
function getWikiRoot() {
  const path = window.location.pathname;
  const subdirs = ['astoryem', 'ayakan', 'musiyav', 'lore'];
  const parts = path.split('/').filter(p => p);
  const currentDir = parts.length >= 2 ? parts[parts.length - 2] : '';
  return subdirs.includes(currentDir) ? '../' : '';
}

// --- Données de recherche ----------------------------------
// Chargées depuis search-index.json pour faciliter la maintenance.
let SEARCH_INDEX = null;

(function loadSearchIndex() {
  const root = getWikiRoot();
  fetch(root + 'search-index.json')
    .then(r => r.json())
    .then(data => { SEARCH_INDEX = data; })
    .catch(() => { SEARCH_INDEX = []; });
})();

// LEGACY — conservé temporairement pour compatibilité offline au premier chargement
// TODO: supprimer quand search-index.json est systématiquement en cache SW
const _SEARCH_INDEX_FALLBACK = [
  // Continents
  { title: 'Astoryem', category: 'Continent', url: 'astoryem/astoryem.html' },
  { title: 'Ayakan', category: 'Continent', url: 'ayakan/ayakan.html' },

  // Ayakan — Grand Plateau
  { title: 'Grand Plateau', category: 'Région · Ayakan', url: 'ayakan/grand-plateau.html' },
  { title: 'Comhan De Na', category: 'Hub Technologique · Grand Plateau', url: 'ayakan/comhan-de-na.html' },
  { title: 'Armalak', category: 'Cité-Guilde Militaire · Grand Plateau', url: 'ayakan/armalak.html' },
  { title: 'Fios', category: 'Cité de la Recherche · Grand Plateau', url: 'ayakan/fios.html' },
  { title: 'Indelair', category: 'Cité des Artisans · Grand Plateau', url: 'ayakan/indelair.html' },
  { title: 'Lukd Oigrid', category: 'Mine Naine · Grand Plateau', url: 'ayakan/lukd-oigrid.html' },
  { title: 'Lukd Naek', category: 'Atelier de Tissage · Grand Plateau', url: 'ayakan/lukd-naek.html' },
  { title: 'Lukd Tagil', category: 'Cité de Construction · Grand Plateau', url: 'ayakan/lukd-tagil.html' },
  { title: 'Lukd Trenay', category: 'Cité Équestre · Grand Plateau', url: 'ayakan/lukd-trenay.html' },
  { title: 'Lukd Tuanak', category: 'Grenier du Plateau · Grand Plateau', url: 'ayakan/lukd-tuanak.html' },
  { title: 'Creidak', category: 'Cité Diplomatique · Grand Plateau', url: 'ayakan/creidak.html' },
  { title: 'Curcodak', category: 'Cité des Arts · Grand Plateau', url: 'ayakan/curcodak.html' },

  // Ayakan — Ouestvir
  { title: 'Ouestvir', category: 'Région · Ayakan', url: 'ayakan/ouestvir.html' },
  { title: 'Yokoki', category: 'Village Naturiste · Ouestvir', url: 'ayakan/yokoki.html' },
  { title: 'Laryok', category: 'Ville des Archives · Ouestvir', url: 'ayakan/laryok.html' },
  { title: 'Yoklar', category: 'Ville Cosmopolite · Ouestvir', url: 'ayakan/yoklar.html' },
  { title: 'Kasvir', category: 'Centre Intellectuel · Ouestvir', url: 'ayakan/kasvir.html' },
  { title: 'Rusvar', category: 'Ville des Arts et Festivals · Ouestvir', url: 'ayakan/rusvar.html' },
  { title: 'Sordas', category: 'Ville Marchande · Ouestvir', url: 'ayakan/sordas.html' },
  { title: 'Sunkur', category: 'Port Mystique · Ouestvir', url: 'ayakan/sunkur.html' },
  { title: 'Portlune', category: 'Port Commercial · Ouestvir', url: 'ayakan/portlune.html' },
  { title: 'Kayadur', category: 'Région des Ruines Ombreuses · Ouestvir', url: 'ayakan/kayadur.html' },
  { title: 'Zodory', category: 'Région des Diamants · Ouestvir', url: 'ayakan/zodory.html' },
  { title: 'Kolandur', category: 'Côtes du Delta · Ouestvir', url: 'ayakan/kolandur.html' },
  { title: 'Staurdur', category: 'Région des Vents · Ouestvir', url: 'ayakan/staurdur.html' },

  // Ayakan — Crève Glace
  { title: 'Crève Glace', category: 'Région Arctique · Ayakan', url: 'ayakan/creve-glace.html' },
  { title: 'Varask', category: 'Ville-Verrou · Crève Glace', url: 'ayakan/varask.html' },
  { title: 'Mornea', category: 'Port Arctique · Crève Glace', url: 'ayakan/mornea.html' },
  { title: 'Thyrne', category: 'Ville Thermale · Crève Glace', url: 'ayakan/thyrne.html' },
  { title: 'Selvend', category: 'Marché Saisonnier · Crève Glace', url: 'ayakan/selvend.html' },

  // Ayakan — Frayakin
  { title: 'Frayakin', category: 'Région du Feu Sacré · Ayakan', url: 'ayakan/frayakin.html' },
  { title: 'Solcara', category: 'Capitale Temple · Frayakin', url: 'ayakan/solcara.html' },
  { title: 'Pyraël', category: 'Cité des Verrières · Frayakin', url: 'ayakan/pyrael.html' },
  { title: 'Leth', category: 'Sainte Oasis · Frayakin', url: 'ayakan/leth.html' },
  { title: 'Faran', category: 'Citadelle Frontière · Frayakin', url: 'ayakan/faran.html' },
  { title: 'Chaînes de Verre', category: 'Site Sacré · Frayakin', url: 'ayakan/chaines-verre.html' },

  { title: 'Musiyav', category: 'Continent', url: 'musiyav/musiyav.html' },
  { title: "Anneau des Dieux", category: 'Lieu', url: 'musiyav/anneau-dieux.html' },
  { title: "Archipel des Ombres", category: 'Lieu', url: 'musiyav/archipel-ombres.html' },

  // Musiyav — Nord
  { title: 'Terres Gelées', category: 'Région · Musiyav Nord', url: 'musiyav/terres-gelees.html' },
  { title: 'Munabenn', category: 'Région Naine · Musiyav Nord', url: 'musiyav/munabenn.html' },
  { title: 'Creastail', category: 'Capitale Naine · Munabenn', url: 'musiyav/creastail.html' },
  { title: 'Stasmoc', category: 'Centre Métallurgique · Munabenn', url: 'musiyav/stasmoc.html' },
  { title: 'Clagrayn', category: 'Port Nain · Munabenn', url: 'musiyav/clagrayn.html' },
  { title: 'Fedhidom', category: 'Ville Souterraine · Munabenn', url: 'musiyav/fedhidom.html' },
  { title: 'Cricrosal', category: 'Poste Frontalier · Munabenn', url: 'musiyav/cricrosal.html' },
  { title: 'Cairondel', category: 'Royaume Goliath · Musiyav Nord', url: 'musiyav/cairondel.html' },
  { title: 'Gravantempe', category: 'Forteresse Royale · Cairondel', url: 'musiyav/gravantempe.html' },
  { title: 'Treufloran', category: 'Village Druides · Cairondel', url: 'musiyav/treufloran.html' },
  { title: 'Valtendre', category: 'Cité des Guérisseurs · Cairondel', url: 'musiyav/valtendre.html' },
  { title: 'Éllirhom', category: 'Forêt Ancestrale · Musiyav Nord', url: 'musiyav/ellirhom.html' },
  { title: 'Sarathiil', category: 'Région Côtière · Musiyav Nord', url: 'musiyav/sarathiil.html' },
  { title: 'Akalima', category: 'Grand Port · Sarathiil', url: 'musiyav/akalima.html' },
  { title: 'Yndarev', category: 'Village des Vents · Sarathiil', url: 'musiyav/yndarev.html' },
  { title: 'Sillu', category: 'Village Agricole · Sarathiil', url: 'musiyav/sillu.html' },

  // Musiyav — Centre
  { title: 'Murblan', category: 'Région · Musiyav Centre', url: 'musiyav/murblan.html' },
  { title: 'Bekai Keal', category: 'Cité · Murblan', url: 'musiyav/bekai-keal.html' },
  { title: 'Thylkarok', category: 'Cité des Arts · Murblan', url: 'musiyav/thylkarok.html' },
  { title: 'Carroval', category: 'Ville-Monument · Murblan', url: 'musiyav/carroval.html' },
  { title: 'Valacorra', category: 'Région Nobiliaire · Musiyav Centre', url: 'musiyav/valacorra.html' },
  { title: 'Aunthrevin', category: 'Cité Neutre · Valacorra', url: 'musiyav/aunthrevin.html' },
  { title: 'Vendrolis', category: 'Ville des Masques · Valacorra', url: 'musiyav/vendrolis.html' },
  { title: 'Darn Merath', category: 'Bastion des Duels · Valacorra', url: 'musiyav/darn-merath.html' },
  { title: 'Brastelma', category: 'Région Jungle · Musiyav Centre', url: 'musiyav/brastelma.html' },
  { title: 'Xalatlal', category: 'Cité du Masque · Brastelma', url: 'musiyav/xalatlal.html' },
  { title: 'Tochion', category: 'La Gueule Peinte · Brastelma', url: 'musiyav/tochion.html' },
  { title: 'Yabalta', category: 'Perchoir de Cendre · Brastelma', url: 'musiyav/yabalta.html' },
  { title: 'Caudherra', category: 'Région Nomade · Musiyav Centre', url: 'musiyav/caudherra.html' },
  { title: 'Saldromil', category: 'Seule Cité Sédentaire · Caudherra', url: 'musiyav/saldromil.html' },
  { title: 'Kandor-Zeï', category: 'Forteresse Nomade · Caudherra', url: 'musiyav/kandor-zei.html' },
  { title: 'Mirsha Lû', category: 'Cité des Parfums · Caudherra', url: 'musiyav/mirsha-lu.html' },
  { title: 'Ukar Tal', category: 'Justice Itinérante · Caudherra', url: 'musiyav/ukar-tal.html' },
  { title: 'Solgirne', category: 'Région Lacustre · Musiyav Centre', url: 'musiyav/solgirne.html' },
  { title: 'Varnestal', category: 'Capitale Lacustre · Solgirne', url: 'musiyav/varnestal.html' },
  { title: 'Linvelar', category: 'Hameau Forestier · Solgirne', url: 'musiyav/linvelar.html' },
  { title: 'Eldmire', category: 'Village sur Pilotis · Solgirne', url: 'musiyav/eldmire.html' },

  // Musiyav — Est
  { title: 'Viremarche', category: 'Région · Musiyav Est', url: 'musiyav/kaelyth.html' },
  { title: 'Briseneige', category: 'Bastion du Lys · Viremarche', url: 'musiyav/briseneige.html' },
  { title: 'Terres Pieuses', category: 'Région Sacrée · Musiyav Est', url: 'musiyav/terres-pieuses.html' },
  { title: 'Templum Triarii', category: 'Temple aux Neuf Sommets · Terres Pieuses', url: 'musiyav/templum-triarii.html' },
  { title: 'Forge Vivante', category: 'Sanctuaire · Terres Pieuses', url: 'musiyav/forge-vivante.html' },
  { title: 'Isvarun', category: 'Cité du Crépuscule · Terres Pieuses', url: 'musiyav/isvarun.html' },
  { title: 'Callafhar', category: 'Académie des Doutes · Terres Pieuses', url: 'musiyav/callafhar.html' },
  { title: 'Auranthil', category: 'Royaume Elfique · Musiyav Est', url: 'musiyav/auranthil.html' },
  { title: "Elvarë Tyl", category: 'Capitale Elfique · Auranthil', url: 'musiyav/elvar-tyl.html' },
  { title: 'Lunemiral', category: 'Cité des Astres · Auranthil', url: 'musiyav/lunemiral.html' },
  { title: 'Mirithaël', category: 'Ville Suspendue · Auranthil', url: 'musiyav/miriathael.html' },
  { title: 'Faelorrin', category: 'Cité de Résistance · Auranthil', url: 'musiyav/faelorrin.html' },
  { title: 'Xamaris', category: 'Empire du Reniement · Musiyav Est', url: 'musiyav/xamaris.html' },
  { title: 'Xakaril', category: 'Capitale · Xamaris', url: 'musiyav/xakaril.html' },
  { title: 'Marolzhad', category: 'Centre Administratif · Xamaris', url: 'musiyav/marolzhad.html' },
  { title: 'Dorvenkar', category: 'Arsenal Industriel · Xamaris', url: 'musiyav/dorvenkar.html' },
  { title: 'Naskarrem', category: 'Prison-Mine · Xamaris', url: 'musiyav/naskarrem.html' },
  { title: 'Khaëlbar', category: "Cité d'Entraînement · Xamaris", url: 'musiyav/khaelbar.html' },
  { title: 'Tol Vekrah', category: 'Centre Idéologique · Xamaris', url: 'musiyav/tol-vekrah.html' },
  { title: 'Krelsum', category: 'Forteresse-Frontière · Xamaris', url: 'musiyav/krelsum.html' },
  { title: 'Falstrein', category: 'Port Impérial · Xamaris', url: 'musiyav/falstrein.html' },

  // Musiyav — Terres Isolées
  { title: 'Terres Sauvages', category: 'Région · Musiyav Terres Isolées', url: 'musiyav/terres-sauvages.html' },
  { title: 'Dusalain', category: 'Désert de Sel · Musiyav', url: 'musiyav/dusalain.html' },
  { title: "Gouffre d'Ébrion", category: 'Lieu Sacré · Dusalain', url: 'musiyav/gouffre-ebrion.html' },
  { title: "Tinneas A'Bhàis", category: 'Île · Musiyav', url: 'musiyav/tinneas.html' },
  { title: 'Shurakai', category: 'Ville Mystérieuse · Musiyav', url: 'musiyav/shurakai.html' },
  { title: 'Narkûn', category: 'Désert des Exilés · Musiyav', url: 'musiyav/narkun.html' },
  { title: 'Uzzama', category: 'Cité des Exilés · Narkûn', url: 'musiyav/uzzama.html' },
  { title: 'Vrekh Mhor', category: 'Fourmilière-Cité · Narkûn', url: 'musiyav/vrekh-mhor.html' },

  // Régions Éloignées
  { title: 'Îles Hagruk', category: 'Archipel · Régions Éloignées', url: 'musiyav/iles-hagruk.html' },
  { title: 'Clan Grakh-Ul', category: 'Clan · Îles Hagruk', url: 'musiyav/iles-hagruk.html#clans' },
  { title: 'Clan Vorgrul', category: 'Clan · Îles Hagruk', url: 'musiyav/iles-hagruk.html#clans' },
  { title: 'Clan Dhurrek', category: 'Clan · Îles Hagruk', url: 'musiyav/iles-hagruk.html#clans' },
  { title: 'Clan Hral-Gur', category: 'Clan · Îles Hagruk', url: 'musiyav/iles-hagruk.html#clans' },
  { title: 'Darnobscur', category: 'Ville · Archipel des Ombres', url: 'musiyav/darnobscur.html' },
  { title: 'Roklune', category: 'Village · Archipel des Ombres', url: 'musiyav/archipel-ombres.html#lieux' },
  { title: 'Fort-Sépulcre', category: 'Lieu · Archipel des Ombres', url: 'musiyav/archipel-ombres.html#lieux' },
  { title: 'Tour de Benedicte le Gris', category: 'Donjon · Archipel des Ombres', url: 'musiyav/archipel-ombres.html#lieux' },
  { title: 'Néralith', category: 'Cité sous-marine · Archipel', url: 'musiyav/archipel-ombres.html#lieux' },
  { title: 'Lac des Sirènes', category: 'Lieu · Archipel des Ombres', url: 'musiyav/archipel-ombres.html#lieux' },
  { title: 'Coven des Trois Bouches', category: 'Groupe · Archipel des Ombres', url: 'musiyav/archipel-ombres.html#lieux' },
  { title: 'Morbhan le Scellé', category: 'Personnage · Anneau des Dieux', url: 'musiyav/anneau-dieux.html#ile4' },
  { title: 'Zargothrak', category: 'Personnage · Anneau des Dieux', url: 'musiyav/anneau-dieux.html#iles-detail' },

  // Personnages
  { title: 'Arzi Barmene', category: 'Personnage', url: 'lore/personnages.html#arzi-barmene' },
  { title: 'Journal d\'Arzi Barmene', category: 'Document', url: 'lore/journal-arzi.html' },
  { title: 'Myriel Topaz', category: 'Personnage · Feymundi', url: 'lore/personnages.html#myriel-topaz' },
  { title: 'Silitiama', category: 'Personnage · Feymundi', url: 'lore/personnages.html#silitiama' },
  { title: 'Arynn Sylfir', category: 'Personnage · Astoryem', url: 'lore/personnages.html#arynn-sylfir' },
  { title: 'Morwen la Tatouée', category: 'Personnage · Astoryem', url: 'lore/personnages.html#morwen' },
  { title: 'Rupert', category: 'Personnage · Astoryem', url: 'lore/personnages.html#rupert' },
  { title: 'Thokk Pok', category: 'Personnage · Astoryem', url: 'lore/personnages.html#thokk-pok' },
  { title: 'Udasa', category: 'Personnage · Astoryem', url: 'lore/personnages.html#udasa' },
  { title: 'Ellear Belkam', category: 'Personnage historique', url: 'lore/personnages.html#ellear-belkam' },
  { title: 'Les Sœurs du Temps', category: 'Personnage · Arcanumbra', url: 'lore/personnages.html#soeurs-du-temps' },

  // Organisations
  { title: "Ordre du Soleil Radiant", category: 'Organisation', url: 'lore/organisations.html#ordre-soleil' },
  { title: "Cercle de Myriel", category: 'Organisation · Feymundi', url: 'lore/organisations.html#cercle-myriel' },
  { title: "Conseil des Silencieux", category: 'Organisation · Waterflow', url: 'lore/organisations.html#conseil-silencieux' },
  { title: "Arc du Nord", category: 'Organisation · Astoryem', url: 'lore/organisations.html#arc-du-nord' },
  { title: "Hache de Sang", category: 'Organisation · Astoryem', url: 'lore/organisations.html#hache-de-sang' },
  { title: "Conseil de Ville Tempête", category: 'Organisation · Ville Tempête', url: 'lore/organisations.html#conseil-ville-tempete' },
  { title: "Résistances de l'Ombre", category: 'Organisation · Cité des Ombres', url: 'lore/organisations.html#resistances-ombre' },
  { title: "Conseil Astral", category: 'Organisation · Ouestvir', url: 'lore/organisations.html#conseil-astral' },

  // Chronologie
  { title: "Âge des Mythes", category: 'Chronologie', url: 'chronologie.html#age-mythes' },
  { title: "Ère du Silence", category: 'Chronologie', url: 'chronologie.html#ere-silence' },
  { title: "Invasion des Illithids", category: 'Chronologie', url: 'chronologie.html#invasion' },
  { title: "Ascension des 27 Élus", category: 'Chronologie', url: 'chronologie.html#ascension' },
  { title: "Création des Trinités", category: 'Chronologie', url: 'chronologie.html#trinites' },
  { title: "Calendrier de Kaleysur", category: 'Chronologie', url: 'chronologie.html#calendrier' },
  { title: "Les Trois Lunes", category: 'Chronologie · Lore', url: 'chronologie.html#lunes' },
  { title: "Lune Blanche", category: 'Lune · Kaleysur', url: 'chronologie.html#lunes' },
  { title: "Lune Bleue", category: 'Lune · Kaleysur', url: 'chronologie.html#lunes' },
  { title: "Lune Rouge", category: 'Lune · Kaleysur', url: 'chronologie.html#lunes' },
  { title: "Réolta", category: 'Mois · Calendrier', url: 'chronologie.html#mois' },
  { title: "Togail", category: 'Mois · Calendrier', url: 'chronologie.html#mois' },
  { title: "Amrean", category: 'Mois · Calendrier', url: 'chronologie.html#mois' },
  { title: "Brònair", category: 'Mois · Calendrier', url: 'chronologie.html#mois' },
  { title: "Féasach", category: 'Mois · Calendrier', url: 'chronologie.html#mois' },
  { title: "Soillse", category: 'Mois · Calendrier', url: 'chronologie.html#mois' },
  { title: "Cogadhán", category: 'Mois · Calendrier', url: 'chronologie.html#mois' },
  { title: "Fiadhra", category: 'Mois · Calendrier', url: 'chronologie.html#mois' },
  { title: "Sealbh", category: 'Mois · Calendrier', url: 'chronologie.html#mois' },
  { title: "Zénith de l'Année", category: 'Fête · 3 Soillse', url: 'chronologie.html#saisons' },

  // Dieux & Trinités
  { title: 'Cïaaïn', category: 'Dieu · Trinité de l\'Existence', url: 'lore/dieux.html#trinite-existence' },
  { title: 'Gealshaï', category: 'Déesse · Trinité de l\'Existence', url: 'lore/dieux.html#trinite-existence' },
  { title: 'Sgarlaïd', category: 'Déesse · Trinité de l\'Existence', url: 'lore/dieux.html#trinite-existence' },
  { title: 'Ritehakd', category: 'Dieu · Trinité du Corps', url: 'lore/dieux.html#trinite-corps' },
  { title: 'Seakad', category: 'Déesse · Trinité du Corps', url: 'lore/dieux.html#trinite-corps' },
  { title: 'Seo', category: 'Dieu · Trinité du Corps', url: 'lore/dieux.html#trinite-corps' },
  { title: 'Breith', category: 'Déesse · Trinité de la Naissance', url: 'lore/dieux.html#trinite-naissance' },
  { title: 'Beatha', category: 'Déesse · Trinité de la Naissance', url: 'lore/dieux.html#trinite-naissance' },
  { title: 'Crihok', category: 'Dieu · Trinité de la Naissance', url: 'lore/dieux.html#trinite-naissance' },
  { title: 'Dachaigheil', category: 'Dieu · Trinité de la Connaissance', url: 'lore/dieux.html#trinite-connaissance' },
  { title: 'Gintinn', category: 'Déesse · Trinité de la Connaissance', url: 'lore/dieux.html#trinite-connaissance' },
  { title: 'Sealg', category: 'Dieu · Trinité de la Connaissance', url: 'lore/dieux.html#trinite-connaissance' },
  { title: 'Talahmn', category: 'Dieu · Trinité de la Nature', url: 'lore/dieux.html#trinite-nature' },
  { title: 'Cuatan', category: 'Dieu · Trinité de la Nature', url: 'lore/dieux.html#trinite-nature' },
  { title: 'Néamnh', category: 'Déesse · Trinité de la Nature', url: 'lore/dieux.html#trinite-nature' },
  { title: 'Falahm', category: 'Dieu · Trinité des Arts', url: 'lore/dieux.html#trinite-arts' },
  { title: 'Foblath', category: 'Dieu · Trinité des Arts', url: 'lore/dieux.html#trinite-arts' },
  { title: 'Miforthan', category: 'Dieu · Trinité des Arts', url: 'lore/dieux.html#trinite-arts' },
  { title: 'Mathair', category: 'Déesse · Trinité de la Terre', url: 'lore/dieux.html#trinite-terre' },
  { title: 'Ciuin', category: 'Dieu · Trinité de la Terre', url: 'lore/dieux.html#trinite-terre' },
  { title: 'Gorta', category: 'Dieu · Trinité de la Terre', url: 'lore/dieux.html#trinite-terre' },
  { title: 'Ciarahd', category: 'Dieu · Trinité du Temps', url: 'lore/dieux.html#trinite-temps' },
  { title: 'Latha', category: 'Déesse · Trinité du Temps', url: 'lore/dieux.html#trinite-temps' },
  { title: 'Oidhche', category: 'Dieu · Trinité du Temps', url: 'lore/dieux.html#trinite-temps' },
  { title: 'Aonta', category: 'Déesse · Trinité de la Guerre', url: 'lore/dieux.html#trinite-guerre' },
  { title: 'Cogadh', category: 'Dieu · Trinité de la Guerre', url: 'lore/dieux.html#trinite-guerre' },
  { title: 'Ionnsaig', category: 'Dieu · Trinité de la Guerre', url: 'lore/dieux.html#trinite-guerre' },
  { title: 'Meora', category: 'Dieu Inférieur · Panthéon', url: 'lore/dieux.html#dieux-inferieurs' },
  { title: 'Spiaos', category: 'Dieu Inférieur · Panthéon', url: 'lore/dieux.html#dieux-inferieurs' },
  { title: 'Naluin', category: 'Dieu Inférieur · Panthéon', url: 'lore/dieux.html#dieux-inferieurs' },

  // Pages générales
  { title: 'Carte du Monde', category: 'Page', url: 'carte.html' },
  { title: 'Calendrier de Kaleysur', category: 'Page', url: 'calendrier.html' },
  { title: 'Chronologie', category: 'Page', url: 'chronologie.html' },
  { title: 'Personnages', category: 'Page', url: 'lore/personnages.html' },
  { title: 'Organisations & Guildes', category: 'Page', url: 'lore/organisations.html' },
  { title: 'Dieux & Trinités', category: 'Page', url: 'lore/dieux.html' },
];

// --- Recherche -----------------------------------------
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const ROOT = getWikiRoot();

if (searchInput && searchResults) {
  searchInput.addEventListener('input', () => {
    const q = searchInput.value.trim().toLowerCase();
    if (q.length < 2) {
      searchResults.innerHTML = '';
      searchResults.classList.remove('visible');
      return;
    }

    const index = SEARCH_INDEX || _SEARCH_INDEX_FALLBACK;
    const results = index.filter(item =>
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    ).slice(0, 10);

    if (results.length === 0) {
      searchResults.innerHTML = '<div class="search-result-item">Aucun résultat trouvé.</div>';
    } else {
      searchResults.innerHTML = results.map(r => `
        <a class="search-result-item" href="${ROOT}${r.url}">
          <span class="search-result-category">${r.category}</span>
          ${r.title}
        </a>
      `).join('');
    }

    searchResults.classList.add('visible');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrap')) {
      searchResults.classList.remove('visible');
    }
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchResults.classList.remove('visible');
      searchInput.blur();
    }
  });
}

// --- Thème sauvegardé (par joueurs.html) ---------------
(function applyStoredTheme() {
  try {
    const t = JSON.parse(localStorage.getItem('kaleysur_theme') || 'null');
    if (t && t.gold) document.documentElement.style.setProperty('--gold', t.gold);
    if (t && t.dark) document.documentElement.style.setProperty('--gold-dark', t.dark);
  } catch(e) {}
})();

// --- Indicateur utilisateur connecté (nav badge) ------
(function initAuthNav() {
  var navRight = document.querySelector('.nav-right');
  if (!navRight) return;

  var user = localStorage.getItem('kaleysur_user');
  var root = getWikiRoot();

  var el = document.createElement('div');
  el.className = 'nav-user';

  if (user) {
    // Connecté : badge cliquable → joueurs.html + bouton déconnexion
    el.innerHTML =
      '<a href="' + root + 'joueurs.html" class="nav-user-badge" title="' + user + ' — Fiche de personnage">' +
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="nav-user-icon"><path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>' +
        '<span class="nav-user-name">' + user + '</span>' +
      '</a>' +
      '<button class="nav-user-logout" title="Se déconnecter" id="nav-logout-btn">' +
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"/></svg>' +
      '</button>';

    var ham = document.getElementById('hamburger');
    navRight.insertBefore(el, ham || null);

    document.getElementById('nav-logout-btn').addEventListener('click', function() {
      localStorage.removeItem('kaleysur_user');
      location.reload();
    });

  } else {
    // Non connecté : lien "Connexion", sauf sur joueurs.html qui gère son propre écran
    if (!document.getElementById('screen-auth')) {
      el.innerHTML =
        '<a href="' + root + 'joueurs.html" class="nav-login-btn" title="Se connecter">' +
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="nav-user-icon"><path d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3.75"/></svg>' +
          '<span class="nav-login-label">Connexion</span>' +
        '</a>';

      var ham2 = document.getElementById('hamburger');
      navRight.insertBefore(el, ham2 || null);
    }
  }
})();

// --- Sidebar mobile -------------------------------------
const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('sidebar-overlay');

if (hamburger && sidebar && overlay) {
  hamburger.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('visible');
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('visible');
  });
}

// --- Lien actif + sidebar déroulante -----------------
(function initSidebar() {
  // 1. Marquer le lien actif
  const pathParts = window.location.pathname.split('/').filter(p => p);
  const current = pathParts.pop() || 'index.html';
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    const hrefFile = href.split('/').pop();
    if (hrefFile === current || (current === '' && hrefFile === 'index.html')) {
      link.classList.add('active');
    }
  });

  // 2. Sections repliables
  const sections = document.querySelectorAll('.sidebar-section');
  sections.forEach(section => {
    const title = section.querySelector('.sidebar-section-title');
    if (!title) return;

    const titleText = title.textContent.trim();
    const hasActive = section.querySelector('.sidebar-link.active');

    // Navigation toujours ouverte ; sections avec lien actif ouvertes ; reste replié
    if (titleText !== 'Navigation' && !hasActive) {
      section.classList.add('collapsed');
    }

    // Toggle au clic
    title.addEventListener('click', () => {
      section.classList.toggle('collapsed');
    });
  });
})();

// --- Table des matières auto ---------------------------
(function buildTOC() {
  const toc = document.getElementById('auto-toc');
  if (!toc) return;

  const content = document.querySelector('.main-content');
  if (!content) return;

  const headings = content.querySelectorAll('h2, h3');
  if (headings.length < 2) { toc.remove(); return; }

  let html = '<ul>';
  let lastH2 = null;

  headings.forEach((h, i) => {
    if (!h.id) h.id = 'section-' + i;
    if (h.tagName === 'H2') {
      if (lastH2 !== null) html += '</ul></li>';
      html += `<li><a href="#${h.id}">${h.textContent}</a><ul>`;
      lastH2 = i;
    } else {
      html += `<li><a href="#${h.id}">${h.textContent}</a></li>`;
    }
  });

  if (lastH2 !== null) html += '</ul></li>';
  html += '</ul>';
  toc.innerHTML = html;
})();

// --- Bouton Page Aléatoire dans la sidebar -------------
(function initRandomPageBtn() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  // Pas d'index de recherche chargé (ex. page DM) → pas de bouton aléatoire
  if (!Array.isArray(SEARCH_INDEX) || !SEARCH_INDEX.length) return;

  // Ne cibler que les vraies pages HTML (pas les ancres #fragment)
  const pages = SEARCH_INDEX
    .filter(p => p.url.endsWith('.html') && !p.url.includes('#'))
    .filter((p, i, arr) => arr.findIndex(x => x.url === p.url) === i);

  const root = getWikiRoot();

  const btn = document.createElement('a');
  btn.className = 'sidebar-link random-page-btn';
  btn.href = '#';
  btn.innerHTML = '<span class="icon">' + ic('die') + '</span> Page Aléatoire';
  btn.title = 'Ouvrir une page au hasard';

  btn.addEventListener('click', e => {
    e.preventDefault();
    const page = pages[Math.floor(Math.random() * pages.length)];
    window.location.href = root + page.url;
  });

  // Insérer dans la section Navigation (toujours visible)
  const navSection = Array.from(sidebar.querySelectorAll('.sidebar-section')).find(s => {
    const t = s.querySelector('.sidebar-section-title');
    return t && t.textContent.trim() === 'Navigation';
  });

  if (navSection) {
    navSection.appendChild(btn);
  } else {
    // Fallback : ajouter en haut de la sidebar
    sidebar.insertBefore(btn, sidebar.firstChild);
  }
})();

// --- Smooth scroll for anchor links --------------------
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// --- Les Trois Lunes — Logo & Icônes sidebar ----------------
(function initMoonIcons() {
  // 1. Remplacer l'icône ⚜ de la barre de navigation par l'icône officielle de l'app
  var brandIcon = document.querySelector('.nav-brand-icon');
  if (brandIcon) {
    var root = getWikiRoot();
    brandIcon.style.cssText = 'display:flex;align-items:center;font-size:0;line-height:1';
    brandIcon.innerHTML = '<img src="' + root + 'icons/icon-192.png" alt="Les Trois Lunes de Kaleysur" width="28" height="28" style="border-radius:50%;display:block;">';
  }

  // 2. Appliquer data-moon à chaque section de la sidebar
  var moonMap = {
    'Navigation':        'white',
    'Astoryem':          'blue',
    'Ayakan':            'white',
    'Musiyav':           'red',
    'Régions Éloignées': 'red',
    'Personnages & Lore':'gold'
  };
  document.querySelectorAll('.sidebar-section').forEach(function(section) {
    var titleEl = section.querySelector('.sidebar-section-title');
    if (!titleEl) return;
    // Retirer le chevron ▾ injecté en CSS ::after
    var text = titleEl.textContent.replace('▾','').trim();
    var moon = moonMap[text];
    if (moon) section.setAttribute('data-moon', moon);
  });
})();


// --- Chat widget (chargé uniquement si connecté) --------
(function loadChat() {
  if (!localStorage.getItem('kaleysur_user')) return;
  // Pages avec leur propre chat intégré (fiche joueur, DM screen) : ne pas doubler
  if (document.getElementById('chat-fab') || document.getElementById('dm-chat-input')) return;
  var s = document.createElement('script');
  s.src = getWikiRoot() + 'js/chat.js';
  document.body.appendChild(s);
})();

console.log('✦ Kaleysur Wiki chargé ✦');
