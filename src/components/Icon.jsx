// Lucide-style 24px stroke icons, inlined once. A single <Icon> lookup beats
// pulling an icon package for the ~20 glyphs this page actually uses.

const P = {
  user: <><circle cx="12" cy="8" r="3.4" /><path d="M5 20c0-3.6 3.1-6.2 7-6.2s7 2.6 7 6.2" /></>,
  file: <><path d="M7 4h7l4 4v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" /><path d="M14 4v4h4M9.5 12.5h6M9.5 15.5h4.2" /></>,
  stack: <><path d="M12 3.5 4 8l8 4.5 8-4.5z" /><path d="M4 12.5 12 17l8-4.5M4 16.5 12 21l8-4.5" /></>,
  shield: <><path d="M12 3.5 5 6v5.2c0 4.4 2.9 7.6 7 9.3 4.1-1.7 7-4.9 7-9.3V6z" /><path d="M9 12.2l2.1 2.1L15.3 10" /></>,
  folder: <path d="M3.5 6.5a1 1 0 0 1 1-1H10l2 2h7.5a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1z" />,
  bolt: <path d="M13 3 5 13.5h5.5L11 21l8-10.5h-5.5z" />,
  users: <><circle cx="9" cy="8" r="3" /><path d="M3.5 19.5c0-3 2.5-5.2 5.5-5.2s5.5 2.2 5.5 5.2" /><circle cx="17" cy="9" r="2.4" /><path d="M15.3 14.6c2.4.3 4.2 2.2 4.2 4.9" /></>,
  cap: <><path d="M12 4 2.5 8.5 12 13l9.5-4.5z" /><path d="M6.5 10.8v5c0 1.3 2.5 2.7 5.5 2.7s5.5-1.4 5.5-2.7v-5M21.5 8.5v6.5" /></>,
  badge: <><circle cx="12" cy="9" r="5" /><path d="m9.5 13.5-2 7 4.5-2.5L16.5 20.5l-2-7" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  check: <path d="m5 13 4 4L19 7" />,
  arrowOut: <path d="M7 17 17 7M8 7h9v9" />,
  brain: <><path d="M12 3.5a3 3 0 0 1 3 3v.3a3 3 0 0 1 1.8 5.4 3 3 0 0 1-1.8 5.4v.4a3 3 0 0 1-6 0v-.4a3 3 0 0 1-1.8-5.4A3 3 0 0 1 9 6.8V6.5a3 3 0 0 1 3-3z" /><path d="M9 9.5h6M9 14.5h6" /></>,
  db: <><ellipse cx="12" cy="6" rx="7" ry="2.6" /><path d="M5 6v6c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6M5 12v6c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-6" /></>,
  cloud: <path d="M7 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17 8.5a4.5 4.5 0 0 1 .5 9H7z" />,
  mic: <><path d="M8 4.5v6a4 4 0 0 0 8 0v-6" /><path d="M12 16v3.5M8.5 19.5h7" /><rect x="9" y="2.5" width="6" height="8" rx="3" /></>,
  flow: <><rect x="2.5" y="10" width="6" height="6" rx="1.4" /><rect x="15.5" y="3" width="6" height="6" rx="1.4" /><rect x="15.5" y="15" width="6" height="6" rx="1.4" /><path d="M8.5 13h2a2 2 0 0 0 2-2V8.5a2 2 0 0 1 2-2h3M12.5 13v2.5a2 2 0 0 0 2 2h1" /></>,
  share: <><circle cx="6" cy="12" r="3" /><circle cx="18" cy="6" r="3" /><circle cx="18" cy="18" r="3" /><path d="M8.6 10.7 15.4 7.3M8.6 13.3l6.8 3.4" /></>,
  linkedin: <><circle cx="7" cy="7" r="2" /><path d="M7 11v9M13 20v-5.5a2.5 2.5 0 0 1 5 0V20M13 20v-9" /></>,
  github: <path d="m9 8-4 4 4 4M15 8l4 4-4 4" />,
  code: <path d="M9 5 4 12l5 7M13 4l-3 16" />,
  shieldHex: <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" />,
  // Per-project row swatches — a hand-drawn glyph each, not a bare color block.
  swShield: <><path d="M12 3.5 5 6v5.2c0 4.4 2.9 7.6 7 9.3 4.1-1.7 7-4.9 7-9.3V6z" /><path d="M9 12.2l2.1 2.1L15.3 10" /></>,
  swDocChat: <><path d="M8 3.5h6l3.5 3.5V17a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" /><path d="M9.5 10.5h5M9.5 13.5h3.2" /><path d="M14 3.5V7h3.5" /><circle cx="17.3" cy="18" r="3.3" fill="none" /><path d="M16 19.3l-.9 1.2.15-1.55" /></>,
  swResume: <><rect x="4.5" y="3.5" width="10" height="15" rx="1" /><path d="M7 7.5h4.5M7 10.5h4.5M7 13.5h3" /><circle cx="17.3" cy="16.2" r="3.3" /><path d="M15.6 16.3l1.1 1.1 2-2.3" /></>,
  swBrief: <><rect x="3.5" y="8" width="17" height="11" rx="1.4" /><path d="M8.5 8V6a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 15.5 6v2" /><circle cx="12" cy="13.3" r="1.3" fill="currentColor" stroke="none" /><path d="M12 14.6V17" /></>,
  swMesh: <><circle cx="12" cy="5.5" r="2" /><circle cx="5.5" cy="17.5" r="2" /><circle cx="18.5" cy="17.5" r="2" /><path d="M10.6 7.1 7 15.8M13.4 7.1 17 15.8M7.7 17.5h8.6" /></>,
}

// Optical weight differs per use: section eyebrows are thin/1.8, card headers
// heavier at 1.7, contact links use the shared 1.7. `solid` is a filled glyph.
export default function Icon({ name, size = 24, width = 1.8, className, ...rest }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      {P[name]}
    </svg>
  )
}
