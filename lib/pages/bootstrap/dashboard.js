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
  
    const getStatusIcon = (status${useTS ? ':string' : ''}) => {
      switch (status) {
        case 'success': return <i className="bi bi-check-circle-fill text-success"></i>;
        case 'warning': return <i className="bi bi-exclamation-triangle-fill text-warning"></i>;
        case 'error': return <i className="bi bi-x-circle-fill text-danger"></i>;
        default: return <i className="bi bi-check-circle-fill text-success"></i>;
      }
    };
  
    const getGrowthColor = (growth ${useTS ? ': number' : ''}) => growth >= 0 ? 'success' : 'danger';
  
    return (
      <div>
        <h1 className="display-4 fw-bold text-primary mb-3">Dashboard</h1>
        <p className="lead text-muted mb-4">
          Welcome back! Here's what's happening with your application today.
        </p>
  
        {/* Stats Cards */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-muted mb-2">Total Users</h6>
                    <h3 className="mb-2">{stats.users.toLocaleString()}</h3>
                    <small className="text-success">
                      <i className="bi bi-arrow-up me-1"></i>
                      +12% from last month
                    </small>
                  </div>
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                    <i className="bi bi-people-fill"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="col-12 col-sm-6 col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-muted mb-2">Revenue</h6>
                    <h3 className="mb-2">\${stats.revenue.toLocaleString()}</h3>
                    <small className="text-success">
                      <i className="bi bi-arrow-up me-1"></i>
                      +8% from last month
                    </small>
                  </div>
                  <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                    <i className="bi bi-currency-dollar"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="col-12 col-sm-6 col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-muted mb-2">Orders</h6>
                    <h3 className="mb-2">{stats.orders}</h3>
                    <small className="text-success">
                      <i className="bi bi-arrow-up me-1"></i>
                      +15% from last month
                    </small>
                  </div>
                  <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                    <i className="bi bi-cart"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <div className="col-12 col-sm-6 col-md-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h6 className="text-muted mb-2">Page Views</h6>
                    <h3 className="mb-2">{stats.views.toLocaleString()}</h3>
                    <small className="text-success">
                      <i className="bi bi-arrow-up me-1"></i>
                      +22% from last month
                    </small>
                  </div>
                  <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                    <i className="bi bi-eye"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Charts and Tables */}
        <div className="row g-3">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Top Products</h5>
                <button className="btn btn-primary btn-sm">View All</button>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th className="text-end">Sales</th>
                        <th className="text-end">Revenue</th>
                        <th className="text-end">Growth</th>
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
  
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Recent Activity</h5>
              </div>
              <div className="card-body">
                <div className="list-group list-group-flush">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="list-group-item d-flex align-items-start">
                      <div className="me-3">
                        {getStatusIcon(activity.status)}
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold">{activity.action}</div>
                        <small className="text-muted">
                          {activity.user} — {activity.time}
                        </small>
                      </div>
                    </div>
                  ))}
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

  