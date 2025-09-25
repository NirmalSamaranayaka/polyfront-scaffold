function homeSource() {
  return `export default function Home() {
    const features = [
      { icon: '🚀', title: 'Performance', description: 'Lightning-fast builds with modern tooling', color: 'text-blue-600' },
      { icon: '👥', title: 'Team Ready', description: 'Built for collaboration and scalability', color: 'text-green-600' },
      { icon: '⚡', title: 'Fast Development', description: 'Hot reload and instant feedback', color: 'text-purple-600' },
      { icon: '🛡️', title: 'Type Safe', description: 'Full TypeScript support with strict mode', color: 'text-yellow-600' },
      { icon: '🧹', title: 'Clean Code', description: 'ESLint + Prettier for code quality', color: 'text-gray-600' },
      { icon: '🎨', title: 'Beautiful UI', description: 'Tailwind CSS with utility-first approach', color: 'text-red-600' }
    ];
  
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-blue-600">PolyFront</span>
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              Your comprehensive multi-frontend scaffold with everything you need
            </p>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Built with React, TypeScript, Vite, Tailwind CSS, and modern development practices.
              Start building your next great application today.
            </p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
  
          <div className="bg-white rounded-lg shadow-lg p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              This scaffold includes routing, state management, API integration, testing, and much more.
              Explore the different pages to see all the features in action.
            </p>
            <div className="space-x-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                View Documentation
              </button>
              <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }`;
  }
 module.exports = { homeSource };