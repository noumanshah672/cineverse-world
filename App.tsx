import { useMemo, useState } from 'react'
import { Search, Film, Clapperboard, Sparkles, Bookmark, Play, Globe2, ChevronDown, Menu, X, Clock3, Languages, ExternalLink } from 'lucide-react'
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

  const filtered = useMemo(() => movies.filter(m => {
    const text = `${m.title} ${m.language} ${m.genre} ${m.region} ${m.description}`.toLowerCase()
    const matchesQuery = text.includes(query.toLowerCase())
    const matchesCategory = category === 'All' || (category === 'Movies' && m.type === 'Movie') || (category === 'Series' && m.type === 'Series') || (category === 'Anime' && m.type === 'Anime') || (category === 'Punjabi' && m.language === 'Punjabi') || (category === 'Recently Added' && m.id >= 13)
    return matchesQuery && matchesCategory && (language === 'All languages' || m.language === language) && (genre === 'All genres' || m.genre.toLowerCase().includes(genre.toLowerCase()))
  }), [query, category, language, genre])

  const toggleWatchlist = (id: number) => setWatchlist(old => old.includes(id) ? old.filter(x => x !== id) : [...old, id])
  const featured = movies.find(m => m.id === 7)!
  const openWatch = (movie: Movie) => {
    setSelected(movie)
    setNotice('')
  }
  const genres = ['All genres', ...Array.from(new Set(movies.map(m => m.genre.split(' / ')[0]))).sort()]
  const languages = ['All languages', ...Array.from(new Set(movies.map(m => m.language))).sort()]

  const Card = ({ movie }: { movie: Movie }) => (
    <article className="movie-card">
      <button className="poster" onClick={() => setSelected(movie)} aria-label={`View ${movie.title}`}>
        {movie.poster ? <img src={movie.poster} alt={`${movie.title} poster`} onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.parentElement?.classList.add('fallback') }} /> : null}
        <div className="poster-fallback"><Film size={32}/><span>{movie.title}</span></div>
        <span className="type-tag">{movie.type}</span>
        <span className="play-overlay"><Play fill="currentColor" size={22}/></span>
      </button>
      <div className="card-info">
        <div className="card-title-row"><h3>{movie.title}</h3><button className={`bookmark ${watchlist.includes(movie.id) ? 'saved' : ''}`} onClick={() => toggleWatchlist(movie.id)} aria-label="Toggle watchlist"><Bookmark size={16} fill={watchlist.includes(movie.id) ? 'currentColor' : 'none'}/></button></div>
        <p>{movie.year} <span>•</span> {movie.language} <span>•</span> {movie.region}</p>
        <button className="text-link" onClick={() => setSelected(movie)}>Details <ExternalLink size={13}/></button>
      </div>
    </article>
  )

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={() => { setCategory('All'); setQuery('') }}><span className="brand-icon"><Clapperboard size={23}/></span><span>CINEVERSE <b>WORLD</b><small>YOUR GLOBAL SCREEN</small></span></button>
      <nav className={mobileMenu ? 'nav open' : 'nav'}>
        {['Discover','Movies','Series','Anime','Punjabi'].map(item => <button key={item} className={(item === 'Discover' ? category === 'All' : category === item) ? 'nav-active' : ''} onClick={() => { setCategory(item === 'Discover' ? 'All' : item); setVisibleCount(12); setMobileMenu(false) }}>{item}</button>)}
      </nav>
      <div className="top-actions"><button className="icon-button" onClick={() => document.getElementById('search')?.focus()} aria-label="Search"><Search/></button><button className="menu-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Menu">{mobileMenu ? <X/> : <Menu/>}</button></div>
    </header>

    <main>
      <section className="hero">
        <div className="hero-art"><div className="orb orb-one"/><div className="orb orb-two"/><div className="hero-grid"/></div>
        <div className="hero-content">
          <div className="eyebrow"><span className="live-dot"/> YOUR WORLD OF ENTERTAINMENT</div>
          <h1>One world.<br/><em>Every story.</em></h1>
          <p>Explore movies, series, dramas and anime from every corner of the world — including Punjabi cinema.</p>
          <div className="hero-actions"><button className="primary-button" onClick={() => document.getElementById('catalog')?.scrollIntoView({behavior:'smooth'})}><Sparkles size={17}/> Explore catalog</button><button className="secondary-button" onClick={() => {setCategory('Punjabi'); document.getElementById('catalog')?.scrollIntoView({behavior:'smooth'})}}>Punjabi movies <span>→</span></button></div>
          <div className="hero-stats"><span><Globe2 size={15}/> Worldwide discovery</span><span><Languages size={15}/> Multiple languages</span><span><Film size={15}/> Curated catalog</span></div>
        </div>
        <div className="hero-feature">
          <div className="feature-poster"><div className="feature-glow"/><span className="feature-label">FEATURED • PUNJABI CINEMA</span><div className="feature-copy"><span>PAKISTANI PUNJABI</span><h2>The Legend of<br/>Maula Jatt</h2><p>2022 · Action / Drama</p><button className="feature-play" onClick={() => openWatch(featured)}><Play size={15} fill="currentColor"/> Explore title</button></div></div>
        </div>
      </section>

      <section className="benefit-strip"><div><span className="benefit-icon"><Search/></span><span><b>Discover more</b><small>Search the available catalog</small></span></div><div><span className="benefit-icon"><Bookmark/></span><span><b>Your watchlist</b><small>{watchlist.length} saved title{watchlist.length===1?'':'s'}</small></span></div><div><span className="benefit-icon"><Clock3/></span><span><b>Release information</b><small>Dates shown when available</small></span></div></section>

      <section className="catalog-section" id="catalog">
        <div className="section-heading"><div><span className="eyebrow">FIND YOUR NEXT FAVORITE</span><h2>Explore the <em>catalog</em></h2><p>Browse available titles across languages, regions and genres.</p></div><div className="catalog-count">{filtered.length} <span>titles in this demo catalog</span></div></div>
        <div className="search-row"><label className="search-box"><Search size={18}/><input id="search" value={query} onChange={e=>{setQuery(e.target.value);setVisibleCount(12)}} placeholder="Search titles, languages, genres..."/>{query && <button onClick={()=>setQuery('')} aria-label="Clear search"><X size={15}/></button>}</label><label className="select-wrap"><Languages size={16}/><select value={language} onChange={e=>{setLanguage(e.target.value);setVisibleCount(12)}}>{languages.map(l=><option key={l}>{l}</option>)}</select><ChevronDown size={15}/></label><label className="select-wrap"><Film size={16}/><select value={genre} onChange={e=>{setGenre(e.target.value);setVisibleCount(12)}}>{genres.map(g=><option key={g}>{g}</option>)}</select><ChevronDown size={15}/></label></div>
        <div className="category-tabs">{categories.map(c=><button key={c} className={category===c?'selected':''} onClick={()=>{setCategory(c);setVisibleCount(12)}}>{c==='Punjabi'?'Punjabi Cinema':c}</button>)}</div>
        {filtered.length ? <div className="movie-grid">{filtered.slice(0,visibleCount).map(m=><Card key={m.id} movie={m}/>)}</div> : <div className="empty-state"><Film size={32}/><h3>No titles found</h3><p>Try a different search term or clear your filters.</p><button className="secondary-button" onClick={()=>{setQuery('');setCategory('All');setLanguage('All languages');setGenre('All genres')}}>Clear filters</button></div>}
        {filtered.length>visibleCount && <button className="load-more" onClick={()=>setVisibleCount(c=>c+12)}>Load more titles <span>↓</span></button>}
      </section>

      <section className="membership">
        <div><span className="eyebrow">CINEVERSE PLUS</span><h2>Make it your <em>world.</em></h2><p>Choose a membership plan for additional discovery features. Prices are configurable; streaming rights are separate.</p></div>
        <div className="price-grid">{[{name:'Monthly',duration:'1 month',price:'499'},{name:'Quarterly',duration:'3 months',price:'1,299'},{name:'Half-Yearly',duration:'6 months',price:'2,299'},{name:'Annual',duration:'1 year',price:'3,999'}].map((p,i)=><div className={`price-card ${i===3?'popular':''}`} key={p.name}>{i===3&&<span className="popular-label">LONG-TERM</span>}<h3>{p.name}</h3><p>{p.duration}</p><div className="price"><small>PKR</small> {p.price}</div><button onClick={()=>setNotice(`Selected ${p.name} plan (PKR ${p.price}). Configure your real Easypaisa receiving details and secure manual verification before accepting payments.`)}>Choose plan</button></div>)}</div>
      </section>
    </main>

    <footer><div className="footer-brand"><span className="brand-icon"><Clapperboard size={20}/></span><span>CINEVERSE <b>WORLD</b><small>YOUR GLOBAL SCREEN</small></span></div><p>Discover stories from around the world.</p><small>Demo catalog · Streaming availability varies by region. Only use authorized video sources.</small><div className="footer-links"><a href="#catalog">Discover</a><a href="#catalog" onClick={()=>setCategory('Punjabi')}>Punjabi Cinema</a><a href="#catalog">Catalog</a></div></footer>

    {selected && <div className="modal-backdrop" onClick={()=>setSelected(null)}><div className="detail-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setSelected(null)} aria-label="Close"><X/></button><div className="modal-art"><Film size={44}/><span>{selected.language} CINEMA</span></div><div className="modal-body"><span className="eyebrow">{selected.region.toUpperCase()} · {selected.type.toUpperCase()}</span><h2>{selected.title}</h2><p className="modal-meta">{selected.year} · {selected.language} · {selected.genre}</p><p>{selected.description}</p><div className="modal-actions"><button className="primary-button" onClick={()=>selected.trailerUrl ? window.open(selected.trailerUrl,'_blank','noopener,noreferrer') : setNotice('No verified trailer has been configured for this title yet.')}><Play size={16} fill="currentColor"/> Find official trailer</button><button className="secondary-button" onClick={()=>{toggleWatchlist(selected.id);setNotice(watchlist.includes(selected.id)?'Removed from watchlist.':'Added to watchlist.')}}><Bookmark size={16}/> Watchlist</button></div><p className="fine-print">This discovery demo does not host full movies. Watching options depend on verified legal providers and regional availability.</p></div></div></div>}
    {notice && <div className="toast" role="status">{notice}<button onClick={()=>setNotice('')}><X size={15}/></button></div>}
    <button className="floating-search" onClick={()=>document.getElementById('search')?.focus()} aria-label="Search catalog"><Search/></button>
  </div>
}
export default App
