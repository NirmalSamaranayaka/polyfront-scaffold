function getLayoutSource() {
  const ts = `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
`;

  const html = `
<div class="flex h-screen bg-gray-100 overflow-hidden">

  <!-- Mobile overlay -->
  <div
    *ngIf="sidebarOpen"
    class="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
    (click)="toggleSidebar()">
  </div>

  <!-- Sidebar -->
  <aside
    [class.translate-x-0]="sidebarOpen"
    [class.-translate-x-full]="!sidebarOpen"
    class="fixed md:static md:translate-x-0 z-30 flex flex-col w-64 bg-gray-900 text-white h-full transform transition-transform duration-300 ease-in-out">
    
    <!-- Sidebar header -->
    <div class="p-6 border-b border-gray-700 flex justify-between items-center">
      <h2 class="text-2xl font-bold text-blue-400">PolyFront</h2>
      <button class="md:hidden text-white" (click)="toggleSidebar()">✖</button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 p-4 space-y-2">
      <a routerLink="/"
         routerLinkActive="bg-gray-800 text-white"
         [routerLinkActiveOptions]="{ exact: true }"
         class="block px-4 py-2 rounded transition-colors text-lg font-medium text-blue-400">
        Home
      </a>
      <a routerLink="/about"
         routerLinkActive="bg-gray-800 text-white"
         class="block px-4 py-2 rounded transition-colors text-lg font-medium text-blue-400">
        About
      </a>
      <a routerLink="/dashboard"
         routerLinkActive="bg-gray-800 text-white"
         class="block px-4 py-2 rounded transition-colors text-lg font-medium text-blue-400">
        Dashboard
      </a>
      <a routerLink="/profile"
         routerLinkActive="bg-gray-800 text-white"
         class="block px-4 py-2 rounded transition-colors text-lg font-medium text-blue-400">
        Profile
      </a>
    </nav>
  </aside>

  <!-- Main content -->
  <div class="flex-1 flex flex-col">

    <!-- Header -->
    <header class="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
      <button class="md:hidden bg-gray-200 p-2 rounded-lg" (click)="toggleSidebar()">☰</button>
      <h4 class="text-xl font-semibold text-gray-900">PolyFront - Angular(Tailwind)</h4>

      <div class="flex items-center gap-3">
        <span class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">v1.0.37</span>
        <select class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">
          <option value="en">English</option>
          <option value="sv">Swedish</option>
        </select>
        <button class="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition-colors">👤</button>
      </div>
    </header>

    <!-- Page content -->
    <main class="flex-1 overflow-auto">
      <div class="p-0 w-full h-full">
        <router-outlet></router-outlet>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-200 text-center py-3 text-sm text-gray-500">
      © 2025 PolyFront — All rights reserved.
    </footer>
  </div>
</div>
`;

  const scss = `
/* Highlighted active tab style (optional override) */
.active-link {
  @apply bg-gray-800 text-white;
}
`;

  return { ts, html, scss };
}

module.exports = { getLayoutSource };