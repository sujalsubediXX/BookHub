import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import BookCard from '../components/BookCard.jsx';
import { Empty, Icon, Pagination, useDebounce, useToast } from '../components/ui.jsx';

export default function Catalogue() {
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const [res, setRes] = useState({ data: [], total: 0, pages: 1, page: 1 });
  const [genres, setGenres] = useState([]);
  const [facets, setFacets] = useState({ languages: [], price: { min: 0, max: 0 } });
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(false);
  const get = (k) => params.get(k) || '';
  const [price, setPrice] = useState({ min: get('minPrice'), max: get('maxPrice') });

  // live search: type, and the URL follows after a short pause
  const [qLocal, setQLocal] = useState(get('q'));
  const dq = useDebounce(qLocal, 300);
  const applied = useRef(get('q'));

  const set = (k, v) => {
    const next = new URLSearchParams(params);
    v ? next.set(k, v) : next.delete(k);
    if (k !== 'page') next.delete('page');
    setParams(next);
  };

  useEffect(() => {
    if (dq !== get('q') && dq === qLocal) { applied.current = dq; set('q', dq); }
  }, [dq]);
  useEffect(() => { // header search or back button changed the URL
    if (get('q') !== applied.current) { applied.current = get('q'); setQLocal(get('q')); }
  }, [params]);

  useEffect(() => {
    api.get('/genres').then((r) => setGenres(r.data.data));
    api.get('/books/facets').then((r) => setFacets(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get('/books', { params: { ...Object.fromEntries(params), limit: 12 } })
      .then((r) => setRes(r.data)).catch((e) => toast(errMsg(e), 'err')).finally(() => setLoading(false));
  }, [params]);

  const extra = ['language', 'minRating', 'minPrice', 'maxPrice', 'available'].filter((k) => get(k)).length;
  const clear = () => { setQLocal(''); applied.current = ''; setParams({}); setPrice({ min: '', max: '' }); };
  const applyPrice = () => {
    const n = new URLSearchParams(params);
    price.min ? n.set('minPrice', price.min) : n.delete('minPrice');
    price.max ? n.set('maxPrice', price.max) : n.delete('maxPrice');
    n.delete('page');
    setParams(n);
  };
  const anyFilter = [...params.keys()].some((k) => k !== 'page' && k !== 'sort');

  return (
    <>
      <header className="page-intro">
        <div>
          <p className="eyebrow">The open shelves</p>
          <h1 className="display">Catalog</h1>
          <p className="lead-text">Search the collection, filter by genre, and open a title to see its full record and rent it.</p>
        </div>
        <div className="mono count">{String(res.total).padStart(2, '0')} TITLES FOUND</div>
      </header>

      <div className="catalog-bar">
        <label className="search-field">
          <Icon name="search" size={16} />
          <input value={qLocal} onChange={(e) => setQLocal(e.target.value)} placeholder="Search title, author, or ISBN" aria-label="Search the catalog" />
        </label>
        <select value={get('genre')} onChange={(e) => set('genre', e.target.value)} aria-label="Genre">
          <option value="">All genres</option>
          {genres.map((g) => <option key={g._id} value={g._id}>{g.name} ({g.count})</option>)}
        </select>
        <select value={get('sort') || 'newest'} onChange={(e) => set('sort', e.target.value)} aria-label="Sort">
          <option value="newest">Newest first</option><option value="title">Title A–Z</option><option value="author">Author A–Z</option>
          <option value="rating">Highest rated</option><option value="priceAsc">Price: low to high</option><option value="priceDesc">Price: high to low</option>
        </select>
        <button className={`btn ${more || extra ? 'on' : ''}`} onClick={() => setMore(!more)} aria-expanded={more}>More filters{extra > 0 && <em className="count-dot">{extra}</em>}</button>
      </div>

      {more && (
        <div className="more-filters">
          <label>Language
            <select value={get('language')} onChange={(e) => set('language', e.target.value)}>
              <option value="">Any language</option>{facets.languages.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label>Minimum rating
            <select value={get('minRating')} onChange={(e) => set('minRating', e.target.value)}>
              <option value="">Any rating</option><option value="4">4★ and up</option><option value="3">3★ and up</option><option value="2">2★ and up</option>
            </select>
          </label>
          <fieldset>
            <legend>Price per day (Rs)</legend>
            <div className="price-row">
              <input type="number" min="0" placeholder={String(facets.price.min)} value={price.min} onChange={(e) => setPrice({ ...price, min: e.target.value })} aria-label="Minimum price" />
              <span>to</span>
              <input type="number" min="0" placeholder={String(facets.price.max)} value={price.max} onChange={(e) => setPrice({ ...price, max: e.target.value })} aria-label="Maximum price" />
              <button className="btn sm" onClick={applyPrice}>Apply</button>
            </div>
          </fieldset>
          <label className="check"><input type="checkbox" checked={get('available') === 'true'} onChange={(e) => set('available', e.target.checked ? 'true' : '')} /> Available now</label>
        </div>
      )}

      {loading && res.data.length === 0 ? <div className="splash">Loading…</div> : res.data.length === 0 ? (
        <Empty title="No titles match that search." hint={anyFilter ? 'Try removing a filter.' : 'The catalog is empty for now.'} />
      ) : (
        <div className={`book-grid ${loading ? 'dim' : ''}`}>{res.data.map((b) => <BookCard key={b._id} book={b} />)}</div>
      )}
      {anyFilter && <p className="center"><button className="btn ghost sm" onClick={clear}>Clear all filters</button></p>}
      <Pagination page={res.page} pages={res.pages} total={res.total} onChange={(p) => set('page', String(p))} />
    </>
  );
}
