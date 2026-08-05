export default function NodeBadge({ nodes }) {
  // nodes: [{label, value, color}]
  const colorMap = {
    Engineer: 'tag-blue',
    Skill: 'tag-green',
    Company: 'tag-purple',
    Project: 'tag-orange',
  };

  return (
    <span className="node-badge">
      {nodes.map((n, i) => (
        <span key={i}>
          <span className={`nb-node ${colorMap[n.label] || 'tag-muted'}`}>
            {n.value}
          </span>
          {i < nodes.length - 1 && (
            <span className="nb-edge">──▶</span>
          )}
        </span>
      ))}
    </span>
  );
}
