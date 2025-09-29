function getLayoutSource() {
  const ts = `import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {}
`;
  const html = `<nav class="navbar navbar-expand navbar-light bg-light" style="padding: 0 12px;">
  <a class="navbar-brand" routerLink="/">Polyfront Angular (Bootstrap)</a>
  <ul class="navbar-nav ml-auto" style="display:flex; gap:8px; list-style:none; margin:0;">
    <li class="nav-item"><a class="nav-link" routerLink="/about">About</a></li>
    <li class="nav-item"><a class="nav-link" routerLink="/dashboard">Dashboard</a></li>
    <li class="nav-item"><a class="nav-link" routerLink="/profile">Profile</a></li>
  </ul>
</nav>
<div class="container mt-3">
  <router-outlet></router-outlet>
</div>
`;
  const scss = ``;
  return { ts, html, scss };
}

module.exports = { getLayoutSource };