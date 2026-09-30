const { useState, useMemo, useEffect, useRef, useCallback } = React;

// ---------- Header ----------
const Header = ({ videos, query, setQuery, onToggleNav }) => {
  const [focus, setFocus] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return videos
      .filter(v => v.title.toLowerCase().includes(q) || v.channelTitle.toLowerCase().includes(q))
      .slice(0, 7);
  }, [query, videos]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowResults(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="app-header">
      <div className="header-left">
        <button className="icon-btn" onClick={onToggleNav} aria-label="Toggle navigation">
          <window.Icon name="menu"/>
        </button>
        <div className="brand" aria-label="Reel">
          <div className="brand-mark">
            <svg width="26" height="26" viewBox="0 0 26 26">
              <rect x="1" y="5" width="24" height="16" rx="4" fill="oklch(0.68 0.18 25)"/>
              <polygon points="10,9 18,13 10,17" fill="oklch(0.16 0.01 260)"/>
            </svg>
          </div>
          <span className="brand-word">reel</span>
          <span className="brand-sub">.tv</span>
        </div>
      </div>

      <div className={`search-wrap ${focus ? 'focus' : ''}`}>
        <div className="search">
          <window.Icon name="search" size={18}/>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search videos, channels, topics"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setShowResults(true); }}
            onFocus={() => { setFocus(true); setShowResults(true); }}
            onBlur={() => { setFocus(false); setTimeout(() => setShowResults(false), 150); }}
          />
          {query && (
            <button className="search-clear" onClick={() => { setQuery(''); inputRef.current?.focus(); }} aria-label="Clear search">
              <window.Icon name="close" size={14}/>
            </button>
          )}
          <kbd className="kbd">⌘K</kbd>
        </div>
        {showResults && query && (
          <div className="search-results">
            {results.length === 0 && (
              <div className="search-empty">No matches for "{query}"</div>
            )}
            {results.map(v => (
              <a key={v.id} className="search-result" href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer" onMouseDown={(e) => e.preventDefault()}>
                <div className="search-result-thumb">
                  <window.Thumbnail video={v}/>
                </div>
                <div className="search-result-meta">
                  <div className="search-result-title">{v.title}</div>
                  <div className="search-result-sub">{v.channelTitle} · {window.formatTimeAgo(v.publishedAt)}</div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="header-right">
        <button className="icon-btn" aria-label="Upload"><window.Icon name="upload"/></button>
        <button className="icon-btn" aria-label="Notifications">
          <window.Icon name="bell"/>
          <span className="dot"/>
        </button>
        <div className="avatar" title="Your profile">YT</div>
      </div>
    </header>
  );
};

// ---------- Sidebar ----------
const Sidebar = ({ categories, active, onSelect, collapsed, loading }) => {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-section">
        <div className="sidebar-label">Categories</div>
        <nav className="sidebar-nav">
          {loading && categories.length === 0 ? (
            <div style={{ padding: '12px', color: 'var(--fg-3)', fontSize: '13px' }}>Loading...</div>
          ) : (
            categories.map(c => (
              <button
                key={c.slug}
                className={`nav-item ${active === c.slug ? 'active' : ''}`}
                onClick={() => onSelect(c.slug)}
                title={c.name}
              >
                <span className="nav-icon"><window.Icon name={c.icon}/></span>
                <span className="nav-label">{c.name}</span>
                {active === c.slug && <span className="nav-rail"/>}
              </button>
            ))
          )}
        </nav>
      </div>
      <div className="sidebar-footer">
        <div className="sidebar-meta">reel.tv · v0.4</div>
        <div className="sidebar-meta muted">categories from /api/categories</div>
      </div>
    </aside>
  );
};

// ---------- Video Card ----------
const VideoCard = ({ v }) => {
  const channelInitial = v.channelTitle.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase();
  return (
    <a className="card" href={`https://www.youtube.com/watch?v=${v.id}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
      <window.Thumbnail video={v}/>
      <div className="card-body">
        <div className="card-avatar" aria-hidden="true">{channelInitial}</div>
        <div className="card-text">
          <h3 className="card-title">{v.title}</h3>
          <div className="card-channel">{v.channelTitle}</div>
          <div className="card-meta">
            <span>{window.formatTimeAgo(v.publishedAt)}</span>
          </div>
        </div>
      </div>
    </a>
  );
};

// ---------- Feed ----------
const Feed = ({ categories, category, videos, loading, errors, query }) => {
  const catLabel = categories.find(c => c.slug === category)?.name || 'All';

  const filtered = useMemo(() => {
    if (!query.trim()) return videos;
    const q = query.trim().toLowerCase();
    return videos.filter(v =>
      v.title.toLowerCase().includes(q) || v.channelTitle.toLowerCase().includes(q)
    );
  }, [videos, query]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    return copy;
  }, [filtered]);

  return (
    <main className="feed">
      <div className="feed-head">
        <div className="feed-title-row">
          <h1 className="feed-title">
            {query.trim() ? (
              <>Results in <em>{catLabel}</em></>
            ) : catLabel === 'All' ? 'All videos' : catLabel}
          </h1>
          {!loading && <div className="feed-count">{sorted.length} video{sorted.length === 1 ? '' : 's'}</div>}
        </div>
      </div>

      {errors && errors.length > 0 && (
        <div className="error-banner">
          {errors.length === 1
            ? `Warning: failed to fetch from 1 channel — ${errors[0].message}`
            : `Warning: failed to fetch from ${errors.length} channels`
          }
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"/>
          <div className="loading-title">Loading videos...</div>
        </div>
      ) : sorted.length === 0 ? (
        <div className="empty">
          <window.Icon name="search" size={28}/>
          <div className="empty-title">
            {query.trim()
              ? `Nothing in ${catLabel} matches "${query}"`
              : `No videos found in ${catLabel}`
            }
          </div>
          <div className="empty-sub">Try another category or clear the search.</div>
        </div>
      ) : (
        <div className="grid">
          {sorted.map(v => <VideoCard key={v.id} v={v}/>)}
        </div>
      )}
    </main>
  );
};

// ---------- App ----------
const App = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(() => localStorage.getItem('reel:cat') || 'all');
  const [videos, setVideos] = useState([]);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [catLoading, setCatLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [navCollapsed, setNavCollapsed] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    window.fetchCategories()
      .then(cats => {
        setCategories(cats);
        setCatLoading(false);
        // If saved category doesn't exist in fetched list, reset to 'all'
        if (!cats.find(c => c.slug === category)) {
          setCategory('all');
        }
      })
      .catch(err => {
        console.error('Failed to fetch categories:', err);
        setCatLoading(false);
      });
  }, []);

  // Fetch videos when category changes
  useEffect(() => {
    localStorage.setItem('reel:cat', category);
    setLoading(true);
    setVideos([]);
    setErrors([]);
    window.fetchVideos(category)
      .then(data => {
        setVideos(data.videos || []);
        setErrors(data.errors || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch videos:', err);
        setVideos([]);
        setErrors([]);
        setLoading(false);
      });
  }, [category]);

  return (
    <div className={`app ${navCollapsed ? 'nav-collapsed' : ''}`}>
      <Header videos={videos} query={query} setQuery={setQuery} onToggleNav={() => setNavCollapsed(v => !v)}/>
      <div className="body">
        <Sidebar categories={categories} active={category} onSelect={setCategory} collapsed={navCollapsed} loading={catLoading}/>
        <Feed categories={categories} category={category} videos={videos} loading={loading} errors={errors} query={query}/>
      </div>
    </div>
  );
};

Object.assign(window, { App, Header, Sidebar, Feed, VideoCard });
