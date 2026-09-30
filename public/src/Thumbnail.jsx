// Thumbnail component — uses real YouTube thumbnail URL if available,
// falls back to abstract color-block generator.

function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function thumbPalette(seed) {
  const h = hashStr(seed);
  const hue1 = h % 360;
  const hue2 = (hue1 + 35 + ((h >> 8) % 60)) % 360;
  const hue3 = (hue1 + 180 + ((h >> 16) % 40)) % 360;
  return {
    a: `oklch(0.42 0.14 ${hue1})`,
    b: `oklch(0.58 0.17 ${hue2})`,
    c: `oklch(0.32 0.12 ${hue3})`,
    pattern: h % 4,
  };
}

const FallbackThumb = ({ seed }) => {
  const pal = thumbPalette(seed);
  const pattern = pal.pattern;
  const h = hashStr(seed);
  const a = (h % 100) / 100;
  const b = ((h >> 7) % 100) / 100;
  const c = ((h >> 13) % 100) / 100;

  return (
    <svg viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" className="thumb-svg">
      <defs>
        <linearGradient id={`g-${seed}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={pal.a}/>
          <stop offset="1" stopColor={pal.c}/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="320" height="180" fill={`url(#g-${seed})`}/>
      {pattern === 0 && (
        <>
          <rect x={20 + a*120} y="-20" width="80" height="260" fill={pal.b} opacity="0.55" transform={`rotate(${-12 + b*24} 160 90)`}/>
          <circle cx={240 - c*80} cy={60 + a*60} r={40 + b*30} fill={pal.a} opacity="0.45"/>
        </>
      )}
      {pattern === 1 && (
        <>
          {Array.from({length: 5}).map((_, i) => (
            <rect key={i} x={i*65 + (a*20)} y={-20} width="28" height="260" fill={i % 2 ? pal.b : pal.c} opacity={0.35 + (i*0.08)} transform={`rotate(${-18} 160 90)`}/>
          ))}
        </>
      )}
      {pattern === 2 && (
        <>
          <circle cx="160" cy="90" r={60 + a*30} fill={pal.b} opacity="0.55"/>
          <circle cx={80 + b*160} cy={40 + c*100} r={20 + a*20} fill={pal.a} opacity="0.6"/>
          <circle cx={260 - c*80} cy={120 - a*40} r={15 + b*15} fill={pal.c} opacity="0.7"/>
        </>
      )}
      {pattern === 3 && (
        <>
          <polygon points={`${a*80},180 ${80+b*60},${40+c*60} ${200+a*40},${100+b*40} ${320},180`} fill={pal.b} opacity="0.55"/>
          <polygon points={`0,0 ${60+c*120},0 ${40+a*60},${80+b*40} 0,${120+a*40}`} fill={pal.a} opacity="0.5"/>
        </>
      )}
    </svg>
  );
};

const Thumbnail = ({ video }) => {
  const [imgError, setImgError] = React.useState(false);
  const hasThumb = video.thumbnailUrl && !imgError;

  return (
    <div className="thumb">
      {hasThumb ? (
        <img
          className="thumb-img"
          src={video.thumbnailUrl}
          alt={video.title}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      ) : (
        <FallbackThumb seed={video.id + video.title}/>
      )}
      <div className="thumb-hover">
        <div className="thumb-play">
          <window.Icon name="play" size={22}/>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { Thumbnail, hashStr, thumbPalette });
