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
      html = `<div class="wrap home">
      <!-- Hero -->
      <section class="hero">
        <h1 class="title">{{ content.title }}</h1>
        <p class="subtitle">{{ content.intro }}</p>
        <p class="muted">{{ content.description }}</p>
      </section>

      <!-- Features -->
      <section class="cards">
        @for (feature of content.features; track feature.title) {
          <p-card class="home-card">
            <ng-template pTemplate="content">
              <div class="center">
                <i [class]="feature.icon" class="feature-icon mono-icon"></i>
                <h3 class="card-title">{{ feature.title }}</h3>
                <p class="muted">{{ feature.description }}</p>
              </div>
            </ng-template>
          </p-card>
        }
      </section>

      <!-- Value band -->
      <section class="value-band">
        <p-card>
          <ng-template pTemplate="content">
            <div class="band-inner">
              <div>
                <h2 class="section-title">Built for Teams. Ready for Production.</h2>
                <p class="muted">
                  Opinionated structure, PrimeNG components, routing, tests and utilities—ready to ship.
                </p>
              </div>
              <div class="row gap">
                <p-button label="View Document" icon="pi pi-desktop" severity="secondary" />
                  <p-button label="Learn More" icon="pi pi-arrow-right" />
              </div>
            </div>
          </ng-template>
        </p-card>
      </section>
    </div>`;
      scss = baseScss()+ `
    /* --- Home (PrimeNG, black & white) --- */
    .home .hero { text-align: center; display: grid; justify-items: center; gap: .5rem; padding: 1rem 0 1.25rem; }
    .hero-cta { margin-top: .5rem; }

    .home-card {
      background: var(--p-surface-0);
      border: 1px solid var(--p-surface-200);
      border-radius: 12px;
      box-shadow: 0 2px 0 rgba(0,0,0,.02);
    }

    .mono-icon { color: var(--p-primary-800); }
    .feature-icon { font-size: 2rem; margin-bottom: .5rem; }

    /* Value band */
    .value-band p-card {
      background: var(--p-surface-0);
      border: 1px solid var(--p-surface-200);
      border-radius: 12px;
    }
    .band-inner {
      display: grid;
      grid-template-columns: 1fr auto;
      align-items: center;
      gap: 1rem;
    }
    @media (max-width: 800px) {
      .band-inner { grid-template-columns: 1fr; justify-items: center; text-align: center; }
    }
    `;
      break;

    case 'about':
      html = `<div class="wrap">
      <div class="section center">
        <h1 class="title">{{ content.title }}</h1>
        <p class="subtitle">{{ content.intro }}</p>
      </div>

      <div class="grid-2 mb">
        <!-- Technology Stack -->
        <p-card header="Technology Stack">
          <ng-template pTemplate="content">
            <p class="muted">Built with the latest and greatest technologies in the Angular ecosystem.</p>

            <div class="tech-grid">
              @for (tech of content.techStack; track tech.name) {
                <div class="tech-chip">
                  <p-tag [value]="tech.name" styleClass="tag-mono"></p-tag>
                  <div class="chip-caption">
                    <span class="muted">{{ tech.category }}</span>
                    <span class="dot"></span>
                    <span class="muted">{{ tech.version }}</span>
                  </div>
                </div>
              }
            </div>
          </ng-template>
        </p-card>

        <!-- Key Features -->
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

      <!-- Why Choose PolyFront -->
      <p-card>
        <ng-template pTemplate="content">
          <div class="center">
            <h2 class="section-title">Why Choose PolyFront?</h2>
          </div>

          <div class="grid-3 why">
            @for (b of content.benefits; track b.title) {
              <div class="col center">
                <i class="{{ b.icon }} icon mono-icon"></i>
                <h3 class="benefit-title">{{ b.title }}</h3>
                <p class="muted">{{ b.description }}</p>
              </div>
            }
          </div>
        </ng-template>
      </p-card>
    </div>`;

      scss = baseScss() + `
    /* --- About (PrimeNG, Black & White) --- */
    p-card { background: var(--p-surface-0); color: var(--p-text-color); border-radius: 10px; }

    .tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: .85rem 1rem;
      margin-top: .75rem;
    }
    .tech-chip { display: flex; flex-direction: column; align-items: flex-start; gap: .35rem; }
    .tag-mono.p-tag {
      background: var(--p-surface-100);
      color: var(--p-primary-800);
      border: 1px solid var(--p-surface-200);
      font-weight: 600;
    }
    .chip-caption { display: flex; align-items: center; gap: .5rem; font-size: .8rem; }
    .chip-caption .dot { width: 4px; height: 4px; border-radius: 50%; background: var(--p-text-color-secondary); opacity: .6; }

    /* Benefits */
    .why .mono-icon { color: var(--p-primary-800); }      /* force monochrome icons */
    .benefit-title { margin: .25rem 0 .35rem; }

    /* List ticks */
    .list { list-style: none; padding: 0; margin: 0; display: grid; gap: .55rem; }
    .list .pi { margin-right: .5rem; }

    /* Responsive touch-up */
    @media (max-width: 1024px) {
      .grid-3.why { grid-template-columns: 1fr; }
    }
    `;
  break;

    case 'dashboard':
    html = `<div class="wrap">
    <h1 class="page-title">{{ content.title }}</h1>
    <p class="subtitle">{{ content.intro }}</p>

    <!-- Stats -->
    <div class="grid-4 stats">
      <p-card class="stat-card">
        <ng-template pTemplate="content">
          <div class="row between align">
            <div>
              <p class="muted small strong">Total Users</p>
              <p class="stat">{{ content.stats.users | number }}</p>
              <p class="trend small">+12% from last month</p>
            </div>
            <i class="pi pi-users icon-large"></i>
          </div>
        </ng-template>
      </p-card>

      <p-card class="stat-card">
        <ng-template pTemplate="content">
          <div class="row between align">
            <div>
              <p class="muted small strong">Revenue</p>
              <p class="stat">\${{ content.stats.revenue | number }}</p>
              <p class="trend small">+8% from last month</p>
            </div>
            <i class="pi pi-dollar icon-large"></i>
          </div>
        </ng-template>
      </p-card>

      <p-card class="stat-card">
        <ng-template pTemplate="content">
          <div class="row between align">
            <div>
              <p class="muted small strong">Orders</p>
              <p class="stat">{{ content.stats.orders }}</p>
              <p class="trend small">+15% from last month</p>
            </div>
            <i class="pi pi-shopping-cart icon-large"></i>
          </div>
        </ng-template>
      </p-card>

      <p-card class="stat-card">
        <ng-template pTemplate="content">
          <div class="row between align">
            <div>
              <p class="muted small strong">Page Views</p>
              <p class="stat">{{ content.stats.views | number }}</p>
              <p class="trend small">+22% from last month</p>
            </div>
            <i class="pi pi-eye icon-large"></i>
          </div>
        </ng-template>
      </p-card>
    </div>

    <!-- Content -->
    <div class="grid-3">
      <div class="span-2">
        <p-card header="Top Products">
          <ng-template pTemplate="content">
            <p-table [value]="content.topProducts" class="mono-table">
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
                    <span class="pill" [ngClass]="{ up: product.growth >= 0, down: product.growth < 0 }">
                      {{ (product.growth >= 0 ? '+' : '') + product.growth + '%' }}
                    </span>
                  </td>
                </tr>
              </ng-template>
            </p-table>
          </ng-template>
        </p-card>
      </div>

      <div>
        <p-card header="Recent Activity" class="activity-card">
          <ng-template pTemplate="content">
            <div class="col gap">
              @for (a of content.recentActivity; track a.id) {
                <div class="row align-start gap-sm activity-item">
                  <div class="activity-icon-box">
                    <i class="pi"
                      [ngClass]="{
                        'pi-check-circle': a.status === 'success',
                        'pi-exclamation-triangle': a.status === 'warning',
                        'pi-times-circle': a.status === 'error'
                      }"
                      class="activity-icon"></i>
                  </div>
                  <div class="activity-text">
                    <p class="strong">{{ a.action }}</p>
                    <p class="muted small">{{ a.user }} — {{ a.time }}</p>
                  </div>
                </div>
              }
            </div>
          </ng-template>
        </p-card>
      </div>
    </div>
  </div>`;

    scss = baseScss() + `
  /* ---- Dashboard (PrimeNG, monochrome) ---- */
  .page-title { font-size: 2.25rem; font-weight: 800; margin: 0 0 .25rem; }

  /* stat cards */
  .grid-4.stats { gap: 1rem; margin-top: .75rem; margin-bottom: 1rem; }
  .stat-card {
    background: var(--p-surface-0);
    border: 1px solid var(--p-surface-200);
    box-shadow: 0 2px 0 rgba(0,0,0,.02);
    border-radius: 12px;
  }
  .icon-large { font-size: 2rem; color: var(--p-primary-800); }
  .stat { font-size: 2rem; font-weight: 800; margin: .25rem 0; }
  .trend { color: var(--text-color-secondary); }

  /* table styling */
  .mono-table .p-datatable-thead > tr > th {
    background: var(--p-surface-0);
    border-bottom: 1px solid var(--p-surface-200);
    font-weight: 700;
  }
  .mono-table .p-datatable-tbody > tr > td {
    border-top: 1px solid var(--p-surface-200);
  }

  /* neutral growth pill (no color) */
  .pill {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 52px; padding: .2rem .55rem; border-radius: 9999px;
    border: 1px solid var(--p-surface-200);
    background: var(--p-surface-0);
    font-size: .875rem; font-weight: 600;
    color: var(--p-primary-800);
  }
  .pill.down { opacity: .8; }

  /* recent activity — matches your reference image */
  .activity-card {
    background: var(--p-surface-0);
    border: 1px solid var(--p-surface-200);
    border-radius: 12px;
    box-shadow: 0 1px 2px rgba(0,0,0,.03);
  }
  .activity-item { padding: .45rem 0; border-bottom: 1px solid var(--p-surface-100); }
  .activity-item:last-child { border-bottom: none; }

  .activity-icon-box {
    flex-shrink: 0;
    width: 32px; height: 32px; border-radius: 50%;
    background: var(--p-surface-100);
    display: flex; align-items: center; justify-content: center;
  }
  .activity-icon { font-size: 1.1rem; color: var(--p-primary-800); }
  .activity-text { flex: 1; line-height: 1.3; }
  .activity-text .strong { font-weight: 600; margin: 0 0 .15rem; }
  .activity-text .muted { color: var(--text-color-secondary); }

  .gap-sm { gap: .6rem; }
  `;
    break;

    case 'profile':
      html = `<div class="wrap profile">
  <div class="row between align mb">
    <h1 class="page-title">{{ content.title }}</h1>
    <p-button label="Edit Profile" icon="pi pi-pencil" />
  </div>

  <!-- Hero / Summary -->
  <p-card class="hero-card mb">
    <ng-template pTemplate="content">
      <div class="row align gap">
        <div class="avatar hero-avatar">
          <i class="pi pi-user avatar-icon"></i>
        </div>
        <div class="grow">
          <h2 class="strong name">{{ content.profile.name }}</h2>
          <p class="muted">{{ content.profile.position }} at {{ content.profile.company }}</p>
          <p class="muted">{{ content.profile.bio }}</p>

          <div class="row wrap gap xs chips">
            @for (skill of content.skills; track skill) {
              <p-tag [value]="skill" styleClass="chip-mono"></p-tag>
            }
          </div>
        </div>
      </div>
    </ng-template>
  </p-card>

  <!-- Details + Settings -->
  <div class="grid-3">
    <div class="span-2">
      <p-card header="Personal Information" class="info-card">
  <ng-template pTemplate="content">
    <div class="info-grid">
      <!-- Full Name -->
      <div class="info-field">
        <label>Full Name</label>
        <div class="control-row">
          <div class="icon-chip"><i class="pi pi-id-card"></i></div>
          <input pInputText [readonly]="true" [value]="content.profile.name" class="readonly-input" />
        </div>
      </div>

      <!-- Email -->
      <div class="info-field">
        <label>Email</label>
        <div class="control-row">
          <div class="icon-chip"><i class="pi pi-envelope"></i></div>
          <input pInputText [readonly]="true" [value]="content.profile.email" class="readonly-input" />
        </div>
      </div>

      <!-- Phone -->
      <div class="info-field">
        <label>Phone</label>
        <div class="control-row">
          <div class="icon-chip"><i class="pi pi-phone"></i></div>
          <input pInputText [readonly]="true" [value]="content.profile.phone" class="readonly-input" />
        </div>
      </div>

      <!-- Location -->
      <div class="info-field">
        <label>Location</label>
        <div class="control-row">
          <div class="icon-chip"><i class="pi pi-map-marker"></i></div>
          <input pInputText [readonly]="true" [value]="content.profile.location" class="readonly-input" />
        </div>
      </div>

      <!-- Company -->
      <div class="info-field">
        <label>Company</label>
        <div class="control-row">
          <div class="icon-chip"><i class="pi pi-briefcase"></i></div>
          <input pInputText [readonly]="true" [value]="content.profile.company" class="readonly-input" />
        </div>
      </div>

      <!-- Position -->
      <div class="info-field">
        <label>Position</label>
        <div class="control-row">
          <div class="icon-chip"><i class="pi pi-cog"></i></div>
          <input pInputText [readonly]="true" [value]="content.profile.position" class="readonly-input" />
        </div>
      </div>
    </div>
  </ng-template>
      </p-card>
    </div>

    <div>
      <p-card header="Settings" class="settings-card">
        <ng-template pTemplate="content">
          <div class="col gap">
            <div class="row between align setting-row">
              <div class="row align gap xs">
                <i class="pi pi-bell"></i><span>Email Notifications</span>
              </div>
              <p-toggleswitch [(ngModel)]="content.settings.emailNotifications" [disabled]="true"></p-toggleswitch>
            </div>

            <div class="row between align setting-row">
              <div class="row align gap xs">
                <i class="pi pi-bell"></i><span>Push Notifications</span>
              </div>
              <p-toggleswitch [(ngModel)]="content.settings.pushNotifications" [disabled]="true"></p-toggleswitch>
            </div>

            <div class="row between align setting-row">
              <div class="row align gap xs">
                <i class="pi pi-palette"></i><span>Dark Mode</span>
              </div>
              <p-toggleswitch [(ngModel)]="content.settings.darkMode" [disabled]="true"></p-toggleswitch>
            </div>

            <div class="row between align setting-row">
              <div class="row align gap xs">
                <i class="pi pi-shield"></i><span>Two-Factor Auth</span>
              </div>
              <p-toggleswitch [(ngModel)]="content.settings.twoFactorAuth" [disabled]="true"></p-toggleswitch>
            </div>
          </div>
        </ng-template>
      </p-card>
    </div>
  </div>
</div>`;
      scss = baseScss()+ `
    /* ---- Personal Information (readonly input + icon) ---- */
.info-card {
  background: var(--p-surface-0);
  border: 1px solid var(--p-surface-200);
  border-radius: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem 1.25rem;
}

.info-field > label {
  display: block;
  font-size: .8rem;
  color: var(--text-color-secondary);
  margin-bottom: .35rem;
}

.control-row {
  display: flex;
  align-items: center;
  gap: .75rem;
}

/* icon on left */
.icon-chip {
  width: 44px; height: 44px; flex: 0 0 44px;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid var(--p-surface-200);
  border-radius: 10px;
  background: var(--p-surface-0);
  color: var(--p-primary-800);
}

/* readonly input */
.readonly-input {
  flex: 1;
  height: 44px;
  border-radius: 12px !important;
  border: 1px solid var(--p-surface-200) !important;
  background: var(--p-surface-0) !important;
  color: var(--p-text-color) !important;
  font-weight: 600;
  padding: 0 .9rem !important;
  pointer-events: none;       /* read-only visual only */
}

/* Remove PrimeNG shadows/focus rings for readonly mode */
.readonly-input:focus {
  box-shadow: none !important;
  border-color: var(--p-surface-200) !important;
}

/* --- Align name, bio, and chips flush left --- */
.grow {
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
  margin-top: .5rem;
  padding-left: 0; 
  justify-content: flex-start; 
}

/* Responsive single column */
@media (max-width: 900px) {
  .info-grid { grid-template-columns: 1fr; }
}

    `;
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