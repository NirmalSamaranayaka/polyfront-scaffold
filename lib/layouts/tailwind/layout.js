function source() {
  return `import { useState } from 'react';
      import { Outlet, useNavigate, useLocation } from 'react-router-dom';
      import i18n from '../i18n';
      import { useLanguage } from '../hooks/useLanguage';
      import { languages } from '../utils/common';
      
      const Layout = () => {
        const navigate = useNavigate();
        const location = useLocation();
      
        // Language from context
        const { currentLang, setCurrentLang } = useLanguage();
      
        const menuItems = [
          { key: 'home', path: '/' },
          { key: 'about', path: '/about' },
          { key: 'dashboard', path: '/dashboard' },
          { key: 'profile', path: '/profile' },
        ];
      
        const [mobileOpen, setMobileOpen] = useState(false);
        const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
      
        return (
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <nav className="bg-gray-900 text-white w-64 hidden md:block">
              <div className="p-6 border-b border-gray-700">
                <h5 className="text-blue-400 font-bold text-lg mb-1">PolyFront</h5>
                <p className="text-gray-400 text-sm">{i18n.t('common.welcome', currentLang)}</p>
              </div>
              <ul className="py-4">
                {menuItems.map((item) => (
                  <li key={item.key}>
                    <button
                      className={\`w-full text-left px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors \${
                        location.pathname === item.path ? 'bg-blue-600 text-white' : ''
                      }\`}
                      onClick={() => navigate(item.path)}
                    >
                      {i18n.t(\`common.\${item.key}\`, currentLang)}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
      
            {/* Main content */}
            <div className="flex-1">
              {/* Header */}
              <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <button
                  className="md:hidden bg-gray-200 p-2 rounded-lg"
                  onClick={handleDrawerToggle}
                >
                  ☰
                </button>
                <h4 className="text-xl font-semibold text-gray-900">PolyFront</h4>
      
                {/* Version + Language + User */}
                <div className="flex items-center gap-3">
                  {/* Version */}
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">v0.0.40</span>
      
                  {/* Language selector */}
                  <select
                    title='Select Language'
                    value={currentLang}
                    onChange={(e) => setCurrentLang(e.target.value)}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
      
                  {/* User button */}
                  <button className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition-colors">
                    👤
                  </button>
                </div>
              </header>
      
              {/* Page content */}
              <main className="p-6">
                <Outlet />
              </main>
            </div>
          </div>
        );
      };
      
      export default Layout;`;
}

module.exports = { source };