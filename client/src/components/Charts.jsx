const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const monthLabel = (m) => MONTHS[m.month - 1];

export function BarChart({ data, format = (v) => v }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="bars" role="img" aria-label="Bar chart">
      {data.map((d) => (
        <div key={d.label} className="bar">
          <span className="bar-val">{format(d.value)}</span>
          <span className="bar-fill" style={{ height: `${(d.value / max) * 100}%` }} />
          <span className="bar-lbl">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function MeterList({ items, format = (v) => v }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  if (!items.length) return <p className="muted pad">Nothing to show yet.</p>;
  return (
    <ul className="meters">
      {items.map((i) => (
        <li key={i.label}>
          <div><span>{i.label}</span><b>{format(i.value)}</b></div>
          <i style={{ width: `${(i.value / max) * 100}%` }} />
        </li>
      ))}
    </ul>
  );
}
