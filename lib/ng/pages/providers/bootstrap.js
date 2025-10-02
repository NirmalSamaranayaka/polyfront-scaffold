function getPageTemplate(pageName, content) {
  const ts = `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-${pageName}',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './${pageName}.component.html',
  styleUrls: ['./${pageName}.component.scss']
})
export class ${capitalize(pageName)}Component {
  content = ${JSON.stringify(content, null, 2)};
}`;

  let html = '';
  let scss = '';

  switch (pageName) {
   case 'home':
      html = `<div class="container-fluid py-5">
  <div class="text-center mb-5">
    <h1 class="display-4 text-primary fw-bold">{{ content.title }}</h1>
    <p class="lead">{{ content.intro }}</p>
    <p class="text-muted">{{ content.description }}</p>
  </div>

  <div class="row g-4 mb-5">
    @for (feature of content.features; track feature.title) {
      <div class="col-md-4">
        <div class="card h-100 shadow-sm">
          <div class="card-body text-center">
           <div class="feature-icon mb-3">
              <i class="bi {{ feature.icon }} text-{{ feature.color }}"></i>
            </div>
            <h5 class="card-title">{{ feature.title }}</h5>
            <p class="card-text">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    }
  </div>

  <div class="card text-center">
    <div class="card-body">
      <h2 class="card-title">Ready to Get Started?</h2>
      <p class="card-text">This scaffold includes routing, state management, API integration, testing, and much more.</p>
      <div class="mt-3">
        <button type="button" class="btn btn-primary btn-lg me-2">View Documentation</button>
        <button type="button" class="btn btn-outline-primary btn-lg">Learn More</button>
      </div>
    </div>
  </div>
</div>`;

      scss = `.feature-icon i { font-size: 3rem; }
.card { transition: transform 0.3s; }
.card:hover { transform: translateY(-4px); }`;
      break;

    case 'about':
      html = `<div class="container-fluid py-5">
  <div class="text-center mb-5">
    <h1 class="display-4 text-primary fw-bold">{{ content.title }}</h1>
    <p class="lead">{{ content.intro }}</p>
  </div>

  <div class="row g-4 mb-5">
    <div class="col-md-6">
      <div class="card h-100">
        <div class="card-header">
          <h4 class="card-title mb-0">Technology Stack</h4>
        </div>
        <div class="card-body">
          <p class="card-text">Built with the latest and greatest technologies in the Angular ecosystem.</p>
          <div class="d-flex flex-wrap gap-2">
            @for (tech of content.techStack; track tech.name) {
              <span class="badge bg-primary">{{ tech.name }} {{ tech.version }}</span>
            }
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-6">
      <div class="card h-100">
        <div class="card-header">
          <h4 class="card-title mb-0">Key Features</h4>
        </div>
        <div class="card-body">
          <ul class="list-group list-group-flush">
            @for (feature of content.features; track feature) {
              <li class="list-group-item d-flex align-items-center">
                <i class="bi bi-check-circle-fill  me-2"> </i>
                {{ feature }}
              </li>
            }
          </ul>
        </div>
      </div>
    </div>
  </div>

  <div class="card text-center">
    <div class="card-body">
      <h2 class="card-title">Why Choose PolyFront?</h2>
      <div class="row g-4 mt-3">
        @for (benefit of content.benefits; track benefit.title) {
          <div class="col-md-4">
            <div class="text-center">
              <i class="bi bi-{{ benefit.icon }}  me-2"> </i>
              <h5 class="mt-2">{{ benefit.title }}</h5>
              <p class="text-muted">{{ benefit.description }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  </div>
</div>`;

      scss = `.badge { font-size: 0.9rem; }`;
      break;

    case 'dashboard':
      html = `<div class="container-fluid py-4">
  <h1 class="display-5 text-primary fw-bold">{{ content.title }}</h1>
  <p class="lead">{{ content.intro }}</p>

  <div class="row g-4 mb-4">
    <div class="col-md-3">
      <div class="card text-center">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="card-subtitle text-muted">Total Users</h6>
              <h2 class="card-title">{{ content.stats.users | number }}</h2>
              <small class="text-success">+12% from last month</small>
            </div>
             <i class="bi bi-people  me-2"> </i>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card text-center">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="card-subtitle text-muted">Revenue</h6>
              <h2 class="card-title">\${{ content.stats.revenue | number }}</h2>
              <small class="text-success">+8% from last month</small>
            </div>
            <i class="bi bi-currency-dollar text-success  me-2"> </i>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card text-center">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="card-subtitle text-muted">Orders</h6>
              <h2 class="card-title">{{ content.stats.orders }}</h2>
              <small class="text-success">+15% from last month</small>
            </div>
            <i class="bi bbi-cart2 text-warning  me-2"> </i>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-3">
      <div class="card text-center">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="card-subtitle text-muted">Page Views</h6>
              <h2 class="card-title">{{ content.stats.views | number }}</h2>
              <small class="text-success">+22% from last month</small>
            </div>
            <i class="bi bi-eye-fill text-info  me-2"> </i>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row g-4">
    <div class="col-md-8">
      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0">Top Products</h5>
        </div>
        <div class="card-body">
          <div class="table-responsive">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Product</th>
                  <th class="text-end">Sales</th>
                  <th class="text-end">Revenue</th>
                  <th class="text-end">Growth</th>
                </tr>
              </thead>
              <tbody>
                @for (product of content.topProducts; track product.name) {
                  <tr>
                    <td>{{ product.name }}</td>
                    <td class="text-end">{{ product.sales }}</td>
                    <td class="text-end">\${{ product.revenue | number }}</td>
                    <td class="text-end">
                      <span class="badge" [class]="product.growth >= 0 ? 'bg-success' : 'bg-danger'">
                        {{ product.growth >= 0 ? '+' : '' }}{{ product.growth }}%
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-4">
      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0">Recent Activity</h5>
        </div>
        <div class="card-body">
          <div class="list-group list-group-flush">
            @for (activity of content.recentActivity; track activity.id) {
              <div class="list-group-item d-flex align-items-start">
                <i class="bi me-2" [class]="activity.status === 'success' ? 'text-success' : activity.status === 'warning' ? 'text-warning' : 'text-danger'">
                  {{ activity.status === 'success' ? 'check_circle' : activity.status === 'warning' ? 'warning' : 'error' }}
                </i>
                <div class="flex-grow-1">
                  <h6 class="mb-1">{{ activity.action }}</h6>
                  <small class="text-muted">{{ activity.user }} — {{ activity.time }}</small>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;

      scss = `.card { transition: transform 0.3s; }
.card:hover { transform: translateY(-2px); }`;
      break;

    case 'profile':
      html = `<div class="container-fluid py-4">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h1 class="display-5 text-primary fw-bold">{{ content.title }}</h1>
    <button type="button" class="btn btn-primary">
      <i class="bi bi-pencil me-1"></i>
      Edit Profile
    </button>
  </div>

  <div class="card mb-4">
    <div class="card-body">
      <div class="d-flex align-items-center">
        <div class="me-4">
          <i class="bi bi-person-circle fs-1 text-secondary"></i>
        </div>
        <div class="flex-grow-1">
          <h2 class="mb-1">{{ content.profile.name }}</h2>
          <p class="text-muted mb-2">{{ content.profile.position }} at {{ content.profile.company }}</p>
          <p class="text-muted mb-3">{{ content.profile.bio }}</p>
          <div class="d-flex flex-wrap gap-1">
            @for (skill of content.skills; track skill) {
              <span class="badge bg-secondary">{{ skill }}</span>
            }
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="row g-4">
    <div class="col-md-8">
      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0">Personal Information</h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Full Name</label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-person"></i>
                </span>
                <input type="text" class="form-control" [value]="content.profile.name" readonly>
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Email</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                <input type="email" class="form-control" [value]="content.profile.email" readonly>
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Phone</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-telephone"></i></span>
                <input type="tel" class="form-control" [value]="content.profile.phone" readonly>
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Location</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-geo-alt"></i></span>
                <input type="text" class="form-control" [value]="content.profile.location" readonly>
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Company</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-briefcase"></i></span>
                <input type="text" class="form-control" [value]="content.profile.company" readonly>
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">Position</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-briefcase"></i></span>
                <input type="text" class="form-control" [value]="content.profile.position" readonly>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-md-4">
      <div class="card">
        <div class="card-header">
          <h5 class="card-title mb-0">Settings</h5>
        </div>
        <div class="card-body">
          <div class="list-group list-group-flush">
            <div class="list-group-item d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <i class="bi bi-bell me-2"></i>
                <span>Email Notifications</span>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" [checked]="content.settings.emailNotifications" disabled>
              </div>
            </div>
            <div class="list-group-item d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <i class="bi bi-bell me-2"></i>
                <span>Push Notifications</span>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" [checked]="content.settings.pushNotifications" disabled>
              </div>
            </div>
            <div class="list-group-item d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <i class="bi bi-palette me-2"></i>
                <span>Dark Mode</span>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" [checked]="content.settings.darkMode" disabled>
              </div>
            </div>
            <div class="list-group-item d-flex justify-content-between align-items-center">
              <div class="d-flex align-items-center">
                <i class="bi bi-shield-lock me-2"></i>
                <span>Two-Factor Auth</span>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" [checked]="content.settings.twoFactorAuth" disabled>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>`;

      scss = `.badge { font-size: 0.8rem; }`;
      break;
  
  }

  return { ts, html, scss };
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

module.exports = { getPageTemplate };
