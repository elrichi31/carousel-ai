// Central theme definitions — imported by editor-panel, slide-renderer, etc.

export const colorThemes = {
  green:   { label: 'Green',   primary: 'oklch(0.55 0.12 145)' },
  blue:    { label: 'Blue',    primary: 'oklch(0.55 0.18 220)' },
  purple:  { label: 'Purple',  primary: 'oklch(0.60 0.18 290)' },
  orange:  { label: 'Orange',  primary: 'oklch(0.65 0.18 40)'  },
  red:     { label: 'Red',     primary: 'oklch(0.58 0.22 25)'  },
  pink:    { label: 'Pink',    primary: 'oklch(0.65 0.20 350)' },
  teal:    { label: 'Teal',    primary: 'oklch(0.60 0.14 185)' },
  yellow:  { label: 'Yellow',  primary: 'oklch(0.78 0.18 90)'  },
} as const

export type ColorThemeId = keyof typeof colorThemes

// Custom color stored as a hex/oklch string not in the preset list
export const CUSTOM_COLOR_ID = '__custom__' as const

export const fontThemes = {
  geist:    { label: 'Geist Sans',    family: 'var(--font-geist)'      },
  playfair: { label: 'Playfair',      family: 'var(--font-playfair)'   },
  space:    { label: 'Space Grotesk', family: 'var(--font-space)'      },
  sora:     { label: 'Sora',          family: 'var(--font-sora)'       },
  mono:     { label: 'Monospace',     family: 'var(--font-geist-mono)' },
} as const

export type FontThemeId = keyof typeof fontThemes
