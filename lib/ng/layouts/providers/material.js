function getLayoutSource() {
  const ts = `import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, MatToolbarModule, MatButtonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {}
`;
  const html = `<mat-toolbar color="primary">Polyfront Angular (Material)</mat-toolbar>
<div class="container" style="padding:16px">
  <nav style="margin-bottom: 16px; display:flex; gap: 8px">
    <a mat-raised-button color="primary" routerLink="/">Home</a>
    <a mat-button routerLink="/about">About</a>
    <a mat-button routerLink="/dashboard">Dashboard</a>
    <a mat-button routerLink="/profile">Profile</a>
  </nav>
  <router-outlet></router-outlet>
  <footer style="margin-top:24px;opacity:.7">Footer</footer>
</div>
`;
  const scss = ``;
  return { ts, html, scss };
}

module.exports = { getLayoutSource };