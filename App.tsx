
import { useMemo, useState } from 'react'
import {
  Search, Film, Clapperboard, Sparkles, Bookmark, Play,
  Globe2, Menu, X, Clock3, Languages, ExternalLink
} from 'lucide-react'
import { movies, categories, type Movie } from './data'

function App() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [language, setLanguage] = useState('All languages')
  const [genre, setGenre] = useState('All genres')
  const [visibleCount, setVisibleCount] = useState(12)
  const [watchlist, setWatchlist] = useState<number[]>([])
  const [selected, setSelected] = useState<Movie | null>(null)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [notice, setNotice] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const normalizedQuery = query.trim().toLowerCase()

  const matchesSearch = (m: Movie) => {
    if (!normalizedQuery) return true

    const text = `${m.title} ${m.language} ${m.genre} ${m.region} ${m.description} ${m.type}`.toLowerCase()

    if (text.includes(normalizedQuery)) return true

    if (['show', 'shows', 'drama', 'dramas'].includes(normalizedQuery)) {
      return m.type === 'Series'
    }

    if (['cartoon', 'cartoons'].includes(normalizedQuery)) {
      return m.type === 'Anime'
    }

    if (['film', 'films'].includes(normalizedQuery)) {
      return m.type === 'Movie'
    }

    return false
  }

  const filtered = useMemo(() => movies.filter(m => {
    const matchesCategory =
      category === 'All' ||
      (category === 'Movies' && m.type === 'Movie') ||
      (category === 'Series' && m.type === 'Series') ||
      (category === 'Anime' && m.type === 'Anime') ||
      (category === 'Punjabi' && m.language.toLowerCase() === 'punjabi') ||
      (category === 'Recently Added' && m.id >= 13)

    return matchesSearch(m) &&
      matchesCategory &&
      (language === 'All languages' || m.language === language) &&
      (genre === 'All genres' || m.genre.toLowerCase().includes(genre.toLowerCase()))
  }), [query, category, language, genre])

  const suggestionItems = useMemo(() => {
    if (!normalizedQuery) return []

    const titleMatches = movies
      .filter(matchesSearch)
      .map(m => ({
        label: m.title,
        detail: `${m.type} • ${m.language} • ${m.year}`,
        value: m.title,
        kind: 'title'
      }))

    const categoryWords = [
      { label: 'Punjabi Cinema', detail: 'Punjabi movies and shows', value: 'Punjabi', kind: 'category', terms: ['punjabi'] },
      { label: 'Movies', detail: 'All available movies', value: 'Movies', kind: 'category', terms: ['movie', 'movies', 'film', 'films'] },
      { label: 'TV Shows & Series', detail: 'All available shows and dramas', value: 'Series', kind: 'category', terms: ['show', 'shows', 'series', 'drama', 'dramas'] },
      { label: 'Anime', detail: 'All available anime', value: 'Anime', kind: 'category', terms: ['anime', 'cartoon', 'cartoons'] },
      { label: 'Hindi', detail: 'Hindi-language titles', value: 'Hindi', kind: 'language', terms: ['hindi'] },
      { label: 'English', detail: 'English-language titles', value: 'English', kind: 'language', terms: ['english'] },
      { label: 'Korean', detail: 'Korean-language titles', value: 'Korean', kind: 'language', terms: ['korean'] },
      { label: 'Japanese', detail: 'Japanese-language titles', value: 'Japanese', kind: 'language', terms: ['japanese'] }
    ]
      .filter(item => item.terms.some(term => term.includes(normalizedQuery) || normalizedQuery.includes(term)))
      .map(({ label, detail, value, kind }) => ({ label, detail, value, kind }))

    const uniqueTitles = titleMatches.filter(
      (item, index, self) => self.findIndex(x => x.label === item.label) === index
    )

    return [...categoryWords, ...uniqueTitles]
  }, [query])

  const chooseSuggestion = (item: { label: string; value: string; kind: string }) => {
    setShowSuggestions(false)
    setVisibleCount(12)

    if (item.kind === 'title') {
      const movie = movies.find(m => m.title === item.value)
      if (movie) setSelected(movie)
      setQuery('')
      return
    }

    if (item.kind === 'category') {
      setCategory(item.value)
      setLanguage('All languages')
      setGenre('All genres')
      setQuery('')
    } else if (item.kind === 'language') {
      setLanguage(item.value)
      setCategory('All')
      setGenre('All genres')
      setQuery('')
    }
  }

  const toggleWatchlist = (id: number) =>
    setWatchlist(old =>
      old.includes(id) ? old.filter(x => x !== id) : [...old, id]
    )

  const featured = movies.find(m => m.id === 7) || movies[0]

  const openWatch = (movie: Movie) => {
    setSelected(movie)
    setNotice('')
  }

  const genres = [
    'All genres',
    ...Array.from(new Set(movies.map(m => m.genre.split(' / ')[0]))).sort()
  ]

  const languages = [
    'All languages',
    ...Array.from(new Set(movies.map(m => m.language))).sort()
  ]

  const Card = ({ movie }: { movie: Movie }) => (
    <article className="movie-card">
      <button className="poster" onClick={() => setSelected(movie)} aria-label={`View ${movie.title}`}>
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={`${movie.title} poster`}
            onError={e => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.parentElement?.classList.add('fallback')
            }}
          />
        ) : null}
        <div className="poster-fallback">
          <Film size={32} />
          <span>{movie.title}</span>
        </div>
        <span className="type-tag">{movie.type}</span>
        <span className="play-overlay"><Play fill="currentColor" size={22} /></span>
      </button>

      <div className="card-info">
        <div className="card-title-row">
          <h3>{movie.title}</h3>
          <button
            className={`bookmark ${watchlist.includes(movie.id) ? 'saved' : ''}`}
            onClick={() => toggleWatchlist(movie.id)}
            aria-label="Toggle watchlist"
          >
            <Bookmark size={16} fill={watchlist.includes(movie.id) ? 'currentColor' : 'none'} />
          </button>
        </div>
        <p>{movie.year} <span>•</span> {movie.language} <span>•</span> {movie.region}</p>
        <button className="text-link" onClick={() => setSelected(movie)}>
          Details <ExternalLink size={13} />
        </button>
      </div>
    </article>
  )

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => {
          setCategory('All')
          setQuery('')
          setShowSuggestions(false)
        }}>
          <span className="brand-icon"><Clapperboard size={23} /></span>
          <span>MOVIE <b>NOVA</b><small>A UNIVERSE OF MOVIES & ENTERTAINMENT</small></span>
        </button>

        <nav className={mobileMenu ? 'nav open' : 'nav'}>
          {['Discover', 'Movies', 'Series', 'Anime', 'Punjabi'].map(item => (
            <button
              key={item}
              className={(item === 'Discover' ? category === 'All' : category === item) ? 'nav-active' : ''}
              onClick={() => {
                setCategory(item === 'Discover' ? 'All' : item)
                setVisibleCount(12)
                setQuery('')
                setShowSuggestions(false)
                setMobileMenu(false)
              }}
            >
              {item}
            </button>
          ))}
        </nav>

        <div className="top-actions">
          <button className="icon-button" onClick={() => {
            document.getElementById('search')?.focus()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }} aria-label="Search">
            <Search />
          </button>
          <button className="menu-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menu">
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <main>
        <section className="search-top" style={{
          padding: '22px 5%',
          background: '#101116',
          borderBottom: '1px solid #292c35'
        }}>
          <div style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center'
          }}>
            <div className="search-box" style={{
              position: 'relative',
              flex: '1 1 280px',
              minWidth: '0',
              background: '#1b1d25',
              border: '1px solid #414554',
              borderRadius: '12px',
              padding: '0 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#b9bdca',
              minHeight: '50px'
            }}>
              <Search size={19} />
              <input
                id="search"
                value={query}
                onFocus={() => setShowSuggestions(true)}
                onChange={e => {
                  setQuery(e.target.value)
                  setShowSuggestions(true)
                  setVisibleCount(12)
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && suggestionItems.length > 0) {
                    chooseSuggestion(suggestionItems[0])
                  }
                  if (e.key === 'Escape') setShowSuggestions(false)
                }}
                placeholder="Search Punjabi, Kapil, anime, shows..."
                autoComplete="off"
                style={{
                  flex: 1,
                  minWidth: 0,
                  background: 'transparent',
                  color: '#fff',
                  border: 0,
                  outline: 'none',
                  padding: '14px 0',
                  fontSize: '15px'
                }}
              />
              {query && (
                <button onClick={() => {
                  setQuery('')
                  setShowSuggestions(false)
                }} aria-label="Clear search" style={{
                  background: 'transparent',
                  color: '#fff',
                  border: 0,
                  cursor: 'pointer'
                }}>
                  <X size={16} />
                </button>
              )}

              {showSuggestions && query.trim() && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 9px)',
                  left: 0,
                  right: 0,
                  zIndex: 200,
                  background: '#171922',
                  border: '1px solid #414554',
                  borderRadius: '12px',
                  padding: '8px',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.65)',
                  maxHeight: '65vh',
                  overflowY: 'auto'
                }}>
                  <div style={{
                    color: '#999eae',
                    fontSize: '11px',
                    letterSpacing: '1px',
                    padding: '8px 12px'
                  }}>
                    SEARCH SUGGESTIONS
                  </div>

                  {suggestionItems.length > 0 ? suggestionItems.map((item, index) => (
                    <button
                      key={`${item.kind}-${item.value}-${index}`}
                      onClick={() => chooseSuggestion(item)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        width: '100%',
                        padding: '12px',
                        border: 0,
                        borderRadius: '8px',
                        background: 'transparent',
                        color: '#fff',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#292d3a'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <strong style={{ fontSize: '14px' }}>{item.label}</strong>
                      <small style={{ color: '#a5a9b5', marginTop: '4px' }}>{item.detail}</small>
                    </button>
                  )) : (
                    <p style={{ color: '#a5a9b5', padding: '12px', margin: 0 }}>
                      No suggestions found. Try another word.
                    </p>
                  )}
                </div>
              )}
            </div>

            <label className="select-wrap">
              <Languages size={16} />
              <select value={language} onChange={e => {
                setLanguage(e.target.value)
                setVisibleCount(12)
              }}>
                {languages.map(l => <option key={l}>{l}</option>)}
              </select>
            </label>

            <label className="select-wrap">
              <Film size={16} />
              <select value={genre} onChange={e => {
                setGenre(e.target.value)
                setVisibleCount(12)
              }}>
                {genres.map(g => <option key={g}>{g}</option>)}
              </select>
            </label>
          </div>
        </section>

        <section className="hero">
          <div className="hero-art">
            <div className="orb orb-one" />
            <div className="orb orb-two" />
            <div className="hero-grid" />
          </div>

          <div className="hero-content">
            <div className="eyebrow"><span className="live-dot" /> YOUR WORLD OF ENTERTAINMENT</div>
            <h1>One world.<br /><em>Every story.</em></h1>
            <p>Explore movies, series, dramas and anime from every corner of the world — including Punjabi cinema.</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}>
                <Sparkles size={17} /> Explore catalog
              </button>
              <button className="secondary-button" onClick={() => {
                setCategory('Punjabi')
                setQuery('')
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })
              }}>
                Punjabi movies <span>→</span>
              </button>
            </div>
            <div className="hero-stats">
              <span><Globe2 size={15} /> Worldwide discovery</span>
              <span><Languages size={15} /> Multiple languages</span>
              <span><Film size={15} /> Curated catalog</span>
            </div>
          </div>

          <div className="hero-feature">
            <div className="feature-poster">
              <div className="feature-glow" />
              <span className="feature-label">FEATURED • PUNJABI CINEMA</span>
              <div className="feature-copy">
                <span>PAKISTANI PUNJABI</span>
                <h2>The Legend of<br />Maula Jatt</h2>
                <p>2022 · Action / Drama</p>
                <button className="feature-play" onClick={() => openWatch(featured)}>
                  <Play size={15} fill="currentColor" /> Explore title
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="benefit-strip">
          <div>
            <span className="benefit-icon"><Search /></span>
            <span><b>Discover more</b><small>Search the available catalog</small></span>
          </div>
          <div>
            <span className="benefit-icon"><Bookmark /></span>
            <span><b>Your watchlist</b><small>{watchlist.length} saved title{watchlist.length === 1 ? '' : 's'}</small></span>
          </div>
          <div>
            <span className="benefit-icon"><Clock3 /></span>
            <span><b>Release information</b><small>Dates shown when available</small></span>
          </div>
        </section>

        <section className="catalog-section" id="catalog">
          <div className="section-heading">
            <div>
              <span className="eyebrow">FIND YOUR NEXT FAVORITE</span>
              <h2>Explore the <em>catalog</em></h2>
              <p>Browse available titles across languages, regions and genres.</p>
            </div>
            <div className="catalog-count">
              {filtered.length} <span>titles in this demo catalog</span>
            </div>
          </div>

          <div className="category-tabs">
            {categories.map(c => (
              <button
                key={c}
                className={category === c ? 'selected' : ''}
                onClick={() => {
                  setCategory(c)
                  setQuery('')
                  setShowSuggestions(false)
                  setVisibleCount(12)
                }}
              >
                {c === 'Punjabi' ? 'Punjabi Cinema' : c}
              </button>
            ))}
          </div>

          {query.trim() ? (
            <div className="empty-state">
              <Search size={32} />
              <h3>Choose a search suggestion</h3>
              <p>Matching titles are shown in the suggestions under the search bar.</p>
              <button className="secondary-button" onClick={() => {
                setQuery('')
                setShowSuggestions(false)
              }}>
                Clear search
              </button>
            </div>
          ) : filtered.length ? (
            <div className="movie-grid">
              {filtered.slice(0, visibleCount).map(m => <Card key={m.id} movie={m} />)}
            </div>
          ) : (
            <div className="empty-state">
              <Film size={32} />
              <h3>No titles found</h3>
              <p>Try a different filter or clear your filters.</p>
              <button className="secondary-button" onClick={() => {
                setQuery('')
                setCategory('All')
                setLanguage('All languages')
                setGenre('All genres')
                setShowSuggestions(false)
              }}>
                Clear filters
              </button>
            </div>
          )}

          {!query.trim() && filtered.length > visibleCount && (
            <button className="load-more" onClick={() => setVisibleCount(c => c + 12)}>
              Load more titles <span>↓</span>
            </button>
          )}
        </section>

        <section className="membership">
          <div>
            <span className="eyebrow">MOVIE NOVA PLUS</span>
            <h2>Make it your <em>world.</em></h2>
            <p>Choose a membership plan for additional discovery features. Prices are configurable; streaming rights are separate.</p>
          </div>
          <div className="price-grid">
            {[
              { name: 'Monthly', duration: '1 month', price: '499' },
              { name: 'Quarterly', duration: '3 months', price: '1,299' },
              { name: 'Half-Yearly', duration: '6 months', price: '2,299' },
              { name: 'Annual', duration: '1 year', price: '3,999' }
            ].map((p, i) => (
              <div className={`price-card ${i === 3 ? 'popular' : ''}`} key={p.name}>
                {i === 3 && <span className="popular-label">LONG-TERM</span>}
                <h3>{p.name}</h3>
                <p>{p.duration}</p>
                <div className="price"><small>PKR</small> {p.price}</div>
                <button onClick={() => setNotice(`Selected ${p.name} plan (PKR ${p.price}). Payment setup is not yet active.`)}>
                  Choose plan
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <span className="brand-icon"><Clapperboard size={20} /></span>
          <span>MOVIE <b>NOVA</b><small>A UNIVERSE OF MOVIES & ENTERTAINMENT</small></span>
        </div>
        <p>Discover movies and stories from around the world.</p>
        <small>Demo catalog · Streaming availability varies by region. Only use authorized video sources.</small>
        <div className="footer-links">
          <a href="#catalog">Discover</a>
          <a href="#catalog" onClick={() => setCategory('Punjabi')}>Punjabi Cinema</a>
          <a href="#catalog">Catalog</a>
        </div>
      </footer>

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="detail-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close"><X /></button>
            <div className="modal-art">
              <Film size={44} />
              <span>{selected.language} CINEMA</span>
            </div>
            <div className="modal-body">
              <span className="eyebrow">{selected.region.toUpperCase()} · {selected.type.toUpperCase()}</span>
              <h2>{selected.title}</h2>
              <p className="modal-meta">{selected.year} · {selected.language} · {selected.genre}</p>
              <p>{selected.description}</p>
              <div className="modal-actions">
                <button className="primary-button" onClick={() =>
                  selected.trailerUrl
                    ? window.open(selected.trailerUrl, '_blank', 'noopener,noreferrer')
                    : setNotice('No verified trailer has been configured for this title yet.')
                }>
                  <Play size={16} fill="currentColor" /> Find official trailer
                </button>
                <button className="secondary-button" onClick={() => {
                  const alreadySaved = watchlist.includes(selected.id)
                  toggleWatchlist(selected.id)
                  setNotice(alreadySaved ? 'Removed from watchlist.' : 'Added to watchlist.')
                }}>
                  <Bookmark size={16} /> Watchlist
                </button>
              </div>
              <p className="fine-print">
                This discovery demo does not host full movies. Watching options depend on verified legal providers and regional availability.
              </p>
            </div>
          </div>
        </div>
      )}

      {notice && (
        <div className="toast" role="status">
          {notice}
          <button onClick={() => setNotice('')}><X size={15} /></button>
        </div>
      )}

      <button className="floating-search" onClick={() => {
        document.getElementById('search')?.focus()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }} aria-label="Search catalog">
        <Search />
      </button>
    </div>
  )
}

export default App
