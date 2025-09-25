function aboutSource() {
  return `export default function About() {
    const techStack = [
      { name: 'React 19', version: 'Latest', category: 'Framework' },
      { name: 'TypeScript', version: '5.x', category: 'Language' },
      { name: 'Vite', version: '7.x', category: 'Build Tool' },
      { name: 'Tailwind CSS', version: '3.x', category: 'UI Library' },
      { name: 'React Router', version: '7.x', category: 'Routing' },
      { name: 'Zustand', version: '5.x', category: 'State Management' },
      { name: 'Axios', version: '1.x', category: 'HTTP Client' },
      { name: 'Vitest', version: '3.x', category: 'Testing' }
    ];
    const features = [
      'Modern React with hooks and functional components',
      'Full TypeScript support with strict mode',
      'Beautiful Tailwind CSS with utility-first approach',
      'Client-side routing with React Router',
      'State management with Zustand',
      'API integration with Axios',
      'Comprehensive testing setup with Vitest',
      'ESLint and Prettier for code quality',
      'Hot module replacement for fast development',
      'Responsive design with mobile-first approach'
    ];
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              About <span className="text-blue-600">PolyFront</span>
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              A comprehensive scaffold for modern web applications
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-blue-600 mb-4">Technology Stack</h2>
              <p className="text-gray-600 mb-6">
                Built with the latest and greatest technologies in the React ecosystem.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {techStack.map((tech, index) => (
                  <div key={index} className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg">
                    <div className="font-semibold">{tech.name} {tech.version}</div>
                    <div className="text-sm text-blue-600">{tech.category}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-blue-600 mb-4">Key Features</h2>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose PolyFront?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Production Ready</h3>
                <p className="text-gray-600">Built with best practices and industry standards</p>
              </div>
              <div>
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast Development</h3>
                <p className="text-gray-600">Hot reload and instant feedback for rapid iteration</p>
              </div>
              <div>
                <div className="text-4xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Team Friendly</h3>
                <p className="text-gray-600">Consistent code style and comprehensive tooling</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }`;
  }
 module.exports = { aboutSource };