import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import DbBanner from '../components/DbBanner.jsx';
import NodeBadge from '../components/NodeBadge.jsx';
import './SkillMap.css';

const categoryColor = {
  Backend: 'tag-blue',
  Frontend: 'tag-purple',
  DevOps: 'tag-orange',
  Database: 'tag-green',
  'AI/ML': 'tag-green',
  Data: 'tag-muted',
  Systems: 'tag-muted',
};

export default function SkillMap() {
  const [skills, setSkills] = useState([]);
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    api.skills.list()
      .then((data) => { setSkills(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, []);

  const handleSelect = async (skill) => {
    if (selected?.id === skill.id) { setSelected(null); setDetail(null); return; }
    setSelected(skill);
    setDetailLoading(true);
    try {
      const d = await api.skills.get(skill.id);
      setDetail(d);
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const categories = ['All', ...new Set(skills.map(s => s.category).filter(Boolean))];
  const filtered = filterCategory === 'All' ? skills : skills.filter(s => s.category === filterCategory);

  const levelColor = { junior: 'tag-muted', mid: 'tag-green', senior: 'tag-blue' };

  return (
    <div className="skillmap">
      <div className="page-header">
        <h1 className="page-title">Skill Map</h1>
        <p className="page-sub">
          Select a skill to see every engineer, project, and company connected to it.
        </p>
      </div>

      <DbBanner error={error} />

      <div className="sm-layout">
        <div className="sm-sidebar">
          <div className="cat-filter">
            {categories.map((c) => (
              <button
                key={c}
                className={`cat-btn${filterCategory === c ? ' active' : ''}`}
                onClick={() => setFilterCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 44 }} />
              ))}
            </div>
          ) : (
            <div className="skill-list">
              {filtered.map((s) => (
                <button
                  key={s.id}
                  className={`skill-item${selected?.id === s.id ? ' active' : ''}`}
                  onClick={() => handleSelect(s)}
                >
                  <div className="si-left">
                    <span className={`tag ${categoryColor[s.category] || 'tag-muted'}`}>{s.category}</span>
                    <span className="si-name">{s.name}</span>
                  </div>
                  <div className="si-right">
                    <span className="si-count">{s.engineerCount} engs</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="sm-detail">
          {!selected ? (
            <div className="detail-empty">
              <div className="de-icon">◈</div>
              <div className="de-title">Select a skill</div>
              <div className="de-sub">to see its connections across the graph</div>
            </div>
          ) : detailLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 60 }} />
              ))}
            </div>
          ) : detail ? (
            <>
              <div className="detail-header">
                <h2 className="detail-title">{detail.name}</h2>
                <span className={`tag ${categoryColor[detail.category] || 'tag-muted'}`}>{detail.category}</span>
              </div>

              <div className="detail-stats">
                <div className="ds-stat">
                  <div className="ds-num">{(detail.engineers || []).filter(e => e.name).length}</div>
                  <div className="ds-label">Engineers</div>
                </div>
                <div className="ds-stat">
                  <div className="ds-num">{(detail.projects || []).filter(p => p.name).length}</div>
                  <div className="ds-label">Projects</div>
                </div>
                <div className="ds-stat">
                  <div className="ds-num">{(detail.companies || []).filter(Boolean).length}</div>
                  <div className="ds-label">Companies hiring</div>
                </div>
              </div>

              {(detail.engineers || []).filter(e => e.name).length > 0 && (
                <section className="detail-section">
                  <h3 className="detail-section-label">Engineers</h3>
                  <div className="detail-engs">
                    {detail.engineers.filter(e => e.name).map((e) => (
                      <Link key={e.id} to={`/engineer/${e.id}`} className="de-eng card">
                        <div className="dee-avatar">{e.name?.split(' ').map(w => w[0]).join('').slice(0, 2)}</div>
                        <div className="dee-info">
                          <div className="dee-name">{e.name}</div>
                          <div className="dee-title">{e.title}</div>
                          <NodeBadge nodes={[
                            { label: 'Engineer', value: e.name?.split(' ')[0] },
                            { label: 'Skill', value: detail.name },
                          ]} />
                        </div>
                        <span className={`tag ${levelColor[e.level] || 'tag-muted'}`}>{e.level} · {e.years}yr</span>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {(detail.projects || []).filter(p => p.name).length > 0 && (
                <section className="detail-section">
                  <h3 className="detail-section-label">Projects using {detail.name}</h3>
                  <div className="detail-projects">
                    {detail.projects.filter(p => p.name).map((p) => (
                      <div key={p.id} className="card" style={{ padding: '12px 16px' }}>
                        <span className="tag tag-orange" style={{ marginBottom: 4 }}>Project</span>
                        <div style={{ fontWeight: 600, fontSize: 13, marginTop: 4 }}>{p.name}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {(detail.companies || []).filter(Boolean).length > 0 && (
                <section className="detail-section">
                  <h3 className="detail-section-label">Companies with open roles requiring this skill</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {detail.companies.filter(Boolean).map((c) => (
                      <span key={c} className="tag tag-purple">{c}</span>
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
