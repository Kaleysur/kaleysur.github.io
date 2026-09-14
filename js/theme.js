/* ════════════════════════════════════════════════════════════
   KALEYSUR — Thème du site

   La couleur d'accent choisie sur la fiche de personnage s'applique à tout
   le site. Ce fichier tient la dérivation complète : une teinte d'accent
   entre, toute la palette sort — fonds, bordures, texte.

   Il est chargé dans le <head> de chaque page, AVANT la feuille de style,
   pour que la couleur soit posée dès le premier pixel. Un chargement en fin
   de page ferait clignoter l'or par défaut à chaque navigation.

   Les valeurs par défaut restent dans css/style.css : sans thème enregistré,
   ou si ce script échoue, le site garde son or d'origine.
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const CLE = 'kaleysur_theme';

  function hexToHsl(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255,
        g = parseInt(hex.slice(3, 5), 16) / 255,
        b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }

  function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12,
          a = s * Math.min(l, 1 - l),
          f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const t = x => Math.round(255 * x).toString(16).padStart(2, '0');
    return '#' + t(f(0)) + t(f(8)) + t(f(4));
  }

  /* ── Rampe de texte ──
     Les fonds descendent à 3,5 % de clarté : sous ~50 %, un texte y disparaît.
     On garde la teinte du thème mais la clarté a un plancher. `gold` ne fait
     que RELEVER : un accent déjà clair n'est pas terni. */
  function rampeTexte(accent) {
    const [h, s, l] = hexToHsl(accent);
    return {
      text:  hslToHex(h, Math.min(s * 0.22, 18), 88),
      dim:   hslToHex(h, Math.min(s * 0.20, 14), 64),
      label: hslToHex(h, Math.min(s * 0.20, 14), 55),
      muted: hslToHex(h, Math.min(s * 0.20, 14), 50),
      gold:  hslToHex(h, Math.min(s, 70), Math.max(l, 62)),
    };
  }

  /* ── Palette complète ──
     Couvre les variables des deux feuilles : celles du wiki (css/style.css)
     et celles de la fiche (joueurs.html). Une seule source pour les deux,
     sinon les pages se désynchronisent au premier ajout. */
  function paletteTheme(accent, accentSombre) {
    const [h, s, l] = hexToHsl(accent);
    const sat = Math.min(s * 0.65, 40);          // fonds : teintés, jamais criards
    const satBord = Math.min(s * 0.7, 52);
    const r = rampeTexte(accent);
    const [ar, ag, ab] = [1, 3, 5].map(i => parseInt(accent.slice(i, i + 2), 16));

    return {
      '--gold': accent,
      '--gold-dark': accentSombre || hslToHex(h, Math.min(s, 70), Math.max(l - 20, 14)),
      '--gold-light': hslToHex(h, Math.min(s, 75), Math.max(l + 14, 72)),
      '--gold-text': r.gold,

      '--bg-primary':   hslToHex(h, sat, 3.5),
      '--bg-secondary': hslToHex(h, sat, 6),
      '--bg-card':      hslToHex(h, sat + 4, 8.5),
      '--bg-card-hover': hslToHex(h, sat + 4, 12),
      '--bg-nav':       hslToHex(h, sat * 0.7, 2.5),

      '--border':       hslToHex(h, satBord, 20),
      '--border-light': hslToHex(h, satBord, 30),

      '--parchment':     hslToHex(h, Math.min(s * 0.3, 26), 82),
      '--parchment-dim': hslToHex(h, Math.min(s * 0.25, 20), 62),

      '--text-primary':   r.text,
      '--text-secondary': r.dim,
      // #6e5530 à l'origine : 2,5:1, sous le seuil. La rampe le remonte.
      '--text-muted':     r.muted,
      '--glow-gold': `rgba(${ar},${ag},${ab},0.15)`,

      /* Variables propres à la fiche de personnage */
      '--j-panel':      hslToHex(h, sat + 4, 8.5),
      '--j-input':      hslToHex(h, sat * 0.8, 5),
      '--j-border-col': hslToHex(h, satBord, 20),
      '--j-text':       r.text,
      '--text-dim':     r.dim,
      '--text-label':   r.label,
    };
  }

  function appliquerPalette(accent, accentSombre, racine) {
    const cible = (racine || document.documentElement).style;
    const p = paletteTheme(accent, accentSombre);
    for (const nom in p) cible.setProperty(nom, p[nom]);
    return p;
  }

  /* Lecture du thème enregistré. La fiche de personnage y écrit
     { gold, dark } à chaque changement de couleur. */
  function themeEnregistre() {
    try {
      const brut = localStorage.getItem(CLE);
      if (!brut) return null;
      const t = JSON.parse(brut);
      if (t && typeof t.gold === 'string' && /^#[0-9a-f]{6}$/i.test(t.gold)) return t;
    } catch (_e) {}
    return null;
  }

  window.KaleysurTheme = { hexToHsl, hslToHex, rampeTexte, paletteTheme, appliquerPalette, themeEnregistre, CLE };

  // Application immédiate : on est dans le <head>, avant le premier pixel.
  const t = themeEnregistre();
  if (t) { try { appliquerPalette(t.gold, t.dark); } catch (_e) {} }
})();
