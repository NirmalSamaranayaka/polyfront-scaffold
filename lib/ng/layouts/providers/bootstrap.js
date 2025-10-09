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
  const html = `
<div class="d-flex flex-column min-vh-100">
  <!-- Navbar -->
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary px-3 shadow-sm">
    <a class="navbar-brand fw-bold text-white" routerLink="/">PolyFront - Angular(Bootstrap)</a>

    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarNav"
      aria-controls="navbarNav"
      aria-expanded="false"
      aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav me-auto mb-0 d-flex gap-2">
        <li class="nav-item">
          <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
            Home
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/about" routerLinkActive="active">About</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" routerLink="/profile" routerLinkActive="active">Profile</a>
        </li>
      </ul>

      <!-- Right section: version, language, user -->
      <div class="d-flex align-items-center gap-2">
      <span class="badge bg-light text-dark">v0.0.41</span>

      <label for="langSelect" class="visually-hidden">Select language</label>
      <select id="langSelect" class="form-select form-select-sm bg-light border-0 text-dark">
        <option value="en">English</option>
        <option value="sv">Swedish</option>
      </select>

      <button title="Profile" class="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center">
        <i class="bi bi-person-fill"></i>
      </button>
    </div>

    </div>
  </nav>

  <!-- Main Content -->
  <div class="container my-3 flex-grow-1">
    <router-outlet></router-outlet>
  </div>

  <!-- Footer -->
  <footer class="footer bg-light text-center py-3 mt-auto border-top">
    © 2025 PolyFront — All rights reserved.
  </footer>
</div>
`;
  const scss = `
.footer {
  font-size: 0.9rem;
  color: #6c757d; // Bootstrap secondary color
}

.navbar .nav-link.active {
  font-weight: 600;
  color: #fff !important;
  border-bottom: 2px solid #ffc107; // highlight with a gold underline
}
`;
  return { ts, html, scss };
}

module.exports = { getLayoutSource };