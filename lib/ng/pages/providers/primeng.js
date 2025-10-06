const { getPageContent } = require("./content");

function getPageTemplate(pageName, content) {
  const ts = `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-${pageName}',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    TagModule,
    TableModule,
    InputTextModule,
    ToggleSwitchModule,
    DividerModule,
    PanelModule
  ],
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
      html = `<div class="wrap">
  <div class="section center">
    <h1 class="title">{{ content.title }}</h1>
    <p class="subtitle">{{ content.intro }}</p>
    <p class="muted">{{ content.description }}</p>
  </div>

  <div class="cards">
    @for (feature of content.features; track feature.title) {
      <p-card>
      <ng-template pTemplate="content">
        <div class="center">
          <i [class]="feature.icon" [ngClass]="feature.color" class="feature-icon"></i>
          <h3 class="card-title">{{ feature.title }}</h3>
          <p class="muted">{{ feature.description }}</p>
        </div>
      </ng-template>
    </p-card>
    }
  </div>

  <p-card>
    <ng-template pTemplate="content">
      <div class="center">
        <h2 class="section-title">Ready to Get Started?</h2>
        <p class="muted">This scaffold includes routing, state management, API integration, testing, and much more.</p>
        <div class="row gap">
          <p-button label="View Documentation" icon="pi pi-book" />
          <p-button label="Learn More" icon="pi pi-info-circle" severity="secondary" />
        </div>
      </div>
    </ng-template>
  </p-card>
</div>`;
      scss = baseScss();
      break;

    case 'about':
      html = `<div class="wrap">
  <div class="section center">
    <h1 class="title">{{ content.title }}</h1>
    <p class="subtitle">{{ content.intro }}</p>
  </div>

  <div class="grid-2">
    <p-card header="Technology Stack">
      <ng-template pTemplate="content">
        <p class="muted">Built with the latest and greatest technologies in the Angular ecosystem.</p>
        <div class="row wrap gap">
          @for (tech of content.techStack; track tech.name) {
            <p-tag [value]="tech.name + ' ' + tech.version" severity="info"></p-tag>
          }
        </div>
      </ng-template>
    </p-card>

    <p-card header="Key Features">
      <ng-template pTemplate="content">
        <ul class="list">
          @for (feature of content.features; track feature) {
            <li class="row align">
              <i class="pi pi-check-circle ok"></i>
              <span>{{ feature }}</span>
            </li>
          }
        </ul>
      </ng-template>
    </p-card>
  </div>
</div>`;
      scss = baseScss();
      break;

    case 'dashboard':
      html = `<div class="wrap">
  <h1 class="title">{{ content.title }}</h1>
  <p class="subtitle">{{ content.intro }}</p>

  <div class="grid-4">
    <p-card>
      <ng-template pTemplate="content">
        <div class="row between align">
          <div>
            <p class="muted small">Total Users</p>
            <p class="stat">{{ content.stats.users | number }}</p>
            <p class="good small">+12% from last month</p>
          </div>
          <i class="pi pi-users icon"></i>
        </div>
      </ng-template>
    </p-card>

    <p-card>
      <ng-template pTemplate="content">
        <div class="row between align">
          <div>
            <p class="muted small">Revenue</p>
            <p class="stat">\${{ content.stats.revenue | number }}</p>
            <p class="good small">+8% from last month</p>
          </div>
          <i class="pi pi-dollar icon"></i>
        </div>
      </ng-template>
    </p-card>

    <p-card>
      <ng-template pTemplate="content">
        <div class="row between align">
          <div>
            <p class="muted small">Orders</p>
            <p class="stat">{{ content.stats.orders }}</p>
            <p class="good small">+15% from last month</p>
          </div>
          <i class="pi pi-shopping-cart icon"></i>
        </div>
      </ng-template>
    </p-card>

    <p-card>
      <ng-template pTemplate="content">
        <div class="row between align">
          <div>
            <p class="muted small">Page Views</p>
            <p class="stat">{{ content.stats.views | number }}</p>
            <p class="good small">+22% from last month</p>
          </div>
          <i class="pi pi-eye icon"></i>
        </div>
      </ng-template>
    </p-card>
  </div>

  <div class="grid-3">
    <div class="span-2">
      <p-card header="Top Products">
        <ng-template pTemplate="content">
          <p-table [value]="content.topProducts">
            <ng-template pTemplate="header">
              <tr>
                <th>Product</th>
                <th class="right">Sales</th>
                <th class="right">Revenue</th>
                <th class="right">Growth</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-product>
              <tr>
                <td>{{ product.name }}</td>
                <td class="right">{{ product.sales }}</td>
                <td class="right">\${{ product.revenue | number }}</td>
                <td class="right">
                  <p-tag [value]="(product.growth >= 0 ? '+' : '') + product.growth + '%'"
                         [severity]="product.growth >= 0 ? 'success' : 'danger'"></p-tag>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </ng-template>
      </p-card>
    </div>

    <div>
      <p-card header="Recent Activity">
        <ng-template pTemplate="content">
          <div class="col gap">
            @for (activity of content.recentActivity; track activity.id) {
              <div class="row gap align-start">
                <i class="pi pi-check-circle"
                   [class.ok]="activity.status === 'success'"
                   [class.warn]="activity.status === 'warning'"
                   [class.bad]="activity.status === 'error'"></i>
                <div>
                  <p class="strong">{{ activity.action }}</p>
                  <p class="muted small">{{ activity.user }} — {{ activity.time }}</p>
                </div>
              </div>
            }
          </div>
        </ng-template>
      </p-card>
    </div>
  </div>
</div>`;
      scss = baseScss();
      break;

    case 'profile':
      html = `<div class="wrap">
  <div class="row between align">
    <h1 class="title">{{ content.title }}</h1>
    <p-button label="Edit Profile" icon="pi pi-pencil" />
  </div>

  <p-card class="mb">
    <ng-template pTemplate="content">
      <div class="row align gap">
        <div class="avatar">
          <i class="pi pi-user avatar-icon"></i>
        </div>
        <div class="grow">
          <h2 class="strong">{{ content.profile.name }}</h2>
          <p class="muted">{{ content.profile.position }} at {{ content.profile.company }}</p>
          <p class="muted">{{ content.profile.bio }}</p>
          <div class="row wrap gap xs">
            @for (skill of content.skills; track skill) {
              <p-tag [value]="skill" severity="secondary"></p-tag>
            }
          </div>
        </div>
      </div>
    </ng-template>
  </p-card>

  <div class="grid-3">
    <div class="span-2">
      <p-card header="Personal Information">
        <ng-template pTemplate="content">
          <div class="grid-2">
            <div class="field">
              <label>Full Name</label>
              <input type="text" pInputText [value]="content.profile.name" readonly />
            </div>
            <div class="field">
              <label>Email</label>
              <input type="email" pInputText [value]="content.profile.email" readonly />
            </div>
            <div class="field">
              <label>Phone</label>
              <input type="tel" pInputText [value]="content.profile.phone" readonly />
            </div>
            <div class="field">
              <label>Location</label>
              <input type="text" pInputText [value]="content.profile.location" readonly />
            </div>
            <div class="field">
              <label>Company</label>
              <input type="text" pInputText [value]="content.profile.company" readonly />
            </div>
            <div class="field">
              <label>Position</label>
              <input type="text" pInputText [value]="content.profile.position" readonly />
            </div>
          </div>
        </ng-template>
      </p-card>
    </div>

    <div>
      <p-card header="Settings">
        <ng-template pTemplate="content">
          <div class="col gap">
            <div class="row between align">
              <div class="row align gap xs">
                <i class="pi pi-bell"></i><span>Email Notifications</span>
              </div>
              <p-toggleswitch [(ngModel)]="content.settings.emailNotifications" [disabled]="true" />
            </div>
            <div class="row between align">
              <div class="row align gap xs">
                <i class="pi pi-bell"></i><span>Push Notifications</span>
              </div>
              <p-toggleswitch [(ngModel)]="content.settings.pushNotifications" [disabled]="true" />
            </div>
            <div class="row between align">
              <div class="row align gap xs">
                <i class="pi pi-palette"></i><span>Dark Mode</span>
              </div>
              <p-toggleswitch [(ngModel)]="content.settings.darkMode" [disabled]="true" />
            </div>
            <div class="row between align">
              <div class="row align gap xs">
                <i class="pi pi-shield"></i><span>Two-Factor Auth</span>
              </div>
              <p-toggleswitch [(ngModel)]="content.settings.twoFactorAuth" [disabled]="true" />
            </div>
          </div>
        </ng-template>
      </p-card>
    </div>
  </div>
</div>`;
      scss = baseScss();
      break;
  }

  return { ts, html, scss };
}

function baseScss() {
  return `
/* === Layout & Utility Classes === */
.wrap { max-width: 1080px; margin: 0 auto; padding: 1.5rem; }
.section { margin-bottom: 1.5rem; }
.center { text-align: center; display: grid; justify-items: center; padding: 1rem; }
.row { display: flex; }
.col { display: flex; flex-direction: column; }
.between { justify-content: space-between; }
.align { align-items: center; }
.align-start { align-items: flex-start; }
.grow { flex: 1; }
.gap { gap: .75rem; }
.gap.xs { gap: .5rem; }
.mb { margin-bottom: 1rem; }
.right { text-align: right; }

/* === Typography === */
.title { font-size: 2rem; margin: 0 0 .25rem; }
.section-title { font-size: 1.5rem; margin: 0 0 .5rem; }
.card-title { font-size: 1.1rem; margin: .25rem 0; font-weight: 600; }
.subtitle { color: var(--text-color-secondary); margin: 0 0 .5rem; }
.muted { color: var(--text-color-secondary); }
.small { font-size: .875rem; }
.strong { font-weight: 600; }

/* === Colors & States === */
.ok { color: var(--green-500); }
.warn { color: var(--yellow-500); }
.bad { color: var(--red-500); }
.good { color: var(--green-500); }
.icon { font-size: 1.75rem; color: var(--primary-color); }

/* === Grid Systems === */
.cards { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); margin: 1rem 0; }
.grid-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.grid-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.grid-4 { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1rem; }
.span-2 { grid-column: span 2; }

/* === Avatars & Icons === */
.avatar { width: 64px; height: 64px; border-radius: 50%; background: var(--surface-200); display: flex; align-items: center; justify-content: center; }
.avatar-icon { font-size: 1.5rem; color: var(--text-color-secondary); }
.feature-icon { font-size: 2rem; margin-bottom: .5rem; }
.emoji { font-size: 2rem; margin-bottom: .5rem; }

/* === Lists & Stats === */
.list { list-style: none; padding: 0; margin: 0; }
.stat { font-size: 1.5rem; font-weight: 700; }

/* === Responsive Adjustments === */
@media (min-width: 1024px) {
  .cards { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 1024px) {
  .grid-4 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .grid-3 { grid-template-columns: 1fr; }
  .span-2 { grid-column: auto; }
}
@media (max-width: 640px) {
  .cards, .grid-2 { grid-template-columns: 1fr; }
}
`;
}

function capitalize(s){return s.charAt(0).toUpperCase()+s.slice(1);}

module.exports = { getPageTemplate };