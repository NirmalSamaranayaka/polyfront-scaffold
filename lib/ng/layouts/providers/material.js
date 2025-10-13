function getLayoutSource() {
  const ts = `import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterModule,
    AsyncPipe,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  isOpened = true;
  isMobile$;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isMobile$ = this.breakpointObserver.observe([Breakpoints.Handset])
      .pipe(map(result => result.matches));
  }
}
`;

  const html = `<mat-sidenav-container class="app-container">

  <!-- Sidebar -->
  <mat-sidenav 
    class="sidenav" 
    [mode]="(isMobile$ | async) ? 'over' : 'side'" 
    [opened]="!(isMobile$ | async) || isOpened">
    <mat-toolbar color="primary" class="sidebar-toolbar">PolyFront</mat-toolbar>
    <mat-nav-list>
      <a mat-list-item routerLink="/" routerLinkActive="active-link" [routerLinkActiveOptions]="{ exact: true }">
        <span>Home</span>
      </a>
      <a mat-list-item routerLink="/about" routerLinkActive="active-link">
        <span>About</span>
      </a>
      <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link">
        <span>Dashboard</span>
      </a>
      <a mat-list-item routerLink="/profile" routerLinkActive="active-link">
        <span>Profile</span>
      </a>
    </mat-nav-list>
  </mat-sidenav>

  <!-- Main Content -->
  <mat-sidenav-content>
    <div class="page-content">
      <router-outlet></router-outlet>
    </div>

    <footer class="footer">
      © 2025 PolyFront — All rights reserved.
    </footer>
  </mat-sidenav-content>
</mat-sidenav-container>

<!-- Full-width Topbar -->
<mat-toolbar color="primary" class="topbar-full">
  <button mat-icon-button (click)="isOpened = !isOpened">
    <mat-icon>menu</mat-icon>
  </button>

  <span class="title">PolyFront - Angular (Material)</span>

  <span class="spacer"></span>

  <span class="version-badge">v0.0.44</span>

  <button mat-icon-button aria-label="Notifications">
    <mat-icon>notifications</mat-icon>
  </button>

  <button mat-icon-button aria-label="Profile">
    <mat-icon>account_circle</mat-icon>
  </button>
</mat-toolbar>
`;

  const scss = `.app-container {
  height: 100vh;
}

/* Sidebar */
.sidenav {
  width: 250px;
  background: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  transition: width 0.3s ease;
}

.sidebar-toolbar {
  font-weight: 600;
  font-size: 1.2rem;
}

.sidenav a.mat-list-item {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 50px;
  padding: 0 20px;
  border-radius: 8px;
  transition: background 0.2s;
}

.sidenav a.mat-list-item:hover {
  background: #e3f2fd;
}

/* Active page highlight */
.sidenav a.mat-list-item.active-link {
  background: #1976d2;
  color: #fff;

  span {
    font-weight: 600;
  }

  mat-icon {
    color: #fff;
  }
}

.sidenav a.mat-list-item mat-icon {
  font-size: 24px;
  color: #1976d2;
}

/* Full-width Topbar */
.topbar-full {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2000;
  display: flex;
  align-items: center; /* vertical centering for all items */
  padding: 0 16px;
  height: 64px;
  background: #1976d2;
  color: #fff;
}

.title {
  font-weight: 600;
  font-size: 1.25rem;
}

.spacer {
  flex: 1 1 auto;
}

.version-badge {
  background: rgba(255,255,255,0.2);
  color: #fff;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.8rem;
  margin-right: 12px;
}

.mat-icon-button {
  color: #fff;
}

/* Main Content */
.page-content {
  padding: 88px 24px 24px; /* topbar height + spacing */
  min-height: calc(100vh - 64px - 60px);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Footer */
.footer {
  text-align: center;
  padding: 12px 0;
  font-size: 0.9rem;
  background: #f1f1f1;
  border-top: 1px solid #e0e0e0;
}
`;

  return { ts, html, scss };
}

module.exports = { getLayoutSource };
