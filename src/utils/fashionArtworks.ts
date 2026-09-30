export interface LookbookTheme {
  bgPrimary: string;
  bgSecondary: string;
  garmentPrimary: string;
  garmentSecondary: string;
  dupattaColor: string;
  accentGold: string;
  garmentStyle: 'pakistani-suit' | 'coord-set' | 'daily-kurti' | 'party-sharara' | 'bridal-lehenga';
  title: string;
  subtitle: string;
  angle?: 'front' | 'detail' | 'drape';
}

export function createFashionLookbookSvg(theme: LookbookTheme): string {
  const angle = theme.angle || 'front';
  let centerComposition = '';

  if (angle === 'detail') {
    centerComposition = `
      <rect x="75" y="110" width="450" height="580" rx="18" fill="${theme.garmentPrimary}" stroke="${theme.accentGold}" stroke-width="1.5" stroke-opacity="0.6"/>
      <pattern id="weave" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 0 10 L 20 10 M 10 0 L 10 20" stroke="${theme.accentGold}" stroke-width="0.4" stroke-opacity="0.22"/>
      </pattern>
      <rect x="75" y="110" width="450" height="580" rx="18" fill="url(#weave)" />
      <g transform="translate(300, 350)" stroke="${theme.accentGold}" fill="none">
        <circle cx="0" cy="0" r="145" stroke-width="1.5" stroke-dasharray="6 4" opacity="0.75"/>
        <circle cx="0" cy="0" r="115" stroke-width="2" opacity="0.9"/>
        <circle cx="0" cy="0" r="78" stroke-width="1" opacity="0.65"/>
        <path d="M 0 -115 L 28 -28 L 115 0 L 28 28 L 0 115 L -28 28 L -115 0 L -28 -28 Z" stroke-width="1.8" fill="${theme.garmentSecondary}" fill-opacity="0.45"/>
        <path d="M -80 -80 L 80 80 M 80 -80 L -80 80" stroke-width="1" opacity="0.5"/>
        <circle cx="0" cy="0" r="24" fill="${theme.accentGold}" fill-opacity="0.3" stroke-width="2"/>
        <circle cx="0" cy="-95" r="5" fill="${theme.accentGold}"/>
        <circle cx="0" cy="95" r="5" fill="${theme.accentGold}"/>
        <circle cx="-95" cy="0" r="5" fill="${theme.accentGold}"/>
        <circle cx="95" cy="0" r="5" fill="${theme.accentGold}"/>
      </g>
      <rect x="75" y="610" width="450" height="55" fill="${theme.accentGold}" fill-opacity="0.18"/>
      <line x1="75" y1="610" x2="525" y2="610" stroke="${theme.accentGold}" stroke-width="2"/>
      <line x1="75" y1="665" x2="525" y2="665" stroke="${theme.accentGold}" stroke-width="2"/>
    `;
  } else if (angle === 'drape') {
    centerComposition = `
      <g transform="translate(300, 410)">
        <path d="M -170 -210 C -60 -250, 110 -190, 175 -90 C 210 20, 150 180, 190 270 L -140 270 C -180 150, -130 -40, -170 -210 Z" fill="${theme.garmentPrimary}" stroke="${theme.accentGold}" stroke-width="1.8"/>
        <path d="M -120 -180 C -10 -210, 140 -140, 155 10 C 170 130, 90 220, 130 270 L -90 270 Z" fill="${theme.dupattaColor}" fill-opacity="0.68" stroke="${theme.accentGold}" stroke-width="1.2"/>
        <path d="M -140 245 Q -115 230, -90 245 T -40 245 T 10 245 T 60 245 T 110 245 T 160 245" fill="none" stroke="${theme.accentGold}" stroke-width="2.5"/>
        <circle cx="-40" cy="-90" r="4" fill="${theme.accentGold}" opacity="0.85"/>
        <circle cx="35" cy="-50" r="4.5" fill="${theme.accentGold}" opacity="0.85"/>
        <circle cx="-65" cy="10" r="3.5" fill="${theme.accentGold}" opacity="0.85"/>
        <circle cx="55" cy="40" r="4" fill="${theme.accentGold}" opacity="0.85"/>
        <circle cx="-10" cy="95" r="4.5" fill="${theme.accentGold}" opacity="0.85"/>
        <circle cx="70" cy="145" r="3.5" fill="${theme.accentGold}" opacity="0.85"/>
      </g>
    `;
  } else {
    if (theme.garmentStyle === 'bridal-lehenga') {
      centerComposition = `
        <g transform="translate(300, 400)">
          <circle cx="0" cy="-145" r="92" fill="${theme.accentGold}" fill-opacity="0.08" stroke="${theme.accentGold}" stroke-width="1" stroke-opacity="0.4"/>
          <path d="M -48 -175 L -24 -195 L 0 -180 L 24 -195 L 48 -175 L 68 -110 L 42 -100 L 36 -65 L -36 -65 L -42 -100 L -68 -110 Z" fill="${theme.garmentPrimary}" stroke="${theme.accentGold}" stroke-width="1.8"/>
          <path d="M -22 -192 Q 0 -155, 22 -192" fill="none" stroke="${theme.accentGold}" stroke-width="2.5"/>
          <path d="M -30 -175 Q 0 -135, 30 -175" fill="none" stroke="${theme.accentGold}" stroke-width="1.2" stroke-dasharray="3 2"/>
          <path d="M -38 -52 L 38 -52 L 155 245 L -155 245 Z" fill="${theme.garmentPrimary}" stroke="${theme.accentGold}" stroke-width="2"/>
          <line x1="-22" y1="-52" x2="-95" y2="245" stroke="${theme.accentGold}" stroke-width="1" stroke-opacity="0.55"/>
          <line x1="-7" y1="-52" x2="-35" y2="245" stroke="${theme.accentGold}" stroke-width="1" stroke-opacity="0.55"/>
          <line x1="7" y1="-52" x2="35" y2="245" stroke="${theme.accentGold}" stroke-width="1" stroke-opacity="0.55"/>
          <line x1="22" y1="-52" x2="95" y2="245" stroke="${theme.accentGold}" stroke-width="1" stroke-opacity="0.55"/>
          <path d="M -142 195 L 142 195 L 155 245 L -155 245 Z" fill="${theme.accentGold}" fill-opacity="0.28" stroke="${theme.accentGold}" stroke-width="1.8"/>
          <path d="M 46 -175 C 125 -150, 165 -20, 130 155 L 65 130 C 85 5, 65 -90, -36 -65 Z" fill="${theme.dupattaColor}" fill-opacity="0.48" stroke="${theme.accentGold}" stroke-width="1.4"/>
        </g>
      `;
    } else if (theme.garmentStyle === 'coord-set') {
      centerComposition = `
        <g transform="translate(300, 400)">
          <path d="M -52 15 L 52 15 L 78 245 L 12 245 L 0 85 L -12 245 L -78 245 Z" fill="${theme.garmentSecondary}" stroke="${theme.accentGold}" stroke-width="1.6"/>
          <line x1="-76" y1="228" x2="-13" y2="228" stroke="${theme.accentGold}" stroke-width="2.5"/>
          <line x1="13" y1="228" x2="76" y2="228" stroke="${theme.accentGold}" stroke-width="2.5"/>
          <path d="M -50 -185 L -22 -200 L 0 -185 L 22 -200 L 50 -185 L 92 -45 L 64 -35 L 46 -115 L 58 45 L -58 75 L -46 -115 L -64 -35 L -92 -45 Z" fill="${theme.garmentPrimary}" stroke="${theme.accentGold}" stroke-width="1.8"/>
          <line x1="0" y1="-185" x2="0" y2="-45" stroke="${theme.accentGold}" stroke-width="2.2"/>
          <circle cx="24" cy="-95" r="18" fill="none" stroke="${theme.accentGold}" stroke-width="1.3"/>
          <circle cx="24" cy="-95" r="5" fill="${theme.accentGold}"/>
        </g>
      `;
    } else if (theme.garmentStyle === 'party-sharara') {
      centerComposition = `
        <g transform="translate(300, 400)">
          <path d="M -55 40 L 55 40 L 130 245 L 12 245 L 0 110 L -12 245 L -130 245 Z" fill="${theme.garmentSecondary}" stroke="${theme.accentGold}" stroke-width="1.6"/>
          <line x1="-88" y1="135" x2="88" y2="135" stroke="${theme.accentGold}" stroke-width="1.8" stroke-dasharray="5 3"/>
          <path d="M -48 -185 L -20 -200 L 0 -182 L 20 -200 L 48 -185 L 82 -60 L 56 -50 L 42 -120 L 85 75 L -85 75 L -42 -120 L -56 -50 L -82 -60 Z" fill="${theme.garmentPrimary}" stroke="${theme.accentGold}" stroke-width="2"/>
          <path d="M -32 -192 L 0 -125 L 32 -192" fill="none" stroke="${theme.accentGold}" stroke-width="2"/>
          <path d="M -82 55 L 82 55" stroke="${theme.accentGold}" stroke-width="4"/>
          <path d="M -55 -185 C -115 -110, -125 40, -98 185 L -65 175 C -82 45, -75 -85, -35 -180 Z" fill="${theme.dupattaColor}" fill-opacity="0.55" stroke="${theme.accentGold}" stroke-width="1.3"/>
        </g>
      `;
    } else {
      centerComposition = `
        <g transform="translate(300, 400)">
          <path d="M -42 145 L -14 145 L -18 248 L -46 248 Z" fill="${theme.garmentSecondary}" stroke="${theme.accentGold}" stroke-width="1.4"/>
          <path d="M 14 145 L 42 145 L 46 248 L 18 248 Z" fill="${theme.garmentSecondary}" stroke="${theme.accentGold}" stroke-width="1.4"/>
          <path d="M -48 -190 L -22 -204 L 0 -188 L 22 -204 L 48 -190 L 104 -35 L 68 -22 L 48 -115 L 68 165 L -68 165 L -48 -115 L -68 -22 L -104 -35 Z" fill="${theme.garmentPrimary}" stroke="${theme.accentGold}" stroke-width="2"/>
          <path d="M -24 -198 L -24 -105 L 0 -82 L 24 -105 L 24 -198" fill="${theme.accentGold}" fill-opacity="0.18" stroke="${theme.accentGold}" stroke-width="1.8"/>
          <rect x="-66" y="122" width="132" height="42" fill="${theme.accentGold}" fill-opacity="0.24"/>
          <line x1="-66" y1="122" x2="66" y2="122" stroke="${theme.accentGold}" stroke-width="1.8"/>
          <path d="M 38 -192 C 110 -150, 130 20, 108 205 L 55 195 C 72 30, 58 -90, -35 -140 Z" fill="${theme.dupattaColor}" fill-opacity="0.52" stroke="${theme.accentGold}" stroke-width="1.4"/>
        </g>
      `;
    }
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" fill="none">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${theme.bgPrimary}" />
        <stop offset="100%" stop-color="${theme.bgSecondary}" />
      </linearGradient>
      <radialGradient id="studioGlow" cx="50%" cy="42%" r="55%">
        <stop offset="0%" stop-color="${theme.accentGold}" stop-opacity="0.22" />
        <stop offset="100%" stop-color="${theme.bgPrimary}" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="600" height="800" fill="url(#bgGrad)" />
    <rect width="600" height="800" fill="url(#studioGlow)" />
    <path d="M 48 750 L 48 215 C 48 115, 175 52, 300 28 C 425 52, 552 115, 552 215 L 552 750 Z" stroke="${theme.accentGold}" stroke-opacity="0.35" stroke-width="1.5" fill="none"/>
    <circle cx="300" cy="44" r="3.5" fill="${theme.accentGold}" opacity="0.7" />
    ${centerComposition}
    <line x1="140" y1="692" x2="460" y2="692" stroke="${theme.accentGold}" stroke-opacity="0.4" stroke-width="1" />
    <text x="300" y="720" text-anchor="middle" fill="#F7F3EB" fill-opacity="0.88" font-family="Georgia, 'Playfair Display', serif" font-size="16" letter-spacing="3">${escapeXml(theme.title.toUpperCase())}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export function createProductGallerySet(theme: Omit<LookbookTheme, 'angle'>): string[] {
  return [
    createFashionLookbookSvg({ ...theme, angle: 'front' }),
    createFashionLookbookSvg({ ...theme, angle: 'detail', title: `${theme.title} · Zari Detail` }),
    createFashionLookbookSvg({ ...theme, angle: 'drape', title: `${theme.title} · Dupatta Drape` }),
  ];
}
