import { Link } from 'react-router-dom';
import NodeBadge from './NodeBadge.jsx';
import './EngineerCard.css';

const levelColor = { junior: 'tag-muted', mid: 'tag-green', senior: 'tag-blue' };

export default function EngineerCard({ engineer }) {
  const topSkills = (engineer.skills || [])
    .filter(s => s.name)
    .sort((a, b) => (b.years || 0) - (a.years || 0))
    .slice(0, 4);

  const primaryCompany = (engineer.companies || []).filter(Boolean)[0];

  return (
    <Link to={`/engineer/${engineer.id}`} style={{ textDecoration: 'none' }}>
      <div className="card engineer-card">
        <div className="ec-header">
          <div className="ec-avatar" aria-hidden>
            {engineer.name?.split(' ').map(w => w[0]).join('').slice(0, 2)}
          </div>
          <div className="ec-meta">
            <div className="ec-name">{engineer.name}</div>
            <div className="ec-title">{engineer.title}</div>
            <div className="ec-location">
              <span style={{ color: 'var(--text-dim)' }}>◎</span> {engineer.location}
            </div>
          </div>
        </div>

        {primaryCompany && (
          <div style={{ marginBottom: 10 }}>
            <NodeBadge nodes={[
              { label: 'Engineer', value: engineer.name?.split(' ')[0] },
              { label: 'Company', value: primaryCompany },
            ]} />
          </div>
        )}

        <div className="ec-skills">
          {topSkills.map((s) => (
            <span key={s.name} className={`tag ${levelColor[s.level] || 'tag-muted'}`}>
              {s.name}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
