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
  const html = `<header class="w-full bg-gray-900 text-white p-4">Polyfront Angular (Tailwind)</header>
<nav class="p-4 flex gap-3 border-b">
  <a class="text-blue-600" routerLink="/">Home</a>
  <a class="text-blue-600" routerLink="/about">About</a>
  <a class="text-blue-600" routerLink="/dashboard">Dashboard</a>
  <a class="text-blue-600" routerLink="/profile">Profile</a>
</nav>
<main class="p-4">
  <router-outlet></router-outlet>
</main>
`;
  const scss = ``;
  return { ts, html, scss };
}

module.exports = { getLayoutSource };