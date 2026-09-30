// Original minimal line icons. Stroke 1.6, 20x20 viewBox.
const Icon = ({ name, size = 20, className = '' }) => {
  const p = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };
  const paths = {
    grid:     <><rect x="3" y="3" width="6" height="6" rx="1" {...p}/><rect x="11" y="3" width="6" height="6" rx="1" {...p}/><rect x="3" y="11" width="6" height="6" rx="1" {...p}/><rect x="11" y="11" width="6" height="6" rx="1" {...p}/></>,
    code:     <><polyline points="7,7 3,10 7,13" {...p}/><polyline points="13,7 17,10 13,13" {...p}/><line x1="11" y1="5" x2="9" y2="15" {...p}/></>,
    music:    <><path d="M8 15V5l8-2v10" {...p}/><circle cx="6" cy="15" r="2" {...p}/><circle cx="14" cy="13" r="2" {...p}/></>,
    car:      <><path d="M3 13v-2l2-4h10l2 4v2" {...p}/><path d="M3 13h14v3H3z" {...p}/><circle cx="6" cy="16" r="1.3" {...p}/><circle cx="14" cy="16" r="1.3" {...p}/></>,
    gamepad:  <><rect x="2" y="6" width="16" height="9" rx="3" {...p}/><line x1="6" y1="10" x2="6" y2="12" {...p}/><line x1="5" y1="11" x2="7" y2="11" {...p}/><circle cx="13" cy="10" r="0.8" {...p}/><circle cx="15" cy="12" r="0.8" {...p}/></>,
    film:     <><rect x="3" y="4" width="14" height="12" rx="1" {...p}/><line x1="3" y1="8" x2="17" y2="8" {...p}/><line x1="3" y1="12" x2="17" y2="12" {...p}/><line x1="7" y1="4" x2="7" y2="16" {...p}/><line x1="13" y1="4" x2="13" y2="16" {...p}/></>,
    trophy:   <><path d="M6 4h8v4a4 4 0 0 1-8 0V4z" {...p}/><path d="M6 6H4v2a2 2 0 0 0 2 2" {...p}/><path d="M14 6h2v2a2 2 0 0 1-2 2" {...p}/><line x1="10" y1="12" x2="10" y2="15" {...p}/><line x1="7" y1="16" x2="13" y2="16" {...p}/></>,
    news:     <><rect x="3" y="4" width="14" height="12" rx="1" {...p}/><line x1="6" y1="7" x2="14" y2="7" {...p}/><line x1="6" y1="10" x2="14" y2="10" {...p}/><line x1="6" y1="13" x2="10" y2="13" {...p}/></>,
    chip:     <><rect x="5" y="5" width="10" height="10" rx="1" {...p}/><line x1="8" y1="2" x2="8" y2="5" {...p}/><line x1="12" y1="2" x2="12" y2="5" {...p}/><line x1="8" y1="15" x2="8" y2="18" {...p}/><line x1="12" y1="15" x2="12" y2="18" {...p}/><line x1="2" y1="8" x2="5" y2="8" {...p}/><line x1="2" y1="12" x2="5" y2="12" {...p}/><line x1="15" y1="8" x2="18" y2="8" {...p}/><line x1="15" y1="12" x2="18" y2="12" {...p}/></>,
    pan:      <><path d="M3 11h11a0 0 0 0 1 0 0v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-1z" {...p}/><line x1="14" y1="11" x2="18" y2="9" {...p}/></>,
    globe:    <><circle cx="10" cy="10" r="7" {...p}/><ellipse cx="10" cy="10" rx="3" ry="7" {...p}/><line x1="3" y1="10" x2="17" y2="10" {...p}/></>,
    atom:     <><circle cx="10" cy="10" r="1.5" {...p}/><ellipse cx="10" cy="10" rx="7" ry="3" {...p}/><ellipse cx="10" cy="10" rx="7" ry="3" transform="rotate(60 10 10)" {...p}/><ellipse cx="10" cy="10" rx="7" ry="3" transform="rotate(-60 10 10)" {...p}/></>,
    smile:    <><circle cx="10" cy="10" r="7" {...p}/><path d="M7 12c0.8 1.2 2 2 3 2s2.2-0.8 3-2" {...p}/><circle cx="7.5" cy="8.5" r="0.6" fill="currentColor" stroke="none"/><circle cx="12.5" cy="8.5" r="0.6" fill="currentColor" stroke="none"/></>,
    dumbbell: <><rect x="2" y="7" width="2" height="6" {...p}/><rect x="16" y="7" width="2" height="6" {...p}/><rect x="5" y="8.5" width="10" height="3" {...p}/></>,
    shirt:    <><path d="M6 3l-3 2v3l2 1v8h10V9l2-1V5l-3-2-2 2a3 3 0 0 1-4 0L6 3z" {...p}/></>,
    wrench:   <><path d="M14 3a3 3 0 0 0-3 4l-7 7a1.5 1.5 0 0 0 2 2l7-7a3 3 0 0 0 4-3l-2 2-2-1-1-2 2-2z" {...p}/></>,
    mic:      <><rect x="8" y="3" width="4" height="9" rx="2" {...p}/><path d="M5 10a5 5 0 0 0 10 0" {...p}/><line x1="10" y1="15" x2="10" y2="18" {...p}/><line x1="7" y1="18" x2="13" y2="18" {...p}/></>,
    book:     <><path d="M4 4h5a2 2 0 0 1 2 2v11a2 2 0 0 0-2-2H4z" {...p}/><path d="M16 4h-5a2 2 0 0 0-2 2v11a2 2 0 0 1 2-2h5z" {...p}/></>,
    search:   <><circle cx="9" cy="9" r="5.5" {...p}/><line x1="13" y1="13" x2="17" y2="17" {...p}/></>,
    menu:     <><line x1="3" y1="6" x2="17" y2="6" {...p}/><line x1="3" y1="10" x2="17" y2="10" {...p}/><line x1="3" y1="14" x2="17" y2="14" {...p}/></>,
    bell:     <><path d="M5 14h10l-1-2V9a4 4 0 0 0-8 0v3z" {...p}/><path d="M8 16a2 2 0 0 0 4 0" {...p}/></>,
    upload:   <><path d="M10 13V4" {...p}/><polyline points="6,7 10,3 14,7" {...p}/><path d="M4 14v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2" {...p}/></>,
    play:     <><polygon points="7,5 15,10 7,15" fill="currentColor" stroke="none"/></>,
    close:    <><line x1="5" y1="5" x2="15" y2="15" {...p}/><line x1="15" y1="5" x2="5" y2="15" {...p}/></>,
    sparkle:  <><path d="M10 3l1.5 4.5L16 9l-4.5 1.5L10 15l-1.5-4.5L4 9l4.5-1.5z" {...p}/></>,
    folder:   <><path d="M3 6v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H9l-2-2H4a1 1 0 0 0-1 1z" {...p}/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" className={className} aria-hidden="true">
      {paths[name] || paths.grid}
    </svg>
  );
};

Object.assign(window, { Icon });
