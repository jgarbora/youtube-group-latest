// API client — fetches categories and videos from the backend.

// Icon mapping for known category slugs. Falls back to 'folder' for unknown categories.
const CATEGORY_ICONS = {
  all:        'grid',
  software:   'code',
  music:      'music',
  cars:       'car',
  gaming:     'gamepad',
  film:       'film',
  sports:     'trophy',
  news:       'news',
  tech:       'chip',
  cooking:    'pan',
  travel:     'globe',
  science:    'atom',
  comedy:     'smile',
  fitness:    'dumbbell',
  fashion:    'shirt',
  diy:        'wrench',
  podcasts:   'mic',
  education:  'book',
  // Slugs produced by scripts/build-channels-json.ts from the user's categories
  surf:           'globe',
  kite:           'globe',
  ia:             'sparkle',
  simracing:      'gamepad',
  'call-of-duty': 'gamepad',
  podscast:       'mic',
  'cars-builds':  'wrench',
  'music-concert': 'music',
  hifi:           'chip',
  'music-learn':  'book',
  comida:         'pan',
  coffee:         'pan',
  'arte-pintura': 'smile',
  'tv-cine':      'film',
  'formula-1':    'trophy',
  hardware:       'chip',
  rc:             'wrench',
  fights:         'dumbbell',
  skate:          'trophy',
  bmx:            'trophy',
  otros:          'folder',
  default:    'grid',
};

// On GitHub Pages the data is prebuilt into data/*.json by scripts/build-static.ts.
// When those files are absent (local dev), fall back to the Express API.
async function fetchJson(staticPath, apiPath) {
  let res = await fetch(staticPath);
  if (res.status === 404) res = await fetch(apiPath);
  if (!res.ok) throw new Error(`Failed to fetch ${apiPath}: ${res.status}`);
  return res.json();
}

async function fetchCategories() {
  const data = await fetchJson('data/categories.json', '/api/categories');
  // Prepend the "All" virtual category
  return [
    { slug: 'all', name: 'All', icon: 'grid' },
    ...data.categories.map(c => ({
      slug: c.slug,
      name: c.name,
      icon: CATEGORY_ICONS[c.slug] || 'folder',
    })),
  ];
}

async function fetchVideos(categorySlug, maxResults = 10) {
  const params = new URLSearchParams({ maxResults: String(maxResults) });
  const slug = categorySlug && categorySlug !== 'all' ? categorySlug : 'all';
  if (slug !== 'all') params.set('category', slug);
  return fetchJson(`data/videos/${slug}.json`, `/api/videos?${params}`);
}

function formatTimeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`;
  return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`;
}

Object.assign(window, { fetchCategories, fetchVideos, formatTimeAgo, CATEGORY_ICONS });
