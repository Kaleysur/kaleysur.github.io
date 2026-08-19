/* ══ Jeu d'icônes Kaleysur ══════════════════════════════════════════════
   Trait monochrome héritant de currentColor : chaque icône prend la couleur
   du texte qui l'entoure, donc le thème courant, sans variante à maintenir.

   Inline plutôt qu'une police d'icônes : la PWA doit fonctionner hors ligne et
   la CSP interdit les ressources tierces.

   Chargé en tête de <body> sur chaque page : le sprite doit exister avant que
   quoi que ce soit ne référence #i-… , sinon les <use> pointent dans le vide.

   Utilisation :
     HTML   <svg class="ic"><use href="#i-swords"></use></svg>
     JS     ${ic('swords')}          (gabarit)
            ic('swords')             (concaténation)
   ══════════════════════════════════════════════════════════════════════ */
(function () {
  const ICONS = {
  anvil: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.4 8.6h9.2c2.6 0 4.4 1.6 6 3.4L18 13.8c-1.4-1-2.6-1.4-4.4-1.4H9.4l-1 4.4h5.2l-.8 3.6H6.6l1.6-8H4.4V8.6Z"/></g>',
  axe: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m4 20.4 8.6-8.6"/><path d="M12.6 11.8 8.4 7.6l3-3c2.6 0 5 .6 6.8 2.4S21 11.4 21 14l-3 3-4.2-4.2"/></g>',
  beast: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.6 8.2 3.4 3.8l4 2.2h9.2l4-2.2-1.2 4.4"/><path d="M4.6 8.2c0 6 3.2 10.6 7.4 12 4.2-1.4 7.4-6 7.4-12"/><path d="M9.6 11.6v.1M14.4 11.6v.1M12 15v1.4"/></g>',
  bell: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6.2 17.4c1.2-1.2 1.6-2.4 1.6-4.2v-2.4a4.2 4.2 0 0 1 8.4 0v2.4c0 1.8.4 3 1.6 4.2H6.2Z"/><path d="M10.2 17.4v.6a1.8 1.8 0 0 0 3.6 0v-.6M12 4.6V3"/></g>',
  blood: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.2c3.4 4.2 5.6 6.8 5.6 9.6a5.6 5.6 0 0 1-11.2 0c0-2.8 2.2-5.4 5.6-9.6Z"/></g>',
  bolt: '<path d="M13.4 2 4.6 13.4h6L10 22l9.4-11.9h-6.6L13.4 2Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  bones: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m7.6 16.4 8.8-8.8"/><path d="M6.4 13.6a2.4 2.4 0 1 0 1.2 4.2 2.4 2.4 0 1 0 4.2 1.2"/><path d="M17.6 10.4a2.4 2.4 0 1 0-1.2-4.2 2.4 2.4 0 1 0-4.2-1.2"/></g>',
  book: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M3.5 4.4h6a3 3 0 0 1 2.5 1.3 3 3 0 0 1 2.5-1.3h6v14h-6a3 3 0 0 0-2.5 1.3 3 3 0 0 0-2.5-1.3h-6v-14Z"/><path d="M12 5.7v13.3"/></g>',
  bow: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 3.2A14 14 0 0 1 4.5 20.8"/><path d="M4.5 3.2 20 12 4.5 20.8"/><path d="M13 12h8"/></g>',
  brain: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.6a3 3 0 0 0-5.6-1.2A3 3 0 0 0 3.8 8a3.4 3.4 0 0 0 .6 5.6 3 3 0 0 0 1.6 4.6 3 3 0 0 0 6 .4V4.6Z"/><path d="M12 4.6a3 3 0 0 1 5.6-1.2A3 3 0 0 1 20.2 8a3.4 3.4 0 0 1-.6 5.6 3 3 0 0 1-1.6 4.6 3 3 0 0 1-6 .4"/><path d="M12 19.4v1.8"/></g>',
  bricks: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.8 5.4h18.4v13.2H2.8z"/><path d="M2.8 9.8h18.4M2.8 14.2h18.4M9.4 5.4v4.4M15.6 9.8v4.4M9.4 14.2v4.4"/></g>',
  bridge: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.6 16.4h18.8"/><path d="M2.6 16.4c0-4.6 4.2-8.2 9.4-8.2s9.4 3.6 9.4 8.2"/><path d="M6.6 16.4v4.2M17.4 16.4v4.2M12 8.2v12.4"/><path d="M2.6 20.6h18.8"/></g>',
  calendar: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.6 6.4h16.8v14H3.6z"/><path d="M3.6 10.6h16.8M8.2 3.6v4M15.8 3.6v4"/><path d="M7.6 14.2v.1M12 14.2v.1M16.4 14.2v.1M7.6 17.4v.1M12 17.4v.1"/></g>',
  candle: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8.6 10.6h6.8v10H8.6z"/><path d="M12 10.6V8"/><path d="M12 3.4c1.6 1.6 2.4 2.6 2.4 3.8a2.4 2.4 0 0 1-4.8 0c0-1.2.8-2.2 2.4-3.8Z"/></g>',
  castle: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.4 20.6V7.4l2.6 1.6V5.6h2.8v2.2L12 5.6l3.2 2.2V5.6H18v3.4l2.6-1.6v13.2H3.4Z"/><path d="M10 20.6v-4.2a2 2 0 0 1 4 0v4.2"/></g>',
  chart: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.4 20.6h17.2"/><path d="M4.4 16.6 9.6 11l3.6 3.4 6.4-7.6"/><path d="M15.4 6.8h4.2V11"/></g>',
  chat: '<path d="M20.6 15.2a2 2 0 0 1-2 2H7.4L3.4 21V5.2a2 2 0 0 1 2-2h13.2a2 2 0 0 1 2 2v10Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  check: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.4 12.6 9.6 18 19.6 6.4"/></g>',
  city: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.4 20.6V10l5-3v13.6M8.4 13h4.4v7.6M12.8 20.6V6l7.8 4v10.6H3.4"/><path d="M5.8 13v.1M5.8 16.4v.1M15.6 11.6v.1M15.6 15v.1M18 11.6v.1M18 15v.1"/></g>',
  clipboard: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M8.8 4.4H6.6a1.8 1.8 0 0 0-1.8 1.8v13.4a1.8 1.8 0 0 0 1.8 1.8h10.8a1.8 1.8 0 0 0 1.8-1.8V6.2a1.8 1.8 0 0 0-1.8-1.8h-2.2"/><rect x="8.8" y="2.4" width="6.4" height="4" rx="1.2"/></g>',
  clock: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="9.2"/><path d="M12 6.6V12l3.6 2.2"/></g>',
  coin: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9.4" cy="12" r="6.6"/><path d="M14.6 6.2a6.6 6.6 0 0 1 0 11.6"/><path d="M9.4 8.8v6.4M7.4 10.4h3a1.6 1.6 0 0 1 0 3.2h-2a1.6 1.6 0 0 0 0 3.2h3"/></g>',
  crane: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.4 20.6h17.2"/><path d="M7.6 20.6V5h13"/><path d="M7.6 5 3.8 9.2h3.8"/><path d="M16.6 5v4.4"/><path d="M14.8 9.6h3.6v3.2h-3.6z"/></g>',
  crown: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.6 7.6 7 13l5-8 5 8 3.4-5.4v10.8H3.6V7.6Z"/><path d="M3.6 20.4h16.8"/></g>',
  dagger: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 9.6 13.6h4.8L12 2Z"/><path d="M7.6 15.4h8.8M12 15.4V22"/></g>',
  desert: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.6 18.4c3.4 0 4.2-6.2 7.8-6.2s4.4 6.2 7.8 6.2h3.2"/><path d="M2.6 18.4h18.8"/><circle cx="17.4" cy="7.4" r="2.8"/></g>',
  die: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 2.5 21 7.6v8.8L12 21.5 3 16.4V7.6L12 2.5Z"/><path d="M12 2.5v19M3 7.6l9 5.1 9-5.1"/></g>',
  dove: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.8 12.6c2.6 0 4.4-1.2 5.8-3.2 1.5 2 3.3 3.2 5.9 3.2"/><path d="M12.6 17.4c1.9 0 3.2-.9 4.2-2.3 1.1 1.4 2.4 2.3 4.4 2.3"/></g>',
  expand: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.6 9V3.6H9M15 3.6h5.4V9M20.4 15v5.4H15M9 20.4H3.6V15"/></g>',
  export: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15.6V3.4M8 7.2 12 3.2l4 4"/><path d="M4 14.4v4.4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4.4"/></g>',
  eye: '<g fill="none" stroke="currentColor" stroke-width="1.6"><path d="M1.8 12S5.5 5.5 12 5.5 22.2 12 22.2 12 18.5 18.5 12 18.5 1.8 12 1.8 12Z"/><circle cx="12" cy="12" r="3.1"/></g>',
  fish: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14.6 12c0 3.4-3.4 5.6-6.6 5.6-3.6 0-5.6-2.4-5.6-5.6s2-5.6 5.6-5.6c3.2 0 6.6 2.2 6.6 5.6Z"/><path d="M14.6 12c1.6 0 3.4-1.6 6.8-3.6-1 2.4-1 4.8 0 7.2-3.4-2-5.2-3.6-6.8-3.6Z"/><path d="M6 10.6v.1"/></g>',
  flag: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 20.6V3.6"/><path d="M6 4.6h12.6l-2.6 4 2.6 4H6"/></g>',
  flame: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.6c2.4 3 4.9 5 4.9 8.6a4.9 4.9 0 0 1-9.8 0c0-3.6 2.5-5.6 4.9-8.6Z"/><path d="M12 21.4a3 3 0 0 0 3-3c0-2-1.5-3-3-4.8-1.5 1.8-3 2.8-3 4.8a3 3 0 0 0 3 3Z"/></g>',
  flask: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M9.6 2.8v6.4L4.3 18a2.1 2.1 0 0 0 1.8 3.2h11.8a2.1 2.1 0 0 0 1.8-3.2l-5.3-8.8V2.8"/><path d="M8.2 2.8h7.6M6.6 14.6h10.8"/></g>',
  fleur: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 2.4c-1.9 2.6-1.9 5.1 0 7.6 1.9-2.5 1.9-5 0-7.6Z"/><path d="M12 10c-2.6-2-5.2-1.6-7 .8 2 2 4.6 2 7-.8Zm0 0c2.6-2 5.2-1.6 7 .8-2 2-4.6 2-7-.8Z"/><path d="M8.4 14.2h7.2M12 10v11.2"/></g>',
  flower: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="6.6" r="2.6"/><circle cx="17.4" cy="12" r="2.6"/><circle cx="12" cy="17.4" r="2.6"/><circle cx="6.6" cy="12" r="2.6"/></g>',
  folder: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.2 6.6h5.3l1.8 2.2h10.5v9.3a1.4 1.4 0 0 1-1.4 1.4H4.6a1.4 1.4 0 0 1-1.4-1.4V6.6Z"/></g>',
  food: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6.4 3v7.4a3 3 0 0 0 3 3h.2V21"/><path d="M6.4 3v4.8M9.6 3v4.8"/><path d="M17.6 3c-1.6 0-2.8 2-2.8 5.2 0 2.4.9 3.6 2.2 3.9V21"/></g>',
  forbidden: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/></g>',
  gate: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.4 20.6V8.6a7.6 7.6 0 0 1 15.2 0v12"/><path d="M12 20.6V9.4M4.4 14.6h15.2"/></g>',
  gear: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3.3"/><path d="m20.2 14.5-.9-.5a7.5 7.5 0 0 0 0-4l.9-.5a1.2 1.2 0 0 0 .4-1.6l-1-1.7a1.2 1.2 0 0 0-1.6-.4l-.9.5a7.5 7.5 0 0 0-3.5-2V3.1a1.2 1.2 0 0 0-1.2-1.2h-2a1.2 1.2 0 0 0-1.2 1.2v1.2a7.5 7.5 0 0 0-3.5 2l-.9-.5a1.2 1.2 0 0 0-1.6.4l-1 1.7a1.2 1.2 0 0 0 .4 1.6l.9.5a7.5 7.5 0 0 0 0 4l-.9.5a1.2 1.2 0 0 0-.4 1.6l1 1.7a1.2 1.2 0 0 0 1.6.4l.9-.5a7.5 7.5 0 0 0 3.5 2v1.2a1.2 1.2 0 0 0 1.2 1.2h2a1.2 1.2 0 0 0 1.2-1.2v-1.2a7.5 7.5 0 0 0 3.5-2l.9.5a1.2 1.2 0 0 0 1.6-.4l1-1.7a1.2 1.2 0 0 0-.4-1.6Z"/></g>',
  gem: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7.4 3.6h9.2l4.4 5.6L12 20.4 3 9.2l4.4-5.6Z"/><path d="M3 9.2h18M7.4 3.6 12 9.2l4.6-5.6M12 9.2v11.2"/></g>',
  ghost: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.6 20.6V10.6a7.4 7.4 0 0 1 14.8 0v10l-2.4-2-2.4 2-2.6-2-2.6 2-2.4-2-2.4 2Z"/><path d="M9.6 10.4v.1M14.4 10.4v.1"/></g>',
  globe: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.4 2.4 3.6 5.4 3.6 9s-1.2 6.6-3.6 9c-2.4-2.4-3.6-5.4-3.6-9s1.2-6.6 3.6-9Z"/></g>',
  goblin: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.4c4 0 6.6 2.8 6.6 6.6 0 4.4-2.8 8.6-6.6 8.6s-6.6-4.2-6.6-8.6c0-3.8 2.6-6.6 6.6-6.6Z"/><path d="M5.6 9.6 2.8 6.2l4 .8M18.4 9.6l2.8-3.4-4 .8"/><path d="M9.6 11.6v.1M14.4 11.6v.1M9.8 15.4h4.4"/></g>',
  grave: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6.6 20.4V9.4a5.4 5.4 0 0 1 10.8 0v11H6.6Z"/><path d="M4.6 20.4h14.8"/><path d="M12 7.6v6M9.6 10.2h4.8"/></g>',
  hand: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11.4V4.8a1.6 1.6 0 0 1 3.2 0v5.6"/><path d="M12.2 10.4V3.6a1.6 1.6 0 0 1 3.2 0v7"/><path d="M15.4 10.6V5.8a1.6 1.6 0 0 1 3.2 0v9c0 3.4-2.6 5.6-6 5.6-2.4 0-4-1-5.4-3l-3-4.4a1.6 1.6 0 0 1 2.4-2.1L9 13.4"/></g>',
  hat: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.6 6.6 15.4h10.8L12 2.6Z"/><path d="M3.6 15.4c0 2 3.8 3.6 8.4 3.6s8.4-1.6 8.4-3.6"/><path d="M11 8.6v.1M13 11.4v.1"/></g>',
  heart: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.4C6.4 16.2 3 13 3 9.4a4.8 4.8 0 0 1 9-2.4 4.8 4.8 0 0 1 9 2.4c0 3.6-3.4 6.8-9 11Z"/></g>',
  helmet: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.6 17.4v-4.8a7.4 7.4 0 0 1 14.8 0v4.8"/><path d="M4.6 17.4h14.8v3H4.6z"/><path d="M12 5.2v12.2"/></g>',
  home: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.4 10.6 12 3.4l8.6 7.2v10H3.4v-10Z"/><path d="M9.6 20.6v-6h4.8v6"/></g>',
  horse: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7.4 20.6v-3.6c-1.7-1.5-2.7-3.6-2.7-6C4.7 6.8 7.9 3.6 12 3.6s7.3 3.2 7.3 7.4c0 2.4-1 4.5-2.7 6v3.6"/><path d="M7.4 20.6h2.9M13.7 20.6h2.9"/></g>',
  hourglass: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6.4 3.6h11.2M6.4 20.4h11.2"/><path d="M7.4 3.6v3.2c0 2.4 4.6 3.6 4.6 5.2s-4.6 2.8-4.6 5.2v3.2M16.6 3.6v3.2c0 2.4-4.6 3.6-4.6 5.2s4.6 2.8 4.6 5.2v3.2"/></g>',
  ice: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6.6 8.2 12 5l5.4 3.2v6.6L12 18l-5.4-3.2V8.2Z"/><path d="M12 5v13M6.6 8.2l10.8 6.6M17.4 8.2 6.6 14.8"/></g>',
  image: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><rect x="3.2" y="4.4" width="17.6" height="15.2" rx="2"/><path d="m3.6 16.6 4.8-4.6 3.4 3.2 3.6-3.8 5 5.2"/><circle cx="8.6" cy="9" r="1.5"/></g>',
  install: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="6.4" y="2.6" width="11.2" height="18.8" rx="2"/><path d="M12 7v7M9 11l3 3 3-3"/></g>',
  key: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.4" cy="12" r="4"/><path d="M11.4 12h9.2M17.6 12v3.4M20.6 12v2.6"/></g>',
  leaf: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 3.5C10 3.5 4 8.4 4 15.2a5.6 5.6 0 0 0 5.6 5.6c6.8 0 10.9-6.6 10.9-17.3Z"/><path d="M3.5 20.5 12 12"/></g>',
  lens: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.6" cy="10.6" r="6.4"/><path d="m15.4 15.4 5 5"/><path d="M8.2 10.6a2.4 2.4 0 0 1 2.4-2.4"/></g>',
  lightning: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2.6 5.4 13.4h5.2L9.8 21.4l8-11.2h-5.4l.6-7.6Z"/></g>',
  link: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M10.2 13.8a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6l-1.6 1.6"/><path d="M13.8 10.2a4 4 0 0 0-5.6 0l-3 3a4 4 0 0 0 5.6 5.6l1.6-1.6"/></g>',
  lock: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><rect x="4.5" y="10.5" width="15" height="10.5" rx="1.6"/><path d="M8 10.5V7.4a4 4 0 0 1 8 0v3.1"/></g>',
  map: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5.4 3 3.6v15l6 1.8 6-1.8 6 1.8v-15l-6-1.8-6 1.8Z"/><path d="M9 5.4v15M15 3.6v15"/></g>',
  market: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.8 4.6h2.6l2.8 11.2h10.2l2.2-8H7"/><circle cx="9.6" cy="19.4" r="1.5"/><circle cx="17.4" cy="19.4" r="1.5"/></g>',
  mask: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.6 6.6c2.8-.8 5.6-1.2 8.4-1.2s5.6.4 8.4 1.2c0 6.6-3 12-8.4 12s-8.4-5.4-8.4-12Z"/><path d="M8.4 10.4a2.6 2.6 0 0 1 2.4 0M13.2 10.4a2.6 2.6 0 0 1 2.4 0M10 14.6c1.2.8 2.8.8 4 0"/></g>',
  mirror: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="9.4" rx="6.4" ry="7"/><path d="M12 16.4v4.2M9.4 20.6h5.2"/><path d="M9.4 8.4a3.6 3.6 0 0 1 3-3"/></g>',
  mist: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.4 8h11M17 8h3.6M3.4 12h5M11 12h9.6M3.4 16h9.6M16 16h4.6"/></g>',
  monolith: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8.4 20.6V6.4a3.6 3.6 0 0 1 7.2 0v14.2H8.4Z"/><path d="M10.6 10.4v.1M13.4 10.4v.1M10.8 14.6h2.4"/></g>',
  moon: '<path d="M20.5 14.4A8.6 8.6 0 0 1 9.6 3.5a8.9 8.9 0 1 0 10.9 10.9Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  'moon-first-q': '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" stroke="none"/>',
  'moon-full': '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 3a9 9 0 0 1 0 18 9 9 0 0 1 0-18Z" fill="currentColor" stroke="none"/>',
  'moon-last-q': '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 3a9 9 0 0 0 0 18Z" fill="currentColor" stroke="none"/>',
  'moon-wan-cres': '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 3a9 9 0 0 0 0 18 4.6 9 0 0 1 0-18Z" fill="currentColor" stroke="none"/>',
  'moon-wan-gib': '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 3a9 9 0 0 0 0 18 4.6 9 0 0 0 0-18Z" fill="currentColor" stroke="none"/>',
  'moon-wax-cres': '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 3a9 9 0 0 1 0 18 4.6 9 0 0 0 0-18Z" fill="currentColor" stroke="none"/>',
  'moon-wax-gib': '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 3a9 9 0 0 1 0 18 4.6 9 0 0 1 0-18Z" fill="currentColor" stroke="none"/>',
  mountain: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.6 19.6 9 7.8l4 6.6 2.2-3.4 6.2 8.6H2.6Z"/><path d="m7.2 11.2 2.4 1.6"/></g>',
  music: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9.4 18V5.4l9.2-2v12.6"/><ellipse cx="6.8" cy="18" rx="2.6" ry="2.2"/><ellipse cx="16" cy="16" rx="2.6" ry="2.2"/><path d="M9.4 9.2 18.6 7"/></g>',
  needle: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.4 3.6 9.6 14.4"/><path d="M9.6 14.4 6 21l6.6-3.6"/><ellipse cx="19" cy="5" rx="2" ry="1.4" transform="rotate(-45 19 5)"/></g>',
  newmoon: '<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.6"/>',
  orb: '<g fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="10.4" r="7.4"/><path d="M8.6 8a4.6 4.6 0 0 1 3.4-2.2" stroke-linecap="round"/><path d="M6.6 20.6h10.8" stroke-linecap="round"/></g>',
  pack: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M6 8.2h12a3 3 0 0 1 3 3v7.2a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-7.2a3 3 0 0 1 3-3Z"/><path d="M8.6 8.2V6a3.4 3.4 0 0 1 6.8 0v2.2M3 13.6h18"/></g>',
  palette: '<g fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3.2a8.8 8.8 0 0 0 0 17.6c1.2 0 1.8-.8 1.8-1.7 0-1.4-1.2-1.6-1.2-2.7 0-.9.7-1.6 1.7-1.6h1.6a4.9 4.9 0 0 0 4.9-4.9c0-3.7-3.8-6.7-8.8-6.7Z"/><circle cx="8" cy="9.4" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="7" r="1.1" fill="currentColor" stroke="none"/><circle cx="16" cy="9.4" r="1.1" fill="currentColor" stroke="none"/></g>',
  pause: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4.6v14.8M15 4.6v14.8"/></g>',
  paw: '<g fill="currentColor"><circle cx="7.6" cy="9.6" r="1.9"/><circle cx="12" cy="7.6" r="1.9"/><circle cx="16.4" cy="9.6" r="1.9"/><path d="M12 12.2c2.7 0 4.8 2.1 4.8 4.4 0 1.7-1.3 2.9-3 2.9-1.1 0-1.5-.4-1.8-.4s-.7.4-1.8.4c-1.7 0-3-1.2-3-2.9 0-2.3 2.1-4.4 4.8-4.4Z"/></g>',
  pencil: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M16.4 3.6a2.3 2.3 0 0 1 3.2 3.2L7.4 19h-3.4v-3.4L16.4 3.6Z"/><path d="m14.6 5.4 4 4"/></g>',
  people: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9.2" cy="8" r="3.4"/><path d="M2.8 20.4a6.4 6.4 0 0 1 12.8 0"/><path d="M16 5a3.4 3.4 0 0 1 0 6.6M17.4 14.6a6.4 6.4 0 0 1 3.8 5.8"/></g>',
  pin: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c4.4-5.4 6.6-9 6.6-11.6a6.6 6.6 0 1 0-13.2 0C5.4 12 7.6 15.6 12 21Z"/><circle cx="12" cy="9.4" r="2.4"/></g>',
  pit: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="8.6" rx="8.4" ry="3.4"/><path d="M3.6 8.6c0 5.6 2.6 12 8.4 12s8.4-6.4 8.4-12"/></g>',
  refresh: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20.4 12a8.4 8.4 0 1 1-2.6-6"/><path d="M20.4 3.6V9h-5.4"/></g>',
  rock: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.4 13.6 8.8 6.6h6.6l4.2 7-4.6 6.8H8.8L4.4 13.6Z"/><path d="m8.8 6.6 2.6 7-2.6 6.8M11.4 13.6h8.2"/></g>',
  ruins: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.4 20.6V9.6l3.4-2.2V4.6l3 2V20.6M9.8 12.4h4.4v3M14.2 20.6v-9l3-2v3l3.4 2.2v6.2"/><path d="M2.6 20.6h18.8"/></g>',
  save: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M4.4 3.6h11.3L20.4 8.3v12.1H4.4V3.6Z"/><path d="M8 3.6v5.6h7V3.6M8 20.4v-5.9h8v5.9"/></g>',
  scales: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.6v16.8M7.4 20.4h9.2M4.6 6.6h14.8"/><path d="M4.6 6.6 1.8 13a3 3 0 0 0 5.6 0L4.6 6.6ZM19.4 6.6 16.6 13a3 3 0 0 0 5.6 0l-2.8-6.4Z"/></g>',
  scroll: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M6.4 3.4h11.2a2.4 2.4 0 0 1 2.4 2.4v12.8a2.4 2.4 0 0 1-2.4 2.4H6.4"/><path d="M6.4 3.4A2.4 2.4 0 0 0 4 5.8v1.8h3.2M6.4 21a2.4 2.4 0 0 0 2.4-2.4v-1.8H5.6"/><path d="M9.6 8.4h7.2M9.6 12h7.2"/></g>',
  search: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="10.6" cy="10.6" r="6.6"/><path d="m15.4 15.4 4.6 4.6"/></g>',
  seed: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.6v-7.4"/><path d="M12 13.2c0-4 2.8-7 7-7.4.4 4.4-2.6 7.4-7 7.4Z"/><path d="M12 16.4c-3.2 0-5.4-2.2-5.6-5.4 3.2.2 5.4 2.2 5.6 5.4Z"/></g>',
  shield: '<path d="M12 2.6 4.5 5.6v6.1c0 4.4 3.1 8.3 7.5 9.7 4.4-1.4 7.5-5.3 7.5-9.7V5.6L12 2.6Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  ship: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.4h16l-2.6 6H6.6L4 14.4Z"/><path d="M6.6 14.4V8.6l5.4-5 5.4 5v5.8"/><path d="M12 3.6v10.8"/></g>',
  skull: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 2.6c-4.7 0-8 3.3-8 7.7 0 2.7 1.3 4.5 2.7 5.6v3a1.4 1.4 0 0 0 1.4 1.4h7.8a1.4 1.4 0 0 0 1.4-1.4v-3c1.4-1.1 2.7-2.9 2.7-5.6 0-4.4-3.3-7.7-8-7.7Z"/><circle cx="9" cy="11" r="1.7"/><circle cx="15" cy="11" r="1.7"/></g>',
  smile: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8.6 14.4a4.4 4.4 0 0 0 6.8 0"/><path d="M9.4 9.6v.1M14.6 9.6v.1"/></g>',
  snow: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.4v19.2M3.7 7.2l16.6 9.6M20.3 7.2 3.7 16.8"/><path d="M12 6.2 9.7 4M12 6.2 14.3 4M12 17.8l-2.3 2.2M12 17.8l2.3 2.2M7.1 9.1l-3-.6M7.1 9.1l-.8-3M16.9 14.9l3 .6M16.9 14.9l.8 3M16.9 9.1l3-.6M16.9 9.1l.8-3M7.1 14.9l-3 .6M7.1 14.9l-.8 3"/></g>',
  sparkle: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.4l1.8 4.8 4.8 1.8-4.8 1.8L12 16.6l-1.8-4.8-4.8-1.8 4.8-1.8L12 3.4Z"/><path d="M18.4 15.6l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7.7-1.9Z"/></g>',
  star: '<path d="m12 2.8 2.9 6.1 6.6.9-4.8 4.7 1.2 6.7L12 18l-5.9 3.2 1.2-6.7-4.8-4.7 6.6-.9L12 2.8Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  status: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M7.2 12h2.3l1.5-3.4 2.1 6.5 1.4-3.1h2.3"/></g>',
  sun: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.4v2.2M12 19.4v2.2M2.4 12h2.2M19.4 12h2.2M5.2 5.2l1.6 1.6M17.2 17.2l1.6 1.6M18.8 5.2l-1.6 1.6M6.8 17.2l-1.6 1.6"/></g>',
  sunrise: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.6 20.4h18.8"/><path d="M6.6 16.4a5.4 5.4 0 0 1 10.8 0"/><path d="M12 4v2.6M5.2 7.2l1.8 1.8M18.8 7.2 17 9M2.8 13.4h2.4M18.8 13.4h2.4"/></g>',
  swords: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h3.2l9 9-3.2 3.2-9-9V3Z"/><path d="M21 3h-3.2l-9 9 3.2 3.2 9-9V3Z"/><path d="M5.5 18.5 8 21M18.5 18.5 16 21"/></g>',
  target: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.4"/><circle cx="12" cy="12" r="4.2"/></g><circle cx="12" cy="12" r="1.2" fill="currentColor"/>',
  temple: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.8 9 12 3.6 21.2 9H2.8Z"/><path d="M5.2 9v9M9.4 9v9M14.6 9v9M18.8 9v9"/><path d="M3.4 18h17.2v2.6H3.4z"/></g>',
  tent: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.6 3.6 20.4h16.8L12 3.6Z"/><path d="M12 3.6v16.8"/><path d="M9.4 20.4c0-2.5 1.1-4.4 2.6-4.4s2.6 1.9 2.6 4.4"/></g>',
  torch: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10.4 12.6h3.2v8.2h-3.2z"/><path d="M12 12.6c2.6 0 4.2-1.8 4.2-4 0-2.6-1.8-4-4.2-6.2C9.6 4.6 7.8 6 7.8 8.6c0 2.2 1.6 4 4.2 4Z"/></g>',
  tower: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7.4 20.6V7.4l4.6-3.8 4.6 3.8v13.2"/><path d="M7.4 7.4h9.2M12 12v.1M12 15.4v.1"/><path d="M5.6 20.6h12.8"/></g>',
  trash: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 6.2h17M9 6.2V4.4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1.8"/><path d="M5.6 6.2 6.6 20a1.6 1.6 0 0 0 1.6 1.5h7.6a1.6 1.6 0 0 0 1.6-1.5l1-13.8"/><path d="M10.3 10.4v6.6M13.7 10.4v6.6"/></g>',
  tree: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21.4v-5"/><path d="M12 2.6 6.4 11h3.2l-4 6h12.8l-4-6h3.2L12 2.6Z"/></g>',
  unlock: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><rect x="4.5" y="10.5" width="15" height="10.5" rx="1.6"/><path d="M8 10.5V7.4a4 4 0 0 1 7.6-1.7"/></g>',
  user: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.7"/><path d="M4.9 20.2a7.1 7.1 0 0 1 14.2 0"/></g>',
  volcano: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9.4 10.6 2.6 20.8h18.8l-6.8-10.2Z"/><path d="M9.4 10.6h5.2"/><path d="M12 7.6V3.4M8.6 8 6.9 5M15.4 8 17.1 5"/></g>',
  warn: '<path d="M12 4 2.5 20.5h19L12 4Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 10v4.5M12 17.6v.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  water: '<path d="M12 2.8s6.4 7 6.4 11.2a6.4 6.4 0 1 1-12.8 0C5.6 9.8 12 2.8 12 2.8Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>',
  wave: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.4 9.2c1.9 0 1.9-2 3.8-2s1.9 2 3.9 2 1.9-2 3.9-2 1.9 2 3.9 2 1.9-2 3.8-2"/><path d="M2.4 14c1.9 0 1.9-2 3.8-2s1.9 2 3.9 2 1.9-2 3.9-2 1.9 2 3.9 2 1.9-2 3.8-2"/><path d="M2.4 18.8c1.9 0 1.9-2 3.8-2s1.9 2 3.9 2 1.9-2 3.9-2 1.9 2 3.9 2 1.9-2 3.8-2"/></g>',
  wheat: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21.4V9"/><path d="M12 9c0-2.2-1.2-3.6-3.4-3.6C8.6 7.6 9.8 9 12 9ZM12 9c0-2.2 1.2-3.6 3.4-3.6C15.4 7.6 14.2 9 12 9ZM12 14.2c0-2.2-1.2-3.6-3.4-3.6 0 2.2 1.2 3.6 3.4 3.6ZM12 14.2c0-2.2 1.2-3.6 3.4-3.6 0 2.2-1.2 3.6-3.4 3.6ZM12 5.6c0-1.6.8-2.8 2-3.2.4 1.8-.4 3-2 3.2Z"/></g>',
  wind: '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.4 8.6h9.2a2.8 2.8 0 1 0-2.8-2.8"/><path d="M3.4 13h13a2.8 2.8 0 1 1-2.8 2.8"/><path d="M3.4 17.6h6.8"/></g>',
  };

  /* Le style accompagne le sprite : une page qui charge ce fichier n'a rien
     d'autre a declarer. Une regle deja presente dans la feuille de la page
     l'emporte, elle vient apres dans la cascade. */
  const STYLE = '<style>.ic{width:1em;height:1em;vertical-align:-0.14em;flex-shrink:0}'
    + '.ic-lg{width:1.25em;height:1.25em}</style>';

  const SPRITE = '<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">'
    + Object.keys(ICONS).map(n => '<symbol id="i-' + n + '" viewBox="0 0 24 24">' + ICONS[n] + '</symbol>').join('')
    + '</svg>';

  /* Injection synchrone à l'emplacement du script. document.body n'existe pas
     encore si le script est en tête de <body> — d'où insertAdjacentHTML sur le
     script lui-même plutôt qu'un appendChild sur le body. */
  const self = document.currentScript;
  if (self) self.insertAdjacentHTML('afterend', SPRITE);
  else document.addEventListener('DOMContentLoaded', () =>
    document.body.insertAdjacentHTML('afterbegin', SPRITE));
  document.head.insertAdjacentHTML('beforeend', STYLE);

  /* Un nom inconnu produirait un <use> muet, invisible à la relecture : on le
     signale en console plutôt que de laisser un trou dans l'interface. */
  window.ic = function (nom, cls) {
    if (!ICONS[nom]) console.warn('ic(): icône inconnue —', nom);
    return '<svg class="ic' + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#i-' + nom + '"></use></svg>';
  };
  window.ICON_NAMES = Object.keys(ICONS);
})();
