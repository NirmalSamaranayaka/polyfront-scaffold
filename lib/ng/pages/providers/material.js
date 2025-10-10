const { getPageContent } = require("./content");

function getPageTemplate(pageName, content) {
  const ts = `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-${pageName}',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTableModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatGridListModule
  ],
  templateUrl: './${pageName}.component.html',
  styleUrls: ['./${pageName}.component.scss']
})
export class ${capitalize(pageName)}Component {
  content = ${JSON.stringify(content, null, 2)};
  
  getStatusIcon(status: string) {
    switch (status) {
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'check_circle';
    }
  }
  
  getGrowthColor(growth: number) {
    return growth >= 0 ? 'primary' : 'warn';
  }
  
  getStatusColor(status: string) {
    switch (status) {
      case 'success': return 'primary';
      case 'warning': return 'accent';
      case 'error': return 'warn';
      default: return 'primary';
    }
  }
}`;

  let html = '';
  let scss = '';

  switch (pageName) {
    case 'home':
      html = `<div class="container">
  <div class="hero-section">
    <h1 class="title">{{ content.title }}</h1>
    <p class="subtitle">{{ content.intro }}</p>
    <p class="description">{{ content.description }}</p>
  </div>

  <div class="features-grid">
    @for (feature of content.features; track feature.title) {
      <mat-card class="feature-card">
        <mat-card-content>
          <div class="feature-icon">
            <mat-icon [color]="feature.color">{{ feature.icon }}</mat-icon>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </mat-card-content>
      </mat-card>
    }
  </div>

  <mat-card class="cta-card">
    <mat-card-content>
      <h2>Ready to Get Started?</h2>
      <p>This scaffold includes routing, state management, API integration, testing, and much more.</p>
      <div class="button-group">
        <button mat-raised-button color="primary">View Documentation</button>
        <button mat-stroked-button>Learn More</button>
      </div>
    </mat-card-content>
  </mat-card>
</div>`;

      scss = `.container { max-width: 1200px; margin: 0 auto; padding: 1rem; }
.hero-section { text-align: center; margin-bottom: 2rem; padding: 0 1rem; }
.title { font-size: clamp(1.8rem, 5vw, 2.5rem); font-weight: bold; color: #1976d2; margin-bottom: 0.75rem; line-height: 1.2; }
.subtitle { font-size: clamp(1rem, 3vw, 1.25rem); color: #666; margin-bottom: 0.5rem; line-height: 1.4; }
.description { font-size: clamp(0.9rem, 2.5vw, 1rem); color: #666; max-width: 100%; margin: 0 auto; line-height: 1.5; }
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 2rem; align-items: stretch; }
.feature-card { height: 100%; text-align: center; transition: transform 0.3s; padding: 1rem; word-wrap: break-word; }
.feature-card:hover { transform: translateY(-4px); }
.feature-icon { margin-bottom: 0.75rem; }
.feature-icon mat-icon { font-size: 3rem; width: 3rem; height: 3rem; }
.cta-card { text-align: center; padding: 1.5rem; }
.button-group { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; }
.button-group button { flex: 1 1 auto; min-width: 120px; }

/* Responsive breakpoints */
@media (max-width: 1024px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .features-grid { grid-template-columns: 1fr; } .hero-section { margin-bottom: 1.5rem; } .button-group button { width: 100%; } }
@media (max-width: 480px) { .title { font-size: 1.8rem; } .subtitle { font-size: 1rem; } .description { font-size: 0.9rem; } .feature-card { padding: 0.75rem; } }
`;
      break;

    case 'about':
      html = `<div class="container">
  <div class="hero-section">
    <h1 class="title">{{ content.title }}</h1>
    <p class="subtitle">{{ content.intro }}</p>
  </div>

  <div class="content-grid">
    <mat-card class="tech-stack-card shadow-sm">
      <mat-card-header class="pb-0">
        <mat-card-title class="text-primary text-lg font-semibold">Technology Stack</mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <p class="text-muted mb-4">
          Built with the latest and greatest technologies in the Angular ecosystem.
        </p>

        <div class="tech-grid">
          @for (tech of content.techStack; track tech.name) {
            <div class="tech-item">
              <div class="badge">
                <span class="tech-name">{{ tech.name }}</span>
                <span class="tech-version">{{ tech.version }}</span>
              </div>
              <small class="tech-category">{{ tech.category }}</small>
            </div>
          }
        </div>
      </mat-card-content>
    </mat-card>

    <mat-card class="features-card">
      <mat-card-header>
        <mat-card-title>Key Features</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-list>
          @for (feature of content.features; track feature) {
            <mat-list-item>
              <mat-icon matListItemIcon color="primary">check_circle</mat-icon>
              <span matListItemTitle>{{ feature }}</span>
            </mat-list-item>
          }
        </mat-list>
      </mat-card-content>
    </mat-card>
  </div>

  <mat-card class="benefits-card">
    <mat-card-content>
      <h2>Why Choose PolyFront?</h2>
      <div class="benefits-grid">
        @for (benefit of content.benefits; track benefit.title) {
          <div class="benefit-item">
            <mat-icon [color]="'primary'">{{ benefit.icon }}</mat-icon>
            <h3>{{ benefit.title }}</h3>
            <p>{{ benefit.description }}</p>
          </div>
        }
      </div>
    </mat-card-content>
  </mat-card>
</div>`;

      scss = `.container { max-width: 1200px; margin: 0 auto; padding: 1rem; }
.hero-section { text-align: center; margin-bottom: 2rem; padding: 0 1rem; }
.title { font-size: clamp(1.8rem, 5vw, 2.5rem); font-weight: bold; color: #1976d2; margin-bottom: 0.5rem; line-height: 1.2; }
.subtitle { font-size: clamp(1rem, 3vw, 1.25rem); color: #666; line-height: 1.4; }
.content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
.tech-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
.features-card mat-list-item span { word-wrap: break-word; }
.benefits-card { text-align: center; padding: 1rem; }
.benefits-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 2rem; }
.benefit-item { text-align: center; word-wrap: break-word; }
.benefit-item mat-icon { font-size: 3rem; width: 3rem; height: 3rem; margin-bottom: 0.5rem; }

.tech-stack-card .mat-card-title { color: #1976d2; font-weight: 600; }
.tech-stack-card p { color: #6c757d; }
.tech-stack-card .tech-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1rem; text-align: center; }
.tech-stack-card .tech-item { display: flex; flex-direction: column; align-items: center; justify-content: center; }
.tech-stack-card .tech-item .badge { background-color: #1976d2; color: #fff; border-radius: 8px; padding: 8px 10px; min-width: 100px; max-width: 140px; display: flex; flex-direction: column; align-items: center; justify-content: center; word-break: break-word; text-align: center; font-size: 0.85rem; font-weight: 500; line-height: 1.3; margin-bottom: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.15); }
.tech-stack-card .tech-item .tech-name { white-space: normal; }
.tech-stack-card .tech-item .tech-version { font-size: 0.75rem; opacity: 0.9; }
.tech-stack-card .tech-item .tech-category { color: #6c757d; font-size: 0.8rem; }

@media (max-width: 768px) { 
  .tech-stack-card .tech-grid { grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 0.75rem; } 
  .tech-stack-card .badge { font-size: 0.8rem; padding: 6px 8px; } 
}

@media (max-width: 480px) { 
  .tech-stack-card .tech-grid { grid-template-columns: repeat(2, 1fr); } 
  .tech-stack-card .badge { min-width: 90px; max-width: 120px; } 
}

@media (max-width: 1024px) { 
  .content-grid { grid-template-columns: 1fr; grid-auto-rows: min-content; row-gap: 1.5rem; } 
  .benefits-grid { grid-template-columns: repeat(2, 1fr); } 
}

@media (max-width: 768px) { 
  .hero-section { margin-bottom: 1.5rem; } 
  .benefits-grid { grid-template-columns: 1fr; } 
}

@media (max-width: 480px) { 
  .title { font-size: 1.8rem; } 
  .subtitle { font-size: 1rem; } 
  .benefit-item mat-icon { font-size: 2.5rem; width: 2.5rem; height: 2.5rem; } 
  .content-grid > mat-card { width: 100%; } 
}
`;
      break;

    case 'dashboard':
      html = `<div class="dashboard">
  <h1 class="title">{{ content.title }}</h1>
  <p class="subtitle">{{ content.intro }}</p>

  <div class="stats-grid">
    <mat-card class="stat-card">
      <mat-card-content>
        <div class="stat-content">
          <div class="stat-info">
            <h3>Total Users</h3>
            <h1>{{ content.stats.users | number }}</h1>
            <p class="growth positive">+12% from last month</p>
          </div>
          <mat-icon class="stat-icon" color="primary">people</mat-icon>
        </div>
      </mat-card-content>
    </mat-card>

    <mat-card class="stat-card">
      <mat-card-content>
        <div class="stat-content">
          <div class="stat-info">
            <h3>Revenue</h3>
            <h1>\${{ content.stats.revenue | number }}</h1>
            <p class="growth positive">+8% from last month</p>
          </div>
          <mat-icon class="stat-icon" color="primary">attach_money</mat-icon>
        </div>
      </mat-card-content>
    </mat-card>

    <mat-card class="stat-card">
      <mat-card-content>
        <div class="stat-content">
          <div class="stat-info">
            <h3>Orders</h3>
            <h1>{{ content.stats.orders }}</h1>
            <p class="growth positive">+15% from last month</p>
          </div>
          <mat-icon class="stat-icon" color="primary">shopping_cart</mat-icon>
        </div>
      </mat-card-content>
    </mat-card>

    <mat-card class="stat-card">
      <mat-card-content>
        <div class="stat-content">
          <div class="stat-info">
            <h3>Page Views</h3>
            <h1>{{ content.stats.views | number }}</h1>
            <p class="growth positive">+22% from last month</p>
          </div>
          <mat-icon class="stat-icon" color="primary">visibility</mat-icon>
        </div>
      </mat-card-content>
    </mat-card>
  </div>

  <div class="dashboard-content">
    <mat-card class="products-card">
      <mat-card-header>
        <mat-card-title>Top Products</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="content.topProducts" class="products-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Product</th>
            <td mat-cell *matCellDef="let product">{{ product.name }}</td>
          </ng-container>
          <ng-container matColumnDef="sales">
            <th mat-header-cell *matHeaderCellDef>Sales</th>
            <td mat-cell *matCellDef="let product">{{ product.sales }}</td>
          </ng-container>
          <ng-container matColumnDef="revenue">
            <th mat-header-cell *matHeaderCellDef>Revenue</th>
            <td mat-cell *matCellDef="let product">\${{ product.revenue | number }}</td>
          </ng-container>
          <ng-container matColumnDef="growth">
            <th mat-header-cell *matHeaderCellDef>Growth</th>
            <td mat-cell *matCellDef="let product">
              <mat-chip [color]="getGrowthColor(product.growth)">
                {{ product.growth >= 0 ? '+' : '' }}{{ product.growth }}%
              </mat-chip>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="['name', 'sales', 'revenue', 'growth']"></tr>
          <tr mat-row *matRowDef="let row; columns: ['name', 'sales', 'revenue', 'growth'];"></tr>
        </table>
      </mat-card-content>
    </mat-card>

    <mat-card class="activity-card">
      <mat-card-header>
        <mat-card-title>Recent Activity</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-list>
          @for (activity of content.recentActivity; track activity.id) {
            <mat-list-item>
              <mat-icon matListItemIcon [color]="getStatusColor(activity.status)">
                {{ getStatusIcon(activity.status) }}
              </mat-icon>
              <span matListItemTitle>{{ activity.action }}</span>
              <span matListItemLine>{{ activity.user }} — {{ activity.time }}</span>
            </mat-list-item>
          }
        </mat-list>
      </mat-card-content>
    </mat-card>
  </div>
</div>`;

      scss = `.dashboard { padding: 2rem; }

.title { font-size: 2.5rem; font-weight: bold; color: #1976d2; margin-bottom: 0.5rem; }
.subtitle { font-size: 1.2rem; color: #666; margin-bottom: 2rem; }

.stats-grid { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
  gap: 1.5rem; 
  margin-bottom: 2rem; 
}

.stat-card { height: 100%; }

.stat-content { display: flex; justify-content: space-between; align-items: center; }

.stat-info h3 { color: #666; margin-bottom: 0.5rem; }
.stat-info h1 { font-size: 2rem; margin: 0; }
.growth { display: flex; align-items: center; font-size: 0.9rem; }
.growth.positive { color: #4caf50; }
.stat-icon { font-size: 3rem; width: 3rem; height: 3rem; }

.dashboard-content { 
  display: grid; 
  grid-template-columns: 2fr 1fr; 
  gap: 2rem; 
}

.products-table { width: 100%; }

/* Responsive adjustments */
@media (max-width: 1024px) {
  .dashboard-content {
    grid-template-columns: 1fr; /* stack all cards vertically */
  }
}

@media (max-width: 768px) {
  .dashboard { padding: 1rem; }
  .title { font-size: 2rem; }
  .subtitle { font-size: 1rem; }
}`;
      break;

    case 'profile':
      html = `<div class="profile">
  <div class="profile-header">
    <h1 class="title">{{ content.title }}</h1>
    <button mat-raised-button color="primary">
      <mat-icon>edit</mat-icon>
      Edit Profile
    </button>
  </div>

  <div class="profile-content">
    <mat-card class="profile-card">
      <mat-card-content>
        <div class="profile-info">
          <div class="avatar">
            <mat-icon>account_circle</mat-icon>
          </div>
          <div class="profile-details">
            <h2>{{ content.profile.name }}</h2>
            <p class="position">{{ content.profile.position }} at {{ content.profile.company }}</p>
            <p class="bio">{{ content.profile.bio }}</p>
            <div class="skills">
              @for (skill of content.skills; track skill) {
                <mat-chip>{{ skill }}</mat-chip>
              }
            </div>
          </div>
        </div>
      </mat-card-content>
    </mat-card>

    <div class="profile-sections">
      <mat-card class="personal-info">
        <mat-card-header>
          <mat-card-title>Personal Information</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="form-grid">
            <mat-form-field>
              <mat-label>Full Name</mat-label>
              <input matInput [value]="content.profile.name" placeholder="Full Name"  readonly>
              <mat-icon matPrefix>person</mat-icon>
            </mat-form-field>
            <mat-form-field>
              <mat-label>Email</mat-label>
              <input matInput [value]="content.profile.email" placeholder="Email" readonly>
              <mat-icon matPrefix>email</mat-icon>
            </mat-form-field>
            <mat-form-field>
              <mat-label>Phone</mat-label>
              <input matInput [value]="content.profile.phone" placeholder="Phone" readonly>
              <mat-icon matPrefix>phone</mat-icon>
            </mat-form-field>
            <mat-form-field>
              <mat-label>Location</mat-label>
              <input matInput [value]="content.profile.location" placeholder="Location" readonly>
              <mat-icon matPrefix>location_on</mat-icon>
            </mat-form-field>
            <mat-form-field>
              <mat-label>Company</mat-label>
              <input matInput [value]="content.profile.company" placeholder="Company" readonly>
              <mat-icon matPrefix>work</mat-icon>
            </mat-form-field>
            <mat-form-field>
              <mat-label>Position</mat-label>
              <input matInput [value]="content.profile.position" placeholder="Position"  readonly>
              <mat-icon matPrefix>work</mat-icon>
            </mat-form-field>
          </div>
        </mat-card-content>
      </mat-card>

      <mat-card class="settings-card">
        <mat-card-header>
          <mat-card-title>Settings</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-list>
            <mat-list-item>
              <mat-icon matListItemIcon>notifications</mat-icon>
              <span matListItemTitle>Email Notifications</span>
              <mat-slide-toggle matListItemMeta [checked]="content.settings.emailNotifications"></mat-slide-toggle>
            </mat-list-item>
            <mat-list-item>
              <mat-icon matListItemIcon>notifications</mat-icon>
              <span matListItemTitle>Push Notifications</span>
              <mat-slide-toggle matListItemMeta [checked]="content.settings.pushNotifications"></mat-slide-toggle>
            </mat-list-item>
            <mat-list-item>
              <mat-icon matListItemIcon>palette</mat-icon>
              <span matListItemTitle>Dark Mode</span>
              <mat-slide-toggle matListItemMeta [checked]="content.settings.darkMode"></mat-slide-toggle>
            </mat-list-item>
            <mat-list-item>
              <mat-icon matListItemIcon>security</mat-icon>
              <span matListItemTitle>Two-Factor Auth</span>
              <mat-slide-toggle matListItemMeta [checked]="content.settings.twoFactorAuth"></mat-slide-toggle>
            </mat-list-item>
          </mat-list>
        </mat-card-content>
      </mat-card>
    </div>
  </div>
</div>`;

      scss = `.profile { padding: 1rem; }
.profile-header { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; margin-bottom: 2rem; gap: 1rem; }
.title { font-size: clamp(1.8rem, 5vw, 2rem); font-weight: bold; color: #1976d2; margin: 0; line-height: 1.2; }

.profile-content { display: grid; gap: 2rem; }
.profile-info { display: flex; align-items: center; justify-content: flex-start; gap: 2rem; flex-wrap: nowrap; }
.avatar mat-icon { font-size: 5rem; width: 5rem; height: 5rem; color: #666; flex-shrink: 0; }
.profile-details h2 { margin: 0 0 0.25rem 0; font-size: 1.5rem; }
.position, .bio { color: #666; font-size: 0.95rem; margin: 0 0 0.5rem 0; }
.skills { display: flex; flex-wrap: wrap; gap: 0.5rem; }

.profile-sections { display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; }
.personal-info, .settings-card { width: 100%; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-grid mat-form-field { width: 100%; }

@media (max-width: 1024px) { .profile-sections { grid-template-columns: 1fr; } }
@media (max-width: 768px) { 
  .profile-info { flex-direction: column; align-items: center; text-align: center; } 
  .avatar mat-icon { font-size: 4rem; width: 4rem; height: 4rem; margin-bottom: 0.5rem; } 
  .profile-details h2 { font-size: 1.3rem; } 
  .position, .bio { font-size: 0.9rem; } 
  .form-grid { grid-template-columns: 1fr; } /* ✅ Stack all inputs vertically */
}
@media (max-width: 480px) { 
  .form-grid { grid-template-columns: 1fr; } 
  .profile { padding: 0.75rem; } 
  .title { font-size: 1.6rem; } 
  .form-grid mat-form-field { width: 100%; } 
}`;
      break;
  }

  return { ts, html, scss };
}

function capitalize(s){return s.charAt(0).toUpperCase()+s.slice(1);}

module.exports = { getPageTemplate };