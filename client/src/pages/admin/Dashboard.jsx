import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { errMsg } from "../../api.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { BarChart, MeterList, monthLabel } from "../../components/Charts.jsx";
import {
  Cover,
  Icon,
  Modal,
  StatusBadge,
  fmtDate,
  money,
  useToast,
} from "../../components/ui.jsx";

const METHOD = { esewa: "eSewa", khalti: "Khalti", cash: "Cash at counter" };

function Tile({ to, label, value, tone }) {
  const body = (
    <>
      <span className="num">{value}</span>
      <span className="lbl">{label}</span>
    </>
  );
  return to ? (
    <Link to={to} className={tone || ""}>
      {body}
    </Link>
  ) : (
    <div className={tone || ""}>{body}</div>
  );
}

export default function Dashboard() {
  const { user, can, isAdmin } = useAuth();
  const toast = useToast();
  const [s, setS] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState("");
  const load = useCallback(
    () =>
      api
        .get("/admin/stats")
        .then((r) => setS(r.data))
        .catch((e) => toast(errMsg(e), "err")),
    [],
  );
  useEffect(() => {
    load();
  }, [load]);

  if (!s) return <div className="splash">Loading…</div>;
  const approve = async (id) => {
    try {
      await api.patch(`/rentals/${id}/approve`);
      toast("Request approved");
      load();
    } catch (e) {
      toast(errMsg(e), "err");
    }
  };
  const reject = async () => {
    try {
      await api.patch(`/rentals/${rejecting}/reject`, { reason });
      toast("Request rejected");
      setRejecting(null);
      setReason("");
      load();
    } catch (e) {
      toast(errMsg(e), "err");
    }
  };

  return (
    <>
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">
            {isAdmin ? "Library command centre" : "Today at BookHub"}
          </p>
          <h1>Hello, {user.name.split(" ")[0]}</h1>
          <p>
            Keep the shelves moving, requests clear, and every reader looked
            after.
          </p>
        </div>
        <div className="dashboard-actions">
          <button className="btn" onClick={load}>
            <Icon name="refresh" size={15} /> Refresh
          </button>
          <Link className="btn primary" to="/">
            View storefront
          </Link>
        </div>
      </section>

      <section className="quick-actions" aria-label="Quick actions">
        {can("rentals") && (
          <Link to="/admin/rentals" className="quick-action">
            <span className="quick-icon">
              <Icon name="clipboard" />
            </span>
            <span>
              <b>Process requests</b>
              <small>Approve, hand over, return</small>
            </span>
            <span className="quick-arrow">→</span>
          </Link>
        )}
        {can("books") && (
          <Link to="/admin/books" className="quick-action">
            <span className="quick-icon">
              <Icon name="plus" />
            </span>
            <span>
              <b>Add a title</b>
              <small>Grow the collection</small>
            </span>
            <span className="quick-arrow">→</span>
          </Link>
        )}
        {can("books") && (
          <Link to="/admin/inventory?filter=low" className="quick-action">
            <span className="quick-icon">
              <Icon name="box" />
            </span>
            <span>
              <b>Check stock</b>
              <small>Restock low shelves</small>
            </span>
            <span className="quick-arrow">→</span>
          </Link>
        )}
        {can("members") && (
          <Link to="/admin/customers" className="quick-action">
            <span className="quick-icon">
              <Icon name="members" />
            </span>
            <span>
              <b>Find a reader</b>
              <small>Manage memberships</small>
            </span>
            <span className="quick-arrow">→</span>
          </Link>
        )}
      </section>

      {s.lowStock > 0 && can("books") && (
        <div className="alert warn-alert">
          {s.lowStock} {s.lowStock === 1 ? "title is" : "titles are"} running
          low ({s.outOfStock} fully out).{" "}
          <Link to="/admin/inventory?filter=low">Open inventory</Link>
        </div>
      )}

      <div className="ledger">
        <Tile
          to={can("rentals") ? "/admin/rentals" : undefined}
          label="New requests"
          value={s.pending}
          tone={s.pending ? "hot" : ""}
        />
        <Tile label="Awaiting payment" value={s.awaitingPayment} />
        <Tile label="To hand over" value={s.ready} />
        <Tile label="With readers" value={s.active} />
        <Tile label="Overdue" value={s.overdue} tone={s.overdue ? "bad" : ""} />
        <Tile label="Titles" value={s.titles} />
        <Tile label="Customers" value={s.customers} />
      </div>

      {s.revenue && (
        <>
          <div className="ledger money">
            <Tile label="Total revenue" value={money(s.revenue.total)} />
            <Tile label="Rental income" value={money(s.revenue.rentals)} />
            <Tile
              label="Late fees collected"
              value={money(s.revenue.lateFees)}
            />
            <Tile
              label="Late fees outstanding"
              value={money(s.revenue.outstandingLateFees)}
              tone={s.revenue.outstandingLateFees ? "bad" : ""}
            />
          </div>

          <div className="grid-2">
            <section className="panel">
              <div className="panel-head">
                <h2>Revenue, last 6 months</h2>
              </div>
              <BarChart
                data={s.months.map((m) => ({
                  label: monthLabel(m),
                  value: m.revenue,
                }))}
                format={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v)}
              />
            </section>
            <section className="panel">
              <div className="panel-head">
                <h2>Rental requests, last 6 months</h2>
              </div>
              <BarChart
                data={s.months.map((m) => ({
                  label: monthLabel(m),
                  value: m.rentals,
                }))}
              />
            </section>
          </div>

          <div className="grid-3">
            <section className="panel">
              <div className="panel-head">
                <h2>Revenue by payment method</h2>
              </div>
              <MeterList
                items={s.byMethod.map((m) => ({
                  label: METHOD[m.method] || m.method,
                  value: m.total,
                }))}
                format={money}
              />
            </section>
            <section className="panel">
              <div className="panel-head">
                <h2>Most rented books</h2>
              </div>
              <MeterList
                items={s.topBooks.map((b) => ({
                  label: b.title,
                  value: b.rentals,
                }))}
              />
            </section>
            <section className="panel">
              <div className="panel-head">
                <h2>Popular genres</h2>
              </div>
              <MeterList
                items={s.topCategories.map((c) => ({
                  label: c.name,
                  value: c.count,
                }))}
              />
            </section>
          </div>
        </>
      )}

      <div className="grid-2">
        <section className="panel">
          <div className="panel-head">
            <h2>Requests waiting for you</h2>
            {can("rentals") && (
              <Link to="/admin/rentals" className="btn sm">
                All rentals
              </Link>
            )}
          </div>
          {s.recentRequests.length === 0 ? (
            <p className="muted pad">No pending requests.</p>
          ) : (
            <ul className="feed">
              {s.recentRequests.map((r) => (
                <li key={r._id}>
                  <span>
                    <strong>{r.book?.title}</strong>
                    <small>
                      {r.user?.name} · {r.days} days · {fmtDate(r.createdAt)}
                    </small>
                  </span>
                  {can("rentals") && (
                    <span className="row-actions">
                      <button
                        className="btn sm primary"
                        onClick={() => approve(r._id)}
                      >
                        Approve
                      </button>
                      <button
                        className="btn sm"
                        onClick={() => setRejecting(r._id)}
                      >
                        Reject
                      </button>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="panel">
          <div className="panel-head">
            <h2>Low stock</h2>
            {can("books") && (
              <Link to="/admin/inventory" className="btn sm">
                Inventory
              </Link>
            )}
          </div>
          {s.lowList.length === 0 ? (
            <p className="muted pad">Every title is comfortably stocked.</p>
          ) : (
            <ul className="feed">
              {s.lowList.map((b) => (
                <li key={b._id}>
                  <span className="with-thumb">
                    <span className="thumb">
                      <Cover book={b} />
                    </span>
                    <span>
                      <strong>{b.title}</strong>
                      <small>Alert at {b.lowStockThreshold} or fewer</small>
                    </span>
                  </span>
                  <span
                    className={`badge ${b.availableCopies === 0 ? "overdue" : "pending"}`}
                  >
                    {b.availableCopies} of {b.totalCopies}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      {!s.revenue && (
        <p className="muted">
          Revenue and analytics are visible to accounts with the reports
          permission.
        </p>
      )}

      {rejecting && (
        <Modal title="Reject request" onClose={() => setRejecting(null)}>
          <label>
            Reason shown to the reader
            <textarea
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. This copy is reserved for a class"
            />
          </label>
          <div className="form-actions">
            <button className="btn" onClick={() => setRejecting(null)}>
              Back
            </button>
            <button className="btn primary" onClick={reject}>
              Reject request
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
