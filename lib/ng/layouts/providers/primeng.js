function getLayoutSource() {
  const ts = `import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, MenubarModule, ButtonModule, DrawerModule, AvatarModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  mobileMenuOpen = signal(false);

  items: MenuItem[] = [
    { label: 'Home', routerLink: '/' },
    { label: 'About', routerLink: '/about' },
    { label: 'Dashboard', routerLink: '/dashboard' },
    { label: 'Profile', routerLink: '/profile' }
  ];
}
`;
  const html = `<header class="p-3 border-bottom surface-0">
  <div class="container row between wrap">
    <div class="row">
      <button pButton type="button" class="mr-2 md:hidden" icon="pi pi-bars" (click)="mobileMenuOpen.set(true)"></button>
      <span class="text-primary font-bold" style="font-size:1.25rem">PolyFront</span>
      <span class="ml-2 muted">— Angular (PrimeNG)</span>
    </div>

    <p-menubar [model]="items" class="hidden md:flex"></p-menubar>

    <div class="row">
      <p-avatar icon="pi pi-user" shape="circle"></p-avatar>
    </div>
  </div>
</header>

<p-drawer
  header="Menu"
  [visible]="mobileMenuOpen()"
  (visibleChange)="mobileMenuOpen.set($event)"
  position="left"
  styleClass="md:hidden"
>
  <nav class="p-fluid">
    @for (i of items; track i) {
      <!-- Use projected label to avoid icon-only edge cases on mobile -->
      <a pButton class="nav-button" [routerLink]="i.routerLink">
        <span class="nav-label">{{ i.label }}</span>
      </a>
    }
  </nav>
</p-drawer>

<main class="container section">
  <router-outlet></router-outlet>
</main>

<footer class="container section muted" style="font-size:.875rem">
  © 2025 PolyFront — All rights reserved.
</footer>
`;
  const scss = `header { position: sticky; top: 0; z-index: 100; background: var(--p-surface-0); }
.md\:hidden { display: none; }
@media (max-width:768px) {
  .md\:hidden { display: inline-flex; }
  .hidden.md\:flex { display: none; }
}
.mr-2 { margin-right: .5rem; }
.ml-2 { margin-left: .5rem; }

.nav-button { margin-block: .5rem; width: 100%; text-align: left; }
.nav-label { display: inline; }
`;
  return { ts, html, scss };
}

module.exports = { getLayoutSource };