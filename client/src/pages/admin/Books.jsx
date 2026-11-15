import { useCallback, useEffect, useRef, useState } from "react";
import api, { errMsg, fileUrl } from "../../api.js";
import {
  Cover,
  Empty,
  Icon,
  Modal,
  Pagination,
  Stars,
  fmtDate,
  useDebounce,
  useToast,
} from "../../components/ui.jsx";

const blank = {
  title: "",
  author: "",
  isbn: "",
  description: "",
  publishedDate: "",
  language: "English",
  publisher: "",
  shelf: "",
  totalCopies: 1,
  pricePerDay: 10,
  lowStockThreshold: 2,
  genre: [],
  image: "",
};
const dateInput = (d) => (d ? new Date(d).toISOString().slice(0, 10) : "");

function BookForm({ book, genres, onGenreAdded, onClose, onSaved }) {
  const toast = useToast();
  const [f, setF] = useState(
    book
      ? {
          ...blank,
          ...book,
          genre: book.genre.map((g) => g._id),
          publishedDate: dateInput(book.publishedDate),
          image: "",
        }
      : blank,
  );
  const [file, setFile] = useState(null);
  const [newGenre, setNewGenre] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const preview = file
    ? URL.createObjectURL(file)
    : f.image || (book ? fileUrl(book.image) : "");

  const pick = (e) => {
    const picked = e.target.files[0];
    if (!picked) return;
    if (picked.size > 3 * 1024 * 1024) {
      toast("Image must be under 3 MB", "err");
      e.target.value = "";
      return;
    }
    setFile(picked);
  };
  const toggleGenre = (id) =>
    setF({
      ...f,
      genre: f.genre.includes(id)
        ? f.genre.filter((x) => x !== id)
        : [...f.genre, id],
    });
  const addGenre = async () => {
    if (!newGenre.trim()) return;
    try {
      const { data } = await api.post("/genres", { name: newGenre.trim() });
      onGenreAdded();
      setF({ ...f, genre: [...f.genre, data.data._id] });
      setNewGenre("");
    } catch (err) {
      toast(errMsg(err), "err");
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!preview) return toast("Add a cover image", "err");
    if (f.genre.length === 0) return toast("Choose at least one genre", "err");
    setBusy(true);
    try {
      const fd = new FormData();
      [
        "title",
        "author",
        "isbn",
        "description",
        "publishedDate",
        "language",
        "publisher",
        "shelf",
        "totalCopies",
        "pricePerDay",
        "lowStockThreshold",
      ].forEach((k) => fd.append(k, f[k] ?? ""));
      f.genre.forEach((g) => fd.append("genre", g));
      if (file) fd.append("image", file);
      else if (f.image) fd.append("image", f.image);
      if (book) await api.put(`/books/${book._id}`, fd);
      else await api.post("/books", fd);
      toast(book ? "Book updated" : "Book added to the shop");
      onSaved();
    } catch (err) {
      toast(errMsg(err), "err");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title={book ? "Edit book" : "Add a book"} onClose={onClose} wide>
      <form onSubmit={submit} className="book-form">
        <div className="cover-pick">
          <div className="cover-preview">
            {preview ? (
              <img src={preview} alt="Cover preview" />
            ) : (
              <span>No cover yet</span>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={pick}
            hidden
          />
          <button
            type="button"
            className="btn sm"
            onClick={() => fileRef.current.click()}
          >
            {preview ? "Change image" : "Upload cover"}
          </button>
          <small>JPG, PNG or WebP, up to 3 MB</small>
          {!file && (
            <label>
              or image URL
              <input
                value={f.image}
                onChange={set("image")}
                placeholder="https://…"
              />
            </label>
          )}
        </div>
        <div className="form-grid">
          <label className="span2">
            Title
            <input required value={f.title} onChange={set("title")} />
          </label>
          <label>
            Author
            <input required value={f.author} onChange={set("author")} />
          </label>
          <label>
            ISBN
            <input required value={f.isbn || ""} onChange={set("isbn")} />
          </label>
          <label>
            Published
            <input
              type="date"
              required
              value={f.publishedDate}
              onChange={set("publishedDate")}
            />
          </label>
          <label>
            Language
            <input value={f.language} onChange={set("language")} />
          </label>
          <fieldset className="span2 genre-pick">
            <legend>Genres (pick one or more)</legend>
            <div>
              {genres.map((g) => (
                <button
                  type="button"
                  key={g._id}
                  className={f.genre.includes(g._id) ? "on" : ""}
                  onClick={() => toggleGenre(g._id)}
                  aria-pressed={f.genre.includes(g._id)}
                >
                  {g.name}
                </button>
              ))}
              <span className="new-genre">
                <input
                  placeholder="New genre"
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addGenre())
                  }
                  aria-label="New genre name"
                />
                <button type="button" className="btn sm" onClick={addGenre}>
                  Add
                </button>
              </span>
            </div>
          </fieldset>
          <label>
            Rent per day (Rs)
            <input
              type="number"
              min="0"
              step="0.5"
              required
              value={f.pricePerDay}
              onChange={set("pricePerDay")}
            />
          </label>
          <label>
            Total copies
            <input
              type="number"
              min="1"
              required
              value={f.totalCopies}
              onChange={set("totalCopies")}
            />
          </label>
          <label>
            Low-stock alert at
            <input
              type="number"
              min="0"
              value={f.lowStockThreshold}
              onChange={set("lowStockThreshold")}
            />
          </label>
          <label>
            Shelf
            <input
              value={f.shelf || ""}
              onChange={set("shelf")}
              placeholder="e.g. A-3"
            />
          </label>
          <label className="span2">
            Publisher
            <input value={f.publisher || ""} onChange={set("publisher")} />
          </label>
          <label className="span2">
            Description
            <textarea
              required
              rows="3"
              value={f.description || ""}
              onChange={set("description")}
            />
          </label>
        </div>
        <div className="span-all form-actions">
          <button type="button" className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" disabled={busy}>
            {busy ? "Saving…" : "Save book"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function Books() {
  const toast = useToast();
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [res, setRes] = useState({ data: [], total: 0, pages: 1, page: 1 });
  const [genres, setGenres] = useState([]);
  const [editing, setEditing] = useState(null);
  const dq = useDebounce(q);

  const loadGenres = useCallback(
    () => api.get("/genres").then((r) => setGenres(r.data.data)),
    [],
  );
  const load = useCallback(() => {
    api
      .get("/books", { params: { q: dq, page, limit: 10, sort: "newest" } })
      .then((r) => setRes(r.data))
      .catch((e) => toast(errMsg(e), "err"));
  }, [dq, page]);
  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    loadGenres();
  }, [loadGenres]);
  useEffect(() => setPage(1), [dq]);

  const remove = async (b) => {
    if (!confirm(`Delete "${b.title}" and its reviews?`)) return;
    try {
      await api.delete(`/books/${b._id}`);
      toast("Book deleted");
      load();
    } catch (e) {
      toast(errMsg(e), "err");
    }
  };

  return (
    <>
      <div className="page-head">
        <h1 className="page-title">Books in the shop</h1>
        <button className="btn primary" onClick={() => setEditing("new")}>
          <Icon name="plus" size={16} /> Add book
        </button>
      </div>
      <div className="toolbar">
        <div className="search">
          <Icon name="search" size={16} />
          <input
            placeholder="Search title, author, ISBN…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>
      <section className="panel">
        {res.data.length === 0 ? (
          <Empty
            title="No books yet"
            hint="Add your first book with a cover image, genre and a daily price."
          />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Genres</th>
                  <th>Published</th>
                  <th>Rent / day</th>
                  <th>Stock</th>
                  <th>Rating</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {res.data.map((b) => (
                  <tr key={b._id}>
                    <td>
                      <div className="with-thumb">
                        <span className="thumb">
                          <Cover book={b} />
                        </span>
                        <span>
                          <strong>{b.title}</strong>
                          <small>
                            {b.author} · {b.isbn}
                          </small>
                        </span>
                      </div>
                    </td>
                    <td>
                      {b.genre.map((g) => (
                        <span key={g._id} className="chip-sm">
                          {g.name}
                        </span>
                      ))}
                      <small>{b.language}</small>
                    </td>
                    <td>{fmtDate(b.publishedDate)}</td>
                    <td>Rs {b.pricePerDay}</td>
                    <td>
                      <span
                        className={`badge ${b.availableCopies === 0 ? "overdue" : b.availableCopies <= b.lowStockThreshold ? "pending" : "ready"}`}
                      >
                        {b.availableCopies} of {b.totalCopies}
                      </span>
                    </td>
                    <td>
                      <Stars
                        value={b.avgRating}
                        count={b.reviewCount}
                        size={12}
                      />
                    </td>
                    <td className="actions">
                      <button className="btn sm" onClick={() => setEditing(b)}>
                        Edit
                      </button>
                      <button
                        className="btn sm danger"
                        onClick={() => remove(b)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination
          page={res.page}
          pages={res.pages}
          total={res.total}
          onChange={setPage}
        />
      </section>
      {editing && (
        <BookForm
          book={editing === "new" ? null : editing}
          genres={genres}
          onGenreAdded={loadGenres}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
            loadGenres();
          }}
        />
      )}
    </>
  );
}
