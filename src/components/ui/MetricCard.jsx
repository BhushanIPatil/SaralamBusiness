export default function MetricCard({ label, value, subtext, color = '#2563eb' }) {
  return (
    <div className="mc" style={{ borderTopColor: color }}>
      <div className="mc-lbl">{label}</div>
      <div className="mc-val" style={{ color }}>
        {value}
      </div>
      {subtext ? <div className="mc-sub">{subtext}</div> : null}
    </div>
  );
}
