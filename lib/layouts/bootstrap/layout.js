function source() {
  return `import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import i18n from '../i18n';
import { useLanguage } from '../hooks/useLanguage';
import { languages } from '../utils/common';


const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLang, setCurrentLang } = useLanguage();

  const menuItems = [
    { key: 'home', path: '/' },
    { key: 'about', path: '/about' },
    { key: 'dashboard', path: '/dashboard' },
    { key: 'profile', path: '/profile' },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <nav className="bg-dark text-white" style={{ width: '250px' }}>
        <div className="p-3 border-bottom">
          <h5 className="text-primary fw-bold mb-1">PolyFront</h5>
          <small className="text-muted">{i18n.t('common.welcome', currentLang)}</small>
        </div>
        <ul className="nav flex-column">
          {menuItems.map((item) => (
            <li className="nav-item" key={item.key}>
              <button
                className={\`nav-link text-white w-100 text-start border-0 bg-transparent \${location.pathname === item.path ? 'active bg-primary' : ''}\`}
                onClick={() => navigate(item.path)}
              >
                {i18n.t(\`common.\${item.key}\`, currentLang)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content */}
      <div className="flex-grow-1">
        {/* Header */}
        <header className="bg-white border-bottom p-3">
          <div className="d-flex justify-content-between align-items-center">
            <button
              className="btn btn-outline-secondary d-md-none"
              onClick={handleDrawerToggle}
            >
              ☰
            </button>
            <h4 className="mb-0">PolyFront</h4>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-secondary">v0.0.34</span>
              
              {/* Language Selector */}
              <select
                title='Select Language'
                className="form-select form-select-sm"
                value={currentLang}
                onChange={(e) => setCurrentLang(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>

              <button className="btn btn-outline-secondary btn-sm">👤</button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;`;
}

module.exports = { source };