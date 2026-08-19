/* ============================================================
   KALEYSUR — Composants partagés (nav + sidebar)
   Injecté avant wiki.js sur toutes les pages.
   Centralise les éléments répétés pour éviter la duplication.
============================================================ */

(function () {
  'use strict';

  const subdirs = ['astoryem', 'ayakan', 'musiyav', 'lore'];
  const parts = window.location.pathname.split('/').filter(p => p);
  const currentDir = parts.length >= 2 ? parts[parts.length - 2] : '';
  const R = subdirs.includes(currentDir) ? '../' : '';

  /* ── Navigation supérieure ─────────────────────────────── */
  const nav = document.getElementById('main-nav');
  if (nav) {
    nav.innerHTML = `
  <a href="${R}index.html" class="nav-brand">
    <span class="nav-brand-icon">${ic('fleur')}</span>
    <span class="nav-brand-text">Kaleysur</span>
  </a>
  <div class="nav-right">
    <div class="search-wrap">
      <span class="search-icon">${ic('search')}</span>
      <input class="search-input" id="search-input" type="text" placeholder="Rechercher…" autocomplete="off">
      <div class="search-results" id="search-results"></div>
    </div>
    <button class="hamburger" id="hamburger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </div>`;
  }

  /* ── Barre latérale ────────────────────────────────────── */
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    sidebar.innerHTML = `
  <div class="sidebar-section">
    <div class="sidebar-section-title">Navigation</div>
    <a href="${R}index.html" class="sidebar-link"><span class="icon">${ic('home')}</span> Accueil</a>
    <a href="${R}chronologie.html" class="sidebar-link"><span class="icon">${ic('scroll')}</span> Chronologie</a>
    <a href="${R}carte.html" class="sidebar-link"><span class="icon">${ic('map')}</span> Carte du Monde</a>
    <a href="${R}calendrier.html" class="sidebar-link"><span class="icon">${ic('calendar')}</span> Calendrier</a>
    <a href="${R}joueurs.html" class="sidebar-link"><span class="icon">${ic('die')}</span> Joueurs</a>
    <a href="${R}dm.html" class="sidebar-link"><span class="icon">${ic('eye')}</span> DM Screen</a>
  </div>
  <hr class="sidebar-divider">
  <div class="sidebar-section">
    <div class="sidebar-section-title">Astoryem</div>
    <a href="${R}astoryem/astoryem.html" class="sidebar-link"><span class="icon">${ic('globe')}</span> Astoryem</a>
    <a href="${R}astoryem/feymundi.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('castle')}</span> Feymundi</a>
    <a href="${R}astoryem/waterflow.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('wave')}</span> Waterflow</a>
    <a href="${R}astoryem/ville-tempete.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('bolt')}</span> Ville Tempête</a>
    <a href="${R}astoryem/arcanumbra.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('hourglass')}</span> Arcanumbra</a>
    <a href="${R}astoryem/cite-ombres.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('newmoon')}</span> Cité des Ombres</a>
  </div>
  <hr class="sidebar-divider">
  <div class="sidebar-section">
    <div class="sidebar-section-title">Ayakan</div>
    <a href="${R}ayakan/ayakan.html" class="sidebar-link"><span class="icon">${ic('globe')}</span> Ayakan</a>
    <div class="sidebar-region-label">Grand Plateau</div>
    <a href="${R}ayakan/comhan-de-na.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('gear')}</span> Comhan De Na</a>
    <a href="${R}ayakan/grand-plateau.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('anvil')}</span> Grand Plateau</a>
    <a href="${R}ayakan/armalak.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('shield')}</span> Armalak</a>
    <a href="${R}ayakan/fios.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('lens')}</span> Fios</a>
    <a href="${R}ayakan/indelair.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('flask')}</span> Indelair</a>
    <a href="${R}ayakan/lukd-oigrid.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('anvil')}️</span> Lukd Oigrid</a>
    <a href="${R}ayakan/lukd-naek.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('needle')}</span> Lukd Naek</a>
    <a href="${R}ayakan/lukd-tagil.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('crane')}</span> Lukd Tagil</a>
    <a href="${R}ayakan/lukd-trenay.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('horse')}</span> Lukd Trenay</a>
    <a href="${R}ayakan/lukd-tuanak.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('wheat')}</span> Lukd Tuanak</a>
    <a href="${R}ayakan/creidak.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('dove')}</span> Creidak</a>
    <a href="${R}ayakan/curcodak.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('tent')}</span> Curcodak</a>
    <div class="sidebar-region-label">Ouestvir</div>
    <a href="${R}ayakan/ouestvir.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('sparkle')}</span> Ouestvir</a>
    <a href="${R}ayakan/yokoki.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('leaf')}</span> Yokoki</a>
    <a href="${R}ayakan/laryok.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('temple')}</span> Laryok</a>
    <a href="${R}ayakan/yoklar.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('city')}</span> Yoklar</a>
    <a href="${R}ayakan/kasvir.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('book')}</span> Kasvir</a>
    <a href="${R}ayakan/rusvar.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('mask')}</span> Rusvar</a>
    <a href="${R}ayakan/sordas.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('bell')}</span> Sordas</a>
    <a href="${R}ayakan/sunkur.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('wave')}</span> Sunkur</a>
    <a href="${R}ayakan/portlune.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('ship')}</span> Portlune</a>
    <div class="sidebar-region-label">Régions</div>
    <a href="${R}ayakan/kayadur.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('volcano')}</span> Kayadur</a>
    <a href="${R}ayakan/zodory.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('gem')}</span> Zodory</a>
    <a href="${R}ayakan/kolandur.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('wave')}</span> Kolandur</a>
    <a href="${R}ayakan/staurdur.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('wind')}</span> Staurdur</a>
    <a href="${R}ayakan/creve-glace.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('snow')}</span> Crève Glace</a>
    <a href="${R}ayakan/varask.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('snow')}</span> Varask</a>
    <a href="${R}ayakan/mornea.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('ship')}</span> Mornea</a>
    <a href="${R}ayakan/thyrne.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('water')}</span> Thyrne</a>
    <a href="${R}ayakan/selvend.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('market')}</span> Selvend</a>
    <a href="${R}ayakan/frayakin.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('flame')}</span> Frayakin</a>
    <a href="${R}ayakan/solcara.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('star')}</span> Solcara</a>
    <a href="${R}ayakan/pyrael.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('gem')}</span> Pyraël</a>
    <a href="${R}ayakan/leth.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('water')}</span> Leth</a>
    <a href="${R}ayakan/faran.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('castle')}</span> Faran</a>
    <a href="${R}ayakan/chaines-verre.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('music')}</span> Chaînes de Verre</a>
  </div>
  <hr class="sidebar-divider">
  <div class="sidebar-section">
    <div class="sidebar-section-title">Musiyav</div>
    <a href="${R}musiyav/musiyav.html" class="sidebar-link"><span class="icon">${ic('globe')}</span> Musiyav</a>
    <div class="sidebar-region-label">Nord</div>
    <a href="${R}musiyav/terres-gelees.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('snow')}</span> Terres Gelées</a>
    <a href="${R}musiyav/munabenn.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('anvil')}️</span> Munabenn</a>
    <a href="${R}musiyav/creastail.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('bolt')}</span> Creastail</a>
    <a href="${R}musiyav/stasmoc.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('flame')}</span> Stasmoc</a>
    <a href="${R}musiyav/clagrayn.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('ship')}</span> Clagrayn</a>
    <a href="${R}musiyav/fedhidom.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('newmoon')}</span> Fedhidom</a>
    <a href="${R}musiyav/cricrosal.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('gem')}</span> Cricrosal</a>
    <a href="${R}musiyav/ellirhom.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('leaf')}</span> Éllirhom</a>
    <a href="${R}musiyav/sarathiil.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('wave')}</span> Sarathiil</a>
    <a href="${R}musiyav/akalima.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('ship')}</span> Akalima</a>
    <a href="${R}musiyav/yndarev.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('wind')}</span> Yndarev</a>
    <a href="${R}musiyav/sillu.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('wheat')}</span> Sillu</a>
    <a href="${R}musiyav/cairondel.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('monolith')}</span> Cairondel</a>
    <a href="${R}musiyav/gravantempe.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('mountain')}</span> Gravantempe</a>
    <a href="${R}musiyav/treufloran.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('leaf')}</span> Treufloran</a>
    <a href="${R}musiyav/valtendre.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('water')}</span> Valtendre</a>
    <div class="sidebar-region-label">Centre</div>
    <a href="${R}musiyav/murblan.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('scales')}</span> Murblan</a>
    <a href="${R}musiyav/bekai-keal.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('city')}</span> Bekai Keal</a>
    <a href="${R}musiyav/thylkarok.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('palette')}</span> Thylkarok</a>
    <a href="${R}musiyav/carroval.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('monolith')}</span> Carroval</a>
    <a href="${R}musiyav/caudherra.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('paw')}</span> Caudherra</a>
    <a href="${R}musiyav/saldromil.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('music')}</span> Saldromil</a>
    <a href="${R}musiyav/kandor-zei.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('shield')}</span> Kandor-Zeï</a>
    <a href="${R}musiyav/mirsha-lu.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('paw')}</span> Mirsha Lû</a>
    <a href="${R}musiyav/ukar-tal.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('scroll')}</span> Ukar Tal</a>
    <a href="${R}musiyav/brastelma.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('leaf')}</span> Brastelma</a>
    <a href="${R}musiyav/xalatlal.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('paw')}</span> Xalatlal</a>
    <a href="${R}musiyav/tochion.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('wave')}</span> Tochion</a>
    <a href="${R}musiyav/yabalta.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('volcano')}</span> Yabalta</a>
    <a href="${R}musiyav/solgirne.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('wheat')}</span> Solgirne</a>
    <a href="${R}musiyav/varnestal.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('swords')}</span> Varnestal</a>
    <a href="${R}musiyav/linvelar.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('tree')}</span> Linvelar</a>
    <a href="${R}musiyav/eldmire.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('fish')}</span> Eldmire</a>
    <div class="sidebar-region-label">Ouest</div>
    <a href="${R}musiyav/valacorra.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('fleur')}</span> Valacorra</a>
    <a href="${R}musiyav/aunthrevin.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('temple')}</span> Aunthrevin</a>
    <a href="${R}musiyav/vendrolis.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('mask')}</span> Vendrolis</a>
    <a href="${R}musiyav/darn-merath.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('swords')}</span> Darn Merath</a>
    <a href="${R}musiyav/dusalain.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('desert')}</span> Dusalain</a>
    <a href="${R}musiyav/gouffre-ebrion.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('pit')}</span> Gouffre d'Ébrion</a>
    <div class="sidebar-region-label">Sud</div>
    <a href="${R}musiyav/xamaris.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('forbidden')}</span> Xamaris</a>
    <a href="${R}musiyav/xakaril.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('castle')}</span> Xakaril</a>
    <a href="${R}musiyav/marolzhad.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('scales')}</span> Marolzhad</a>
    <a href="${R}musiyav/dorvenkar.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('anvil')}</span> Dorvenkar</a>
    <a href="${R}musiyav/naskarrem.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('anvil')}️</span> Naskarrem</a>
    <a href="${R}musiyav/khaelbar.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('swords')}</span> Khaëlbar</a>
    <a href="${R}musiyav/tol-vekrah.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('book')}</span> Tol Vekrah</a>
    <a href="${R}musiyav/krelsum.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('bricks')}</span> Krelsum</a>
    <a href="${R}musiyav/falstrein.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('ship')}</span> Falstrein</a>
    <a href="${R}musiyav/terres-pieuses.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('sparkle')}</span> Terres Pieuses</a>
    <a href="${R}musiyav/templum-triarii.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('temple')}</span> Templum Triarii</a>
    <a href="${R}musiyav/forge-vivante.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('flame')}</span> Forge Vivante</a>
    <a href="${R}musiyav/isvarun.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('sunrise')}</span> Isvarun</a>
    <a href="${R}musiyav/callafhar.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('book')}</span> Callafhar</a>
    <a href="${R}musiyav/auranthil.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('tree')}</span> Auranthil</a>
    <a href="${R}musiyav/elvar-tyl.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('tree')}</span> Elvarë Tyl</a>
    <a href="${R}musiyav/lunemiral.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('moon')}</span> Lunemiral</a>
    <a href="${R}musiyav/miriathael.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('leaf')}</span> Mirithaël</a>
    <a href="${R}musiyav/faelorrin.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('shield')}</span> Faelorrin</a>
    <div class="sidebar-region-label">Est</div>
    <a href="${R}musiyav/terres-sauvages.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('volcano')}</span> Terres Sauvages</a>
    <a href="${R}musiyav/kaelyth.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('swords')}</span> Viremarche</a>
    <a href="${R}musiyav/briseneige.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('snow')}</span> Briseneige</a>
    <div class="sidebar-region-label">Terres Isolées</div>
    <a href="${R}musiyav/tinneas.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('bones')}</span> Tinneas A'Bhàis</a>
    <a href="${R}musiyav/shurakai.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('mist')}</span> Shurakai</a>
    <a href="${R}musiyav/narkun.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('flame')}</span> Narkûn</a>
    <a href="${R}musiyav/uzzama.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('ruins')}</span> Uzzama</a>
    <a href="${R}musiyav/vrekh-mhor.html" class="sidebar-link sidebar-sublink sidebar-sub2link"><span class="icon">${ic('paw')}</span> Vrekh Mhor</a>
    <a href="${R}musiyav/iles-hagruk.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('rock')}</span> Îles Hagruk</a>
  </div>
  <hr class="sidebar-divider">
  <div class="sidebar-section">
    <div class="sidebar-section-title">Régions Éloignées</div>
    <a href="${R}musiyav/anneau-dieux.html" class="sidebar-link"><span class="icon">${ic('newmoon')}</span> Anneau des Dieux</a>
    <a href="${R}musiyav/archipel-ombres.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('moon')}</span> Archipel des Ombres</a>
    <a href="${R}musiyav/darnobscur.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('blood')}</span> Darnobscur</a>
  </div>
  <hr class="sidebar-divider">
  <div class="sidebar-section">
    <div class="sidebar-section-title">Personnages & Lore</div>
    <a href="${R}lore/personnages.html" class="sidebar-link"><span class="icon">${ic('hat')}</span> Personnages</a>
    <a href="${R}lore/journal-arzi.html" class="sidebar-link sidebar-sublink"><span class="icon">${ic('book')}</span> Journal d'Arzi</a>
    <a href="${R}lore/organisations.html" class="sidebar-link"><span class="icon">${ic('swords')}</span> Organisations</a>
    <a href="${R}lore/dieux.html" class="sidebar-link"><span class="icon">${ic('sparkle')}</span> Dieux & Trinités</a>
  </div>`;
  }
})();
