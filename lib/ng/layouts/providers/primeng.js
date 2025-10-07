function getLayoutSource() {
  const ts = `import { Component, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { AvatarModule } from 'primeng/avatar';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

type Mode = 'light' | 'dark';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MenubarModule, ButtonModule, DrawerModule, AvatarModule, ToggleSwitchModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  mobileMenuOpen = signal(false);

  items: MenuItem[] = [
    { label: 'Home', routerLink: '/' },
    { label: 'About', routerLink: '/about' },
    { label: 'Dashboard', routerLink: '/dashboard' },
    { label: 'Profile', routerLink: '/profile' }
  ];

  // header controls
  version = signal('v1.0.37');
  languages = [{ label: 'English', value: 'en' }, { label: 'Svenska', value: 'sv' }];
  lang = signal<'en' | 'sv'>(this.readLang());

  mode = signal<Mode>(this.readMode());

  constructor() {
    // Only run effects in the browser
    if (this.isBrowser) {
      effect(() => this.applyTheme(this.mode()));
      effect(() => localStorage.setItem('pf-lang', this.lang()));
    }
  }

  onModeToggle(checked: boolean) {
    this.mode.set(checked ? 'dark' : 'light');
  }

  // --- helpers (SSR-safe) ---
  private readLang(): 'en' | 'sv' {
    if (!this.isBrowser) return 'en';
    return ((localStorage.getItem('pf-lang') as 'en' | 'sv') || 'en');
  }

  private readMode(): Mode {
    if (!this.isBrowser) return 'light';
    const saved = localStorage.getItem('pf-mode') as Mode | null;
    if (saved) return saved;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  }

  private applyTheme(m: Mode) {
    if (!this.isBrowser) return;
    const root = document.documentElement;
    root.setAttribute('data-theme', m);
    (root as any).style.colorScheme = m === 'dark' ? 'dark' : 'light';
    localStorage.setItem('pf-mode', m);
  }
}
`;
  const html = `<div class="app">
  <header class="header">
    <div class="header-inner">
      <div class="left row">
        <button pButton type="button" class="mr-2 md:hidden" icon="pi pi-bars" (click)="mobileMenuOpen.set(true)">""</button>
        <span class="brand">PolyFront</span>
        <span class="ml-2 muted">— Angular (PrimeNG)</span>
      </div>

      <p-menubar [model]="items" class="nav hidden md:flex"></p-menubar>

      <div class="right row gap">
        <span class="badge">{{ version() }}</span>

        <!-- simple native language dropdown -->
        <select  title="Select Language" class="lang-select" [ngModel]="lang()" (ngModelChange)="lang.set($event)">
          <option *ngFor="let l of languages" [value]="l.value">{{ l.label }}</option>
        </select>

        <!-- light/dark toggle -->
        <div class="mode row align gap-xs">
          <i class="pi pi-sun"></i>
          <p-toggleswitch
            [ngModel]="mode() === 'dark'"
            (ngModelChange)="onModeToggle($event)">
          </p-toggleswitch>
          <i class="pi pi-moon"></i>
        </div>

        <p-avatar icon="pi pi-user" shape="circle"></p-avatar>
      </div>
    </div>
  </header>

  <p-drawer header="Menu" [visible]="mobileMenuOpen()" (visibleChange)="mobileMenuOpen.set($event)" position="left" styleClass="md:hidden">
    <nav class="p-fluid">
      @for (i of items; track i) {
        <a pButton class="nav-button" [routerLink]="i.routerLink"><span class="nav-label">{{ i.label }}</span></a>
      }
    </nav>
  </p-drawer>

  <main class="main"><div class="main-inner"><router-outlet></router-outlet></div></main>

  <footer class="footer"><div class="footer-inner muted">© 2025 PolyFront — All rights reserved.</div></footer>
</div>`;
  const scss = `:host { display:block; }

/* Flex shell */
.app { min-height: 100dvh; display: flex; flex-direction: column; }
.main { flex: 1 1 auto; min-height: 0; overflow: auto; }
.main-inner { max-width: 1120px; margin-inline: auto; padding: 1.25rem 1rem; }

/* Header */
.header { position: sticky; top: 0; z-index: 100; background: var(--p-surface-0); border-bottom: 1px solid var(--surface-200); }
.header-inner { max-width: 1120px; margin-inline: auto; padding: .6rem 1rem; display:flex; align-items:center; justify-content:space-between; gap:1rem; }
.brand { color: var(--primary-color); font-weight: 700; font-size: 1.25rem; }

/* Footer */
.footer { background: var(--p-surface-0); border-top: 1px solid var(--surface-200); }
.footer-inner { max-width: 1120px; margin-inline: auto; padding: .75rem 1rem; display:flex; justify-content:center; align-items:center; text-align:center; }

/* Controls */
.badge { background: var(--p-surface-100); border: 1px solid var(--p-surface-200); border-radius: 9999px; padding: .15rem .6rem; font-size: .8rem; }
.lang-select {
  height: 32px; padding: 0 .65rem; border-radius: 9999px;
  border: 1px solid var(--p-surface-200); background: var(--p-surface-0); color: var(--p-text-color);
}
.mode i { font-size: .95rem; color: var(--text-color-secondary); }

/* Utilities */
.row { display:flex; align-items:center; }
.gap { gap: .75rem; } .gap-xs { gap: .35rem; }
.muted { color: var(--text-color-secondary); }
.mr-2 { margin-right: .5rem; } .ml-2 { margin-left: .5rem; }

.md\\:hidden { display: none; }
.hidden.md\\:flex { display: flex; }
@media (max-width:768px) { .md\\:hidden { display: inline-flex; } .hidden.md\\:flex { display: none; } }

/* Drawer nav */
.nav-button { margin-block: .5rem; width: 100%; text-align: left; }
.nav-label { display: inline; }`;
  return { ts, html, scss };
}

module.exports = { getLayoutSource };