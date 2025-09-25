function dashboardSource(useTS) {
  return `import { useState } from 'react';
  export default function Dashboard() {
    const [stats] = useState({
      users: 1234,
      revenue: 45678,
      orders: 89,
      views: 12345
    });
    const [recentActivity] = useState([
      { id: 1, user: 'Nirmal Samaranayaka', action: 'Order placed', time: '2 min ago', status: 'success' },
      { id: 2, user: 'Jane Smith', action: 'Payment received', time: '5 min ago', status: 'success' },
      { id: 3, user: 'Bob Johnson', action: 'Login attempt', time: '10 min ago', status: 'warning' },
      { id: 4, user: 'Alice Brown', action: 'Account created', time: '15 min ago', status: 'success' },
    ]);
    const [topProducts] = useState([
      { name: 'Premium Widget', sales: 156, revenue: 2340, growth: 12 },
      { name: 'Super Gadget', sales: 98, revenue: 1890, growth: -5 },
      { name: 'Mega Tool', sales: 87, revenue: 1450, growth: 8 },
      { name: 'Ultra Device', sales: 76, revenue: 1230, growth: 15 },
    ]);
    const getStatusIcon = (status ${useTS?': string':''}) => {
      switch (status) {
        case 'success': return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
        case 'warning': return <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>;
        case 'error': return <div className="w-3 h-3 bg-red-500 rounded-full"></div>;
        default: return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
      }
    };
    const getGrowthColor = (growth ${useTS?': number':''}) => growth >= 0 ? 'text-green-600' : 'text-red-600';
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard</h1>
          <p className="text-lg text-gray-600 mb-8">
            Welcome back! Here's what's happening with your application today.
          </p>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stats.users.toLocaleString()}</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <span className="mr-1">↗</span>
                    +12% from last month
                  </p>
                </div>
                <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">👥</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">\${stats.revenue.toLocaleString()}</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <span className="mr-1">↗</span>
                    +8% from last month
                  </p>
                </div>
                <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">💰</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Orders</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stats.orders}</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <span className="mr-1">↗</span>
                    +15% from last month
                  </p>
                </div>
                <div className="w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">🛒</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Page Views</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{stats.views.toLocaleString()}</p>
                  <p className="text-sm text-green-600 flex items-center">
                    <span className="mr-1">↗</span>
                    +22% from last month
                  </p>
                </div>
                <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">👁️</span>
                </div>
              </div>
            </div>
          </div>
          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-900">Top Products</h2>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                      View All
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-900">Sales</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-900">Revenue</th>
                          <th className="text-right py-3 px-4 font-medium text-gray-900">Growth</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topProducts.map((product) => (
                          <tr key={product.name} className="border-b border-gray-100">
                            <td className="py-3 px-4">{product.name}</td>
                            <td className="py-3 px-4 text-right">{product.sales}</td>
                            <td className="py-3 px-4 text-right">\${product.revenue.toLocaleString()}</td>
                            <td className="py-3 px-4 text-right">
                              <span className={\`px-2 py-1 rounded-full text-xs font-medium \${getGrowthColor(product.growth)}\`}>
                                {product.growth >= 0 ? '+' : ''}{product.growth}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="mt-1">
                          {getStatusIcon(activity.status)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500">
                            {activity.user} — {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }`;
  }
 module.exports = { dashboardSource };