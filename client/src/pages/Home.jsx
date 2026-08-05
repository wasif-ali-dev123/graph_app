import { useState, useEffect, useCallback } from 'react';
import { api } from '../api.js';
import EngineerCard from '../components/EngineerCard.jsx';
import SkeletonCard from '../components/SkeletonCard.jsx';
import DbBanner from '../components/DbBanner.jsx';
import './Home.css';

export default function Home() {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [engineers, setEngineers] = useState([]);
  const [hotSkills, setHotSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    Promise.all([api.engineers.list(), api.explore.connectedSkills()])
      .then(([engs, skills]) => {
        setEngineers(engs);
        setHotSkills(skills);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) {
      setSearched(false);
      setActiveQuery('');
      setLoading(true);
      try {
        const engs = await api.engineers.list();
        setEngineers(engs);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      return;
    }
    setLoading(true);
    setSearched(true);
    setActiveQuery(q);
    try {
      const engs = await api.engineers.list(q);
      setEngineers(engs);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleSkillClick = async (skillName) => {
    setQuery(skillName);
    setActiveQuery(skillName);
    setLoading(true);
    setSearched(true);
    try {
      const engs = await api.engineers.list(skillName);
      setEngineers(engs);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categoryColor = {
    Backend: 'tag-blue',
    Frontend: 'tag-purple',
    DevOps: 'tag-orange',
    Database: 'tag-green',
    'AI/ML': 'tag-green',
    Data: 'tag-muted',
    Systems: 'tag-muted',
  };

  return (
    <div className="home">
      <div className="hero">
        <div className="hero-label mono">◈ Tech Talent Graph</div>
        <h1 className="hero-title">
          Find engineers through<br />
          <span className="hero-accent">relationship traversal</span>
        </h1>
        <p className="hero-sub">
          Explore skill networks, career paths, and colleague connections across{' '}
          {engineers.length || 30}+ engineers.
        </p>
        <form className="search-form" onSubmit={handleSearch}>
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search by name, skill, or company…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </div>
        </form>
      </div>

      <DbBanner error={error} />

      {!searched && hotSkills.length > 0 && (
        <div className="section">
          <div className="section-header">
            <span className="section-title mono">Most Connected Skills</span>
            <span className="section-sub">by total engineer + project appearances</span>
          </div>
          <div className="skill-grid">
            {hotSkills.map((s) => (
              <button
                key={s.id}
                className={`skill-chip ${categoryColor[s.category] || 'tag-muted'}`}
                onClick={() => handleSkillClick(s.name)}
              >
                <span className="skill-chip-name">{s.name}</span>
                <span className="skill-chip-count">{s.connections}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="section">
        <div className="section-header">
          <span className="section-title mono">
            {searched ? `Results for "${activeQuery}"` : 'All Engineers'}
          </span>
          <span className="section-sub">{engineers.length} engineers</span>
        </div>

        {loading ? (
          <div className="card-grid">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} lines={4} />)}
          </div>
        ) : engineers.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">◎</div>
            <div className="empty-title">No engineers found</div>
            <div className="empty-sub">Try searching for a skill like "Rails" or "Kubernetes"</div>
          </div>
        ) : (
          <div className="card-grid">
            {engineers.map((e) => <EngineerCard key={e.id} engineer={e} />)}
          </div>
        )}
      </div>
    </div>
  );
}
