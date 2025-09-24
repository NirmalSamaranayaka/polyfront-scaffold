function aboutSource() {
  return `export default function About() {
    const techStack = [
      { name: 'React 19', version: 'Latest', category: 'Framework' },
      { name: 'TypeScript', version: '5.x', category: 'Language' },
      { name: 'Vite', version: '7.x', category: 'Build Tool' },
      { name: 'Bootstrap', version: '5.x', category: 'UI Library' },
      { name: 'React Router', version: '7.x', category: 'Routing' },
      { name: 'Zustand', version: '5.x', category: 'State Management' },
      { name: 'Axios', version: '1.x', category: 'HTTP Client' },
      { name: 'Vitest', version: '3.x', category: 'Testing' }
    ];
  
    const features = [
      'Modern React with hooks and functional components',
      'Full TypeScript support with strict mode',
      'Beautiful Bootstrap components with theming',
      'Client-side routing with React Router',
      'State management with Zustand',
      'API integration with Axios',
      'Comprehensive testing setup with Vitest',
      'ESLint and Prettier for code quality',
      'Hot module replacement for fast development',
      'Responsive design with mobile-first approach'
    ];
  
    return (
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary mb-3">
            About PolyFront
          </h1>
          <p className="lead text-muted mb-4">
            A comprehensive scaffold for modern web applications
          </p>
        </div>
  
        <div className="row g-4 mb-5">
          <div className="col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h4 className="card-title text-primary">Technology Stack</h4>
                <p className="card-text">
                  Built with the latest and greatest technologies in the React ecosystem.
                </p>
                <div className="row g-2">
                  {techStack.map((tech, index) => (
                    <div className="col-6" key={index}>
                      <span className="badge bg-primary me-2 mb-2">
                        {tech.name} {tech.version}
                      </span>
                      <small className="text-muted d-block">{tech.category}</small>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
  
          <div className="col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h4 className="card-title text-primary">Key Features</h4>
                <ul className="list-unstyled">
                  {features.map((feature, index) => (
                    <li key={index} className="mb-2">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
  
        <div className="card shadow-sm">
          <div className="card-body text-center p-5">
            <h2 className="mb-4">Why Choose PolyFront?</h2>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="display-4 mb-3">⭐</div>
                <h5>Production Ready</h5>
                <p className="text-muted">Built with best practices and industry standards</p>
              </div>
              <div className="col-md-4">
                <div className="display-4 mb-3">⚡</div>
                <h5>Fast Development</h5>
                <p className="text-muted">Hot reload and instant feedback for rapid iteration</p>
              </div>
              <div className="col-md-4">
                <div className="display-4 mb-3">👥</div>
                <h5>Team Friendly</h5>
                <p className="text-muted">Consistent code style and comprehensive tooling</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }`;
  }
 module.exports = { aboutSource };