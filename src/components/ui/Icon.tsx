import type { CSSProperties, ReactElement } from 'react'

/**
 * PixelDeck icon set — a single inline-SVG sprite for the whole UI.
 *
 * Why hand-rolled instead of an icon package: the editor ships as a static SPA
 * (and as a desktop/Android shell), so an extra runtime dependency for ~80
 * glyphs is not worth the bundle. Every icon below is a 24×24 stroke drawing on
 * the same grid, so they stay optically consistent at the 11–16px sizes the
 * panels use.
 *
 * Rules for adding one:
 *  - 24×24 viewBox, `currentColor` stroke, no hard-coded colors.
 *  - Draw with `<path>` primitives only (plus circle/rect/ellipse) so the
 *    `strokeWidth` prop scales the whole icon uniformly.
 *  - Solid shapes (dots, badges) go in SOLID_ICONS so they render filled.
 */

const ICONS = {
  // ── Chrome / navigation ──────────────────────────────────────────────────
  close: <path d="M18 6 6 18M6 6l12 12" />,
  check: <path d="M20 6 9 17l-5-5" />,
  plus: <path d="M5 12h14M12 5v14" />,
  minus: <path d="M5 12h14" />,
  'chevron-up': <path d="m18 15-6-6-6 6" />,
  'chevron-down': <path d="m6 9 6 6 6-6" />,
  'chevron-left': <path d="m15 18-6-6 6-6" />,
  'chevron-right': <path d="m9 18 6-6-6-6" />,
  'arrow-up': <path d="M12 19V5m-7 7 7-7 7 7" />,
  'arrow-down': <path d="M12 5v14m7-7-7 7-7-7" />,
  'arrow-left': <path d="M19 12H5m7 7-7-7 7-7" />,
  'arrow-right': <path d="M5 12h14m-7-7 7 7-7 7" />,
  'corner-down-left': <path d="M20 4v7a4 4 0 0 1-4 4H4m5-5-5 5 5 5" />,
  'more-horizontal': (
    <>
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </>
  ),
  'more-vertical': (
    <>
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </>
  ),
  grip: (
    <>
      <circle cx="9" cy="6" r="1" />
      <circle cx="15" cy="6" r="1" />
      <circle cx="9" cy="12" r="1" />
      <circle cx="15" cy="12" r="1" />
      <circle cx="9" cy="18" r="1" />
      <circle cx="15" cy="18" r="1" />
    </>
  ),
  dot: <circle cx="12" cy="12" r="5" />,
  bullet: <circle cx="12" cy="12" r="3" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.35-4.35" />
    </>
  ),
  play: <path d="m6 3 14 9-14 9z" />,
  maximize: <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3" />,
  hand: (
    <path d="M18 11V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v2m0 4.5V6a2 2 0 0 0-4 0v8m12-6a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
  ),

  // ── Actions ──────────────────────────────────────────────────────────────
  undo: <path d="M9 14 4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />,
  redo: <path d="m15 14 5-5-5-5m5 5H9.5a5.5 5.5 0 0 0 0 11H13" />,
  'rotate-ccw': <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5" />,
  'rotate-cw': <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8m0-5v5h-5" />,
  refresh: <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8m0-5v5h-5m5 4a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16m5 0H3v5" />,
  trash: <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m-6 5v6m4-6v6" />,
  pencil: <path d="M17.5 3.5a2.12 2.12 0 0 1 3 3L7.5 19.5 3 21l1.5-4.5zM15 5l4 4" />,
  eraser: <path d="m7 21-4.3-4.3a1 1 0 0 1 0-1.4L13.6 4.4a2 2 0 0 1 2.8 0l4.2 4.2a2 2 0 0 1 0 2.8L11 21zM22 21H7m-1.5-8.5 5 5" />,
  copy: (
    <>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </>
  ),
  download: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5m-5 5V3" />,
  upload: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5m5-5v12" />,
  save: (
    <>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2" />
      <path d="M17 21v-8H7v8M7 3v5h8" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6 1.65 1.65 0 0 0 10 3.09V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1" />
    </>
  ),
  sparkles: (
    <path d="M12 3l1.7 4.9L18.6 9.6l-4.9 1.7L12 16.2l-1.7-4.9L5.4 9.6l4.9-1.7zM19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7zM5 16l.5 1.5L7 18l-1.5.5L5 20l-.5-1.5L3 18l1.5-.5z" />
  ),
  spinner: <path d="M12 2v4m0 12v4M2 12h4m12 0h4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" />,
  eye: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  'eye-off': <path d="M10.7 5.2A9.6 9.6 0 0 1 12 5c6.4 0 10 7 10 7a18 18 0 0 1-2.1 3M6.3 6.8A17.6 17.6 0 0 0 2 12s3.6 7 10 7a9.9 9.9 0 0 0 4.3-.95M14.1 14.1a3 3 0 1 1-4.2-4.2M3 3l18 18" />,
  lock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  unlock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 7.9-.9" />
    </>
  ),
  'alert-triangle': <path d="M10.3 4 2.4 18a2 2 0 0 0 1.7 3h15.8a2 2 0 0 0 1.7-3L13.7 4a2 2 0 0 0-3.4 0zM12 9v4m0 4h.01" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5m0-9h.01" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
    </>
  ),

  // ── Layer types ──────────────────────────────────────────────────────────
  phone: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="2.5" />
      <path d="M11 18h2" />
    </>
  ),
  text: <path d="M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2M12 4v16m-3 0h6" />,
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="1.6" />
      <path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21" />
    </>
  ),
  shape: <rect x="3" y="3" width="18" height="18" rx="2.5" />,
  emoji: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M8.5 14.5s1.3 1.8 3.5 1.8 3.5-1.8 3.5-1.8M9.3 9.3h.01M14.7 9.3h.01" />
    </>
  ),
  brand: (
    <>
      <path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z" />
      <circle cx="7.3" cy="7.3" r="1.1" />
    </>
  ),
  chip: <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z" />,
  group: (
    <>
      <rect x="3" y="3" width="13" height="13" rx="2" />
      <path d="M8 19.5a2 2 0 0 0 2 2h9.5a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2" />
    </>
  ),
  layers: <path d="M12.8 2.2a2 2 0 0 0-1.6 0L2.6 6.1a1 1 0 0 0 0 1.8l8.6 3.9a2 2 0 0 0 1.6 0l8.6-3.9a1 1 0 0 0 0-1.8zM6.1 9.5l-3.5 1.6a1 1 0 0 0 0 1.8l8.6 3.9a2 2 0 0 0 1.6 0l8.6-3.9a1 1 0 0 0 0-1.8l-3.5-1.6M6.1 14.5l-3.5 1.6a1 1 0 0 0 0 1.8l8.6 3.9a2 2 0 0 0 1.6 0l8.6-3.9a1 1 0 0 0 0-1.8l-3.5-1.6" />,
  palette: (
    <>
      <path d="M12 21.5a9.5 9.5 0 1 1 9.5-9.5c0 2.5-2 4.5-4.5 4.5h-2a1.9 1.9 0 0 0-1.6 3l.3.4a1.9 1.9 0 0 1-1.7 1.6z" />
      <circle cx="8" cy="9" r="1" />
      <circle cx="12" cy="7" r="1" />
      <circle cx="16" cy="10" r="1" />
    </>
  ),

  // ── Shape picker ─────────────────────────────────────────────────────────
  'shape-rect': <rect x="3" y="6" width="18" height="12" rx="2" />,
  'shape-ellipse': <ellipse cx="12" cy="12" rx="9.5" ry="7" />,
  'shape-triangle': <path d="M13.7 4a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3z" />,
  'shape-diamond': <path d="M2.7 10.3a2.4 2.4 0 0 0 0 3.4l7.6 7.6a2.4 2.4 0 0 0 3.4 0l7.6-7.6a2.4 2.4 0 0 0 0-3.4l-7.6-7.6a2.4 2.4 0 0 0-3.4 0z" />,
  'shape-star': <path d="m12 2.7 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9z" />,
  'shape-pentagon': <path d="M10.8 2.4a2 2 0 0 1 2.4 0l8 5.7a2 2 0 0 1 .7 2.3l-3 9.2a2 2 0 0 1-1.9 1.4H7.2a2 2 0 0 1-1.9-1.4l-3-9.2a2 2 0 0 1 .7-2.3z" />,
  'shape-hexagon': <path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />,
  'shape-line': <path d="M4 20 20 4" />,

  // ── Alignment ────────────────────────────────────────────────────────────
  'align-left': <path d="M21 6H3m12 6H3m14 6H3" />,
  'align-center': <path d="M21 6H3m14 6H7m12 6H5" />,
  'align-right': <path d="M21 6H3m18 6H9m12 6H7" />,
  'align-justify': <path d="M21 6H3m18 6H3m18 6H3" />,
  'align-top': (
    <>
      <path d="M3 4h18" />
      <rect x="8" y="8" width="8" height="12" rx="1.5" />
    </>
  ),
  'align-middle': (
    <>
      <path d="M2 12h4m12 0h4" />
      <rect x="8" y="6" width="8" height="12" rx="1.5" />
    </>
  ),
  'align-bottom': (
    <>
      <path d="M3 20h18" />
      <rect x="8" y="4" width="8" height="12" rx="1.5" />
    </>
  ),

  // ── Domain / feature ─────────────────────────────────────────────────────
  grid: (
    <>
      <rect x="3" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" />
    </>
  ),
  template: (
    <>
      <rect x="3" y="3" width="18" height="6.5" rx="1.5" />
      <rect x="3" y="13" width="8.5" height="8" rx="1.5" />
      <rect x="15.5" y="13" width="5.5" height="8" rx="1.5" />
    </>
  ),
  folder: <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.7-.9L9.6 3.9A2 2 0 0 0 7.9 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />,
  globe: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <path d="M2.5 12h19M12 2.5a15 15 0 0 1 0 19 15 15 0 0 1 0-19z" />
    </>
  ),
  languages: <path d="M5 8l6 6m-7 0 6-6 2-3M2 5h12M7 2h1m14 20-5-10-5 10m2-4h6" />,
  camera: (
    <>
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z" />
      <circle cx="12" cy="13" r="3.2" />
    </>
  ),
  ai: (
    <>
      <rect x="3" y="10" width="18" height="11" rx="2.5" />
      <path d="M12 5.5V10M8 15.5h.01M16 15.5h.01" />
      <circle cx="12" cy="3.6" r="1.6" />
    </>
  ),
  moon: <path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2v2m0 16v2M4.2 4.2l1.4 1.4m12.8 12.8 1.4 1.4M2 12h2m16 0h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </>
  ),
  'font-size': <path d="M3 18 8 6l5 12M4.7 14h6.6M14 18l3.5-8 3.5 8m-6.1-2.6h5.2" />,
  swap: <path d="M7 4 3 8l4 4M3 8h13a4 4 0 0 1 0 8H9m8 4 4-4-4-4" />,
} as const

/** Icons drawn as solid shapes rather than strokes. */
const SOLID_ICONS = new Set<IconName>([
  'dot', 'bullet', 'play', 'more-horizontal', 'more-vertical', 'grip',
])

export type IconName = keyof typeof ICONS

export interface IconProps {
  name: IconName
  /** Rendered box in px (square). Defaults to 14 — the panel/toolbar size. */
  size?: number
  strokeWidth?: number
  className?: string
  style?: CSSProperties
  /** Set when the icon is the only content of a control and needs a name. */
  title?: string
}

export function Icon({
  name,
  size = 14,
  strokeWidth = 1.8,
  className,
  style,
  title,
}: IconProps): ReactElement {
  const solid = SOLID_ICONS.has(name)
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={solid ? 'currentColor' : 'none'}
      stroke={solid ? 'none' : 'currentColor'}
      strokeWidth={solid ? undefined : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ flexShrink: 0, display: 'block', ...style }}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      {ICONS[name]}
    </svg>
  )
}
