import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../../api.js';
import { Empty, Icon, Modal, useToast } from '../../components/ui.jsx';

function GenreForm({ genre, onClose, onSaved }) {
  const toast = useToast();
  const [f, setF] = useState({ name: genre?.name || '', description: genre?.description || '' });
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (genre) await api.put(`/genres/${genre._id}`, f); else await api.post('/genres', f);
      toast(genre ? 'Genre updated' : 'Genre added');
      onSaved();
    } catch (err) { toast(errMsg(err), 'err'); } finally { setBusy(false); }
  };
  return (
    <Modal title={genre ? 'Edit genre' : 'Add a genre'} onClose={onClose}>
      <form onSubmit={submit} className="stack">
        <label>Name<input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
        <label>Short description (optional)<input value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></label>
        <div className="form-actions"><button type="button" className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button></div>
      </form>
    </Modal>
  );
}

export default function Genres() {
  const toast = useToast();
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const load = useCallback(() => api.get('/genres').then((r) => setList(r.data.data)).catch((e) => toast(errMsg(e), 'err')), []);
  useEffect(() => { load(); }, [load]);

  const remove = async (g) => {
    if (!confirm(`Delete the genre "${g.name}"?`)) return;
    try { await api.delete(`/genres/${g._id}`); toast('Genre deleted'); load(); } catch (e) { toast(errMsg(e), 'err'); }
  };

  return (
    <>
      <div className="page-head"><h1 className="page-title">Genres</h1><button className="btn primary" onClick={() => setEditing('new')}><Icon name="plus" size={16} /> Add genre</button></div>
      <p className="muted lead">Genres appear on the home page, the catalog filter and every book page.</p>
      <section className="panel">
        {list.length === 0 ? <Empty title="No genres yet" hint="Add a few genres, then assign them to books." /> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Genre</th><th>Titles</th><th /></tr></thead>
            <tbody>{list.map((g) => (
              <tr key={g._id}>
                <td><strong>{g.name}</strong>{g.description && <small>{g.description}</small>}</td>
                <td>{g.count}</td>
                <td className="actions">
                  <Link className="btn sm" to={`/books?genre=${g._id}`}>View in shop</Link>
                  <button className="btn sm" onClick={() => setEditing(g)}>Edit</button>
                  <button className="btn sm danger" onClick={() => remove(g)}>Delete</button>
                </td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
      </section>
      {editing && <GenreForm genre={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </>
  );
}
