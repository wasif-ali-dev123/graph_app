import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import DbBanner from '../components/DbBanner.jsx';
import './RoleMatcher.css';

export default function RoleMatcher() {
  const [roles, setRoles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchLoading, setMatchLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterSeniority, setFilterSeniority] = useState('All');

  useEffect(() => {
    api.explore.roles()
      .then((data) => { setRoles(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  const handleSelect = async (role) => {
    if (selected?.id === role.id) { setSelected(null); setMatches([]); return; }
    setSelected(role);
    setMatchLoading(true);
    try {
      const data = await api.explore.matchRole(role.id);
      setMatches(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setMatchLoading(false);
    }
  };

  const seniorities = ['All', ...new Set(roles.map(r => r.seniority).filter(Boolean))];
  const filtered = filterSeniority === 'All' ? roles : roles.filter(r => r.seniority === filterSeniority);

  const seniorityColor = { junior: 'tag-muted', mid: 'tag-green', senior: 'tag-blue', staff: 'tag-purple' };

  const scoreColor = (score) => {
    if (score >= 1) return 'var(--green)';
    if (score >= 0.6) return 'var(--accent)';
    return 'var(--orange)';
  };

  return (
    <div className="rolematcher">
      <div className="page-header">
        <h1 className="page-title">Role Matcher</h1>
        <p className="page-sub">
          Select an open role to rank engineers by skill coverage. Multi-hop graph query — no SQL needed.
        </p>
      </div>

      <DbBanner error={error} />

      <div className="rm-layout">
        <div className="rm-sidebar">
          <div className="cat-filter">
            {seniorities.map((s) => (
              <button
                key={s}
                className={`cat-btn${filterSeniority === s ? ' active' : ''}`}
                onClick={() => setFilterSeniority(s)}
              >
                {s}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 76 }} />
              ))}
            </div>
          ) : (
            <div className="role-list">
              {filtered.map((r) => (
                <button
                  key={r.id}
                  className={`role-item${selected?.id === r.id ? ' active' : ''}`}
                  onClick={() => handleSelect(r)}
                >
                  <div className="ri-header">
                    <span className={`tag ${seniorityColor[r.seniority] || 'tag-muted'}`}>{r.seniority}</span>
                    {r.remote && <span className="tag tag-green">remote</span>}
                  </div>
                  <div className="ri-title">{r.title}</div>
                  <div className="ri-company">{r.company}</div>
                  {r.salaryRange && <div className="ri-salary mono">{r.salaryRange}</div>}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="rm-detail">
          {!selected ? (
            <div className="detail-empty">
              <div className="de-icon">◎</div>
              <div className="de-title">Select an open role</div>
              <div className="de-sub">to find matching engineers ranked by skill coverage</div>
            </div>
          ) : (
            <>
              <div className="rm-detail-header card">
                <div className="rdh-left">
                  <h2 className="rdh-title">{selected.title}</h2>
                  <div className="rdh-company">{selected.company}</div>
                  <div className="rdh-meta">
                    <span className={`tag ${seniorityColor[selected.seniority] || 'tag-muted'}`}>{selected.seniority}</span>
                    {selected.remote && <span className="tag tag-green">remote</span>}
                    {selected.salaryRange && <span className="tag tag-muted mono">{selected.salaryRange}</span>}
                  </div>
                </div>
                {(selected.requiredSkills || []).length > 0 && (
                  <div className="rdh-skills">
                    <div className="rdh-skills-label">Requires</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {selected.requiredSkills.map((s) => (
                        <span key={s.id || s.name} className="tag tag-blue">{s.name || s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="match-header">
                <span className="match-title mono">Engineer Matches</span>
                <span className="match-sub">ranked by skill coverage</span>
              </div>

              {matchLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="skeleton" style={{ height: 80 }} />
                  ))}
                </div>
              ) : matches.length === 0 ? (
                <div className="detail-empty" style={{ height: 200 }}>
                  <div className="de-icon" style={{ fontSize: 24 }}>◎</div>
                  <div className="de-title">No matching engineers found</div>
                  <div className="de-sub">Try a role with fewer required skills</div>
                </div>
              ) : (
                <div className="match-list">
                  {matches.map((m, i) => (
                    <Link key={m.id} to={`/engineer/${m.id}`} className="match-card card">
                      <div className="mc-rank mono">#{i + 1}</div>
                      <div className="mc-avatar">{m.name?.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
                      <div className="mc-info">
                        <div className="mc-name">{m.name}</div>
                        <div className="mc-title">{m.title} · {m.location}</div>
                        <div className="mc-skills">
                          {(m.matchedSkills || []).map((s) => (
                            <span key={s} className="tag tag-green">{s}</span>
                          ))}
                          {(m.missingSkills || []).map((s) => (
                            <span key={s} className="tag tag-muted mc-missing">{s} ✗</span>
                          ))}
                        </div>
                      </div>
                      <div className="mc-score">
                        <div
                          className="mc-score-ring"
                          style={{ '--score-color': scoreColor(m.matchScore) }}
                        >
                          <span className="mc-score-num mono">
                            {Math.round((m.matchScore || 0) * 100)}%
                          </span>
                        </div>
                        <div className="mc-score-label">{m.matchCount}/{m.totalRequired} skills</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
