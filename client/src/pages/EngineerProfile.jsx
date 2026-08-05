import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api.js';
import NodeBadge from '../components/NodeBadge.jsx';
import DbBanner from '../components/DbBanner.jsx';
import EgoGraph from '../components/EgoGraph.jsx';
import './EngineerProfile.css';

const levelColor = { junior: 'tag-muted', mid: 'tag-green', senior: 'tag-blue' };

export default function EngineerProfile() {
  const { id } = useParams();
  const [engineer, setEngineer] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skillsShown, setSkillsShown] = useState(5);
  const [expShown, setExpShown] = useState(3);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.engineers.get(id), api.engineers.related(id)])
      .then(([eng, rel]) => {
        setEngineer(eng);
        setRelated(rel);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="profile-loading">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: i === 0 ? 120 : 60, marginBottom: 16, borderRadius: 8 }} />
        ))}
      </div>
    );
  }

  if (error) return <DbBanner error={error} />;

  if (!engineer) {
    return (
      <div className="empty" style={{ textAlign: 'center', padding: '60px 0' }}>
        <div style={{ fontSize: 32, marginBottom: 12, color: 'var(--text-dim)' }}>◎</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Engineer not found</div>
        <Link to="/" className="btn btn-ghost" style={{ marginTop: 16, display: 'inline-flex' }}>← Back</Link>
      </div>
    );
  }

  const SKILLS_PAGE = 5;
  const EXP_PAGE = 3;
  const sortedSkills = [...(engineer?.skills || [])].filter(s => s.name).sort((a, b) => (b.years || 0) - (a.years || 0));

  return (
    <div className="profile">
      <div className="profile-back">
        <Link to="/" className="btn btn-ghost">← Back to Explore</Link>
      </div>

      <div className="profile-header card">
        <div className="ph-avatar">{engineer.name?.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
        <div className="ph-info">
          <h1 className="ph-name">{engineer.name}</h1>
          <div className="ph-title">{engineer.title}</div>
          <div className="ph-location">◎ {engineer.location}</div>
          {engineer.bio && <p className="ph-bio">{engineer.bio}</p>}
          {engineer.github && (
            <div className="ph-github mono">
              <span style={{ color: 'var(--text-dim)' }}>⌥</span> github.com/{engineer.github}
            </div>
          )}
        </div>
      </div>

      <EgoGraph engineer={engineer} />

      <div className="profile-body">
        <div className="profile-main">
          <section className="profile-section">
            <h2 className="section-label">Skills</h2>
            <div className="skills-list">
              {sortedSkills.slice(0, skillsShown).map((s) => (
                <div key={s.name} className="skill-row">
                  <div className="skill-row-left">
                    <span className={`tag ${levelColor[s.level] || 'tag-muted'}`}>{s.level}</span>
                    <span className="skill-name">{s.name}</span>
                  </div>
                  <div className="skill-years">
                    <div className="skill-bar-wrap">
                      <div className="skill-bar" style={{ width: `${Math.min((s.years || 0) / 10 * 100, 100)}%` }} />
                    </div>
                    <span className="skill-yr-label mono">{s.years}yr</span>
                  </div>
                </div>
              ))}
            </div>
            {sortedSkills.length > SKILLS_PAGE && (
              <button className="show-more-btn" onClick={() =>
                setSkillsShown(skillsShown >= sortedSkills.length ? SKILLS_PAGE : sortedSkills.length)
              }>
                {skillsShown >= sortedSkills.length
                  ? '↑ Show less'
                  : `↓ Show ${sortedSkills.length - skillsShown} more`}
              </button>
            )}
          </section>

          {(engineer.experience || []).filter(e => e.company).length > 0 && (
            <section className="profile-section">
              <h2 className="section-label">Experience</h2>
              {(() => {
                const exp = engineer.experience.filter(e => e.company);
                return (
                  <>
                    <div className="timeline">
                      {exp.slice(0, expShown).map((e, i) => (
                        <div key={i} className="timeline-item">
                          <div className="tl-dot" />
                          <div className="tl-content">
                            <div className="tl-role">{e.role}</div>
                            <NodeBadge nodes={[{ label: 'Engineer', value: engineer.name?.split(' ')[0] }, { label: 'Company', value: e.company }]} />
                            <div className="tl-dates mono">
                              {e.from} → {e.to || 'present'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {exp.length > EXP_PAGE && (
                      <button className="show-more-btn" onClick={() =>
                        setExpShown(expShown >= exp.length ? EXP_PAGE : exp.length)
                      }>
                        {expShown >= exp.length
                          ? '↑ Show less'
                          : `↓ Show ${exp.length - expShown} more`}
                      </button>
                    )}
                  </>
                );
              })()}
            </section>
          )}

          {(engineer.projects || []).filter(p => p.name).length > 0 && (
            <section className="profile-section">
              <h2 className="section-label">Projects</h2>
              <div className="projects-grid">
                {engineer.projects.filter(p => p.name).map((p) => (
                  <div key={p.id} className="card project-card">
                    <div className="project-name">{p.name}</div>
                    {p.description && <div className="project-desc">{p.description}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="profile-aside">
          {related.length > 0 && (
            <section className="profile-section">
              <h2 className="section-label">Related Engineers</h2>
              <p className="section-note">Share ≥2 skills · multi-hop traversal</p>
              <div className="related-list">
                {related.map((r) => (
                  <Link key={r.id} to={`/engineer/${r.id}`} className="related-card card">
                    <div className="rc-avatar">{r.name?.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
                    <div className="rc-info">
                      <div className="rc-name">{r.name}</div>
                      <div className="rc-title">{r.title}</div>
                      <div className="rc-skills">
                        {(r.sharedSkills || []).slice(0, 3).map((s) => (
                          <span key={s} className="tag tag-green">{s}</span>
                        ))}
                        {(r.sharedCompanies || []).length > 0 && (
                          <span className="tag tag-purple">{r.sharedCompanies[0]}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {(engineer.connections || []).filter(c => c.name).length > 0 && (
            <section className="profile-section">
              <h2 className="section-label">Direct Connections</h2>
              <div className="connections-list">
                {engineer.connections.filter(c => c.name).map((c) => (
                  <Link key={c.id} to={`/engineer/${c.id}`} className="connection-row">
                    <span className="cr-avatar">{c.name?.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
                    <span className="cr-info">
                      <span className="cr-name">{c.name}</span>
                      <span className="cr-title">{c.title}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
