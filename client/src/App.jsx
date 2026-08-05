import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home.jsx';
import EngineerProfile from './pages/EngineerProfile.jsx';
import SkillMap from './pages/SkillMap.jsx';
import RoleMatcher from './pages/RoleMatcher.jsx';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <NavLink to="/" className="logo">
            <span className="logo-icon">◈</span>
            <span className="logo-text">TalentGraph</span>
          </NavLink>
          <nav className="nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Explore
            </NavLink>
            <NavLink to="/skills" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Skill Map
            </NavLink>
            <NavLink to="/roles" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Role Matcher
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/engineer/:id" element={<EngineerProfile />} />
          <Route path="/skills" element={<SkillMap />} />
          <Route path="/roles" element={<RoleMatcher />} />
        </Routes>
      </main>
    </div>
  );
}
