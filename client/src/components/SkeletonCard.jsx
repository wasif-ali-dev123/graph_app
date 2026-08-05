export default function SkeletonCard({ lines = 3 }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div className="skeleton" style={{ height: 16, width: '60%' }} />
      <div className="skeleton" style={{ height: 12, width: '40%' }} />
      {Array.from({ length: lines - 2 }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 12, width: `${70 + i * 5}%` }} />
      ))}
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: 20, width: 60, borderRadius: 99 }} />
        ))}
      </div>
    </div>
  );
}
