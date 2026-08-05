import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as d3 from 'd3';

const NODE_COLORS = {
  Engineer: '#58A6FF',
  Skill: '#3FB950',
  Company: '#A371F7',
};

const NODE_RADIUS = {
  Engineer: 18,
  Skill: 13,
  Company: 15,
};

export default function EgoGraph({ engineer }) {
  const svgRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!engineer || !svgRef.current) return;

    const el = svgRef.current;
    const width = el.clientWidth || 700;
    const height = 420;

    d3.select(el).selectAll('*').remove();

    // Build nodes and links from engineer data
    const nodes = [];
    const links = [];

    // Center: the engineer
    const center = { id: engineer.id, label: engineer.name, type: 'Engineer', isCenter: true };
    nodes.push(center);

    // Skills
    (engineer.skills || []).filter(s => s.name).forEach((s) => {
      const id = `skill-${s.name}`;
      nodes.push({ id, label: s.name, type: 'Skill', sub: s.level });
      links.push({ source: engineer.id, target: id, label: 'HAS_SKILL' });
    });

    // Companies (from experience)
    const seen = new Set();
    (engineer.experience || []).filter(e => e.company).forEach((exp) => {
      if (seen.has(exp.company)) return;
      seen.add(exp.company);
      const id = `co-${exp.company}`;
      nodes.push({ id, label: exp.company, type: 'Company', sub: exp.role });
      links.push({ source: engineer.id, target: id, label: 'WORKED_AT' });
    });

    // Connected engineers
    (engineer.connections || []).filter(c => c.name).slice(0, 6).forEach((c) => {
      nodes.push({ id: c.id, label: c.name, type: 'Engineer', sub: c.title, navigable: true });
      links.push({ source: engineer.id, target: c.id, label: 'KNOWS' });
    });

    const svg = d3.select(el)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', height);

    // Defs: arrowhead marker
    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -4 8 8')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-4L8,0L0,4')
      .attr('fill', '#30363D');

    const g = svg.append('g');

    // Zoom
    svg.call(d3.zoom()
      .scaleExtent([0.4, 3])
      .on('zoom', (event) => g.attr('transform', event.transform))
    );

    // Simulation
    const sim = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(d => {
        if (d.label === 'KNOWS') return 140;
        if (d.label === 'WORKED_AT') return 110;
        return 90;
      }).strength(0.7))
      .force('charge', d3.forceManyBody().strength(-320))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => NODE_RADIUS[d.type] + 20));

    // Links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#30363D')
      .attr('stroke-width', 1.5)
      .attr('marker-end', 'url(#arrow)');

    // Edge labels
    const edgeLabel = g.append('g')
      .selectAll('text')
      .data(links)
      .join('text')
      .attr('font-family', 'IBM Plex Mono, monospace')
      .attr('font-size', 9)
      .attr('fill', '#484F58')
      .attr('text-anchor', 'middle');

    // Node groups
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('cursor', d => (d.navigable || d.isCenter) ? 'pointer' : 'default')
      .call(d3.drag()
        .on('start', (event, d) => {
          if (!event.active) sim.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on('end', (event, d) => {
          if (!event.active) sim.alphaTarget(0);
          d.fx = null; d.fy = null;
        })
      )
      .on('click', (_event, d) => {
        if (d.type === 'Engineer' && d.id !== engineer.id) {
          navigate(`/engineer/${d.id}`);
        }
      });

    // Circle
    node.append('circle')
      .attr('r', d => d.isCenter ? NODE_RADIUS[d.type] + 4 : NODE_RADIUS[d.type])
      .attr('fill', d => NODE_COLORS[d.type] + (d.isCenter ? '' : '22'))
      .attr('stroke', d => NODE_COLORS[d.type])
      .attr('stroke-width', d => d.isCenter ? 2.5 : 1.5);

    // Node label (name)
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', d => NODE_RADIUS[d.type] + 14)
      .attr('font-family', 'IBM Plex Mono, monospace')
      .attr('font-size', d => d.isCenter ? 11 : 10)
      .attr('font-weight', d => d.isCenter ? 600 : 400)
      .attr('fill', d => d.isCenter ? '#E6EDF3' : NODE_COLORS[d.type])
      .text(d => d.label.length > 16 ? d.label.slice(0, 14) + '…' : d.label);

    // Node type badge inside circle
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-family', 'IBM Plex Mono, monospace')
      .attr('font-size', d => d.isCenter ? 9 : 8)
      .attr('fill', d => NODE_COLORS[d.type])
      .text(d => d.type === 'Engineer' ? '◎' : d.type === 'Skill' ? '⬡' : '⬟');

    sim.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const r = NODE_RADIUS[d.target.type] + (d.target.isCenter ? 4 : 0);
          return d.target.x - (dx / dist) * (r + 8);
        })
        .attr('y2', d => {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const r = NODE_RADIUS[d.target.type] + (d.target.isCenter ? 4 : 0);
          return d.target.y - (dy / dist) * (r + 8);
        });

      edgeLabel
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2 - 5);

      edgeLabel.text(d => d.label);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    return () => sim.stop();
  }, [engineer, navigate]);

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius)',
      overflow: 'hidden',
      marginBottom: 32,
    }}>
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 1 }}>
          Ego Graph
        </span>
        <div style={{ display: 'flex', gap: 12 }}>
          {[['◎', '#58A6FF', 'Engineer'], ['⬡', '#3FB950', 'Skill'], ['⬟', '#A371F7', 'Company']].map(([icon, color, label]) => (
            <span key={label} style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color }}>{icon}</span> {label}
            </span>
          ))}
        </div>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text-dim)' }}>drag · scroll to zoom · click engineer to navigate</span>
      </div>
      <svg ref={svgRef} style={{ display: 'block', width: '100%' }} />
    </div>
  );
}
