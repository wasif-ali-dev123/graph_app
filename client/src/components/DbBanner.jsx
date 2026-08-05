export default function DbBanner({ error }) {
  if (!error) return null;
  const isDb = error.toLowerCase().includes('database') || error.toLowerCase().includes('unavailable');
  return (
    <div style={{
      background: 'rgba(240,136,62,0.1)',
      border: '1px solid rgba(240,136,62,0.3)',
      borderRadius: 'var(--radius)',
      padding: '12px 16px',
      marginBottom: '24px',
      color: 'var(--orange)',
      fontFamily: 'var(--mono)',
      fontSize: '13px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    }}>
      <span>⚠</span>
      <span>
        {isDb
          ? 'Database is warming up — this is normal on free-tier CognoDB. Try again in 10 seconds.'
          : `Error: ${error}`}
      </span>
    </div>
  );
}
