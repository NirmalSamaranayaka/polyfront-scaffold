function homeSource() {
  return `export default function Home() {
    const features = [
      { icon: '🚀', title: 'Performance', description: 'Lightning-fast builds with modern tooling', color: 'primary' },
      { icon: '👥', title: 'Team Ready', description: 'Built for collaboration and scalability', color: 'success' },
      { icon: '⚡', title: 'Fast Development', description: 'Hot reload and instant feedback', color: 'info' },
      { icon: '🛡️', title: 'Type Safe', description: 'Full TypeScript support with strict mode', color: 'warning' },
      { icon: '🧹', title: 'Clean Code', description: 'ESLint + Prettier for code quality', color: 'secondary' },
      { icon: '🎨', title: 'Beautiful UI', description: 'Bootstrap components with theming', color: 'danger' }
    ];
  
    return (
      <div className="container py-5">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-primary mb-3">
            Welcome to PolyFront
          </h1>
          <p className="lead text-muted mb-4">
            Your comprehensive multi-frontend scaffold with everything you need
          </p>
          <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
            Built with React, TypeScript, Vite, Bootstrap, and modern development practices.
            Start building your next great application today.
          </p>
        </div>
  
        <div className="row g-4 mb-5">
          {features.map((feature, index) => (
            <div className="col-12 col-sm-6 col-md-4" key={index}>
              <div className="card h-100 shadow-sm border-0">
                <div className="card-body text-center">
                  <div className="display-4 mb-3">{feature.icon}</div>
                  <h5 className="card-title">{feature.title}</h5>
                  <p className="card-text text-muted">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        <div className="card shadow-sm border-0">
          <div className="card-body text-center p-5">
            <h2 className="mb-3">Ready to Get Started?</h2>
            <p className="text-muted mb-4">
              This scaffold includes routing, state management, API integration, testing, and much more.
              Explore the different pages to see all the features in action.
            </p>
            <div className="mt-4">
              <button className="btn btn-primary btn-lg me-3">View Documentation</button>
              <button className="btn btn-outline-primary btn-lg">Learn More</button>
            </div>
          </div>
        </div>
      </div>
    );
  }`;
  }
 module.exports = { homeSource };