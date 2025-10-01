function getLayoutSource() {
  const ts = `import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterModule,
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
}
`;

  const html = `<mat-sidenav-container class="app-container">
  <!-- Sidebar -->
  <mat-sidenav class="sidenav" mode="side" [opened]="isOpened">
    <mat-toolbar color="primary">PolyFront</mat-toolbar>
    <mat-nav-list>
      <a mat-list-item routerLink="/">
        <mat-icon>home</mat-icon>
        <span>Home</span>
      </a>
      <a mat-list-item routerLink="/about">
        <mat-icon>info</mat-icon>
        <span>About</span>
      </a>
      <a mat-list-item routerLink="/dashboard">
        <mat-icon>dashboard</mat-icon>
        <span>Dashboard</span>
      </a>
      <a mat-list-item routerLink="/profile">
        <mat-icon>person</mat-icon>
        <span>Profile</span>
      </a>
    </mat-nav-list>
  </mat-sidenav>

  <!-- Main Content -->
  <mat-sidenav-content>
    <mat-toolbar color="primary" class="topbar">
      <button mat-icon-button (click)="isOpened = !isOpened">
        <mat-icon>menu</mat-icon>
      </button>
      <span class="title">Polyfront Angular (Material)</span>
      <span class="spacer"></span>
      <button mat-icon-button><mat-icon>notifications</mat-icon></button>
      <button mat-icon-button><mat-icon>account_circle</mat-icon></button>
    </mat-toolbar>

    <div class="page-content">
      <router-outlet></router-outlet>
    </div>

    <footer class="footer">
      © 2025 PolyFront — All rights reserved.
    </footer>
  </mat-sidenav-content>
</mat-sidenav-container>
`;

  const scss = `.app-container {
  height: 100vh;
}

.sidenav {
  width: 240px;
  background: #fafafa;
}

/* Sidebar list item fix */
.sidenav a.mat-list-item {
  display: flex;
  align-items: center;       /* vertically center icon + text */
  justify-content: flex-start;
  gap: 12px;
  height: 48px;              /* consistent Material spec height */
  line-height: 1;
  padding: 0 16px;
}

.sidenav a.mat-list-item .mat-list-item-content {
  display: flex;
  align-items: center;       /* ensures both icon + text align */
  gap: 12px;
  width: 100%;
}

.sidenav a.mat-list-item mat-icon {
  font-size: 20px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.topbar {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.title {
  font-weight: 600;
  margin-left: 8px;
}

.spacer {
  flex: 1 1 auto;
}

.page-content {
  padding: 1.5rem;
  min-height: calc(100vh - 64px - 40px);
}

.footer {
  text-align: center;
  padding: 1rem;
  opacity: 0.7;
  font-size: 0.9rem;
  border-top: 1px solid #eee;
}
`;

  return { ts, html, scss };
}

module.exports = { getLayoutSource };
