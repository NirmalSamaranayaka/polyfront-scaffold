function getLayoutSource() {
  const ts = `import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule, ButtonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {}
`;
  const html = `<div class="p-3 border-b">
  <h3 class="m-0">Polyfront Angular (PrimeNG)</h3>
  <nav class="mt-2" style="display:flex; gap:10px">
    <a pButton label="Home" routerLink="/"></a>
    <a pButton label="About" routerLink="/about"></a>
    <a pButton label="Dashboard" routerLink="/dashboard"></a>
    <a pButton label="Profile" routerLink="/profile"></a>
  </nav>
</div>
<div class="p-3">
  <router-outlet></router-outlet>
</div>
`;
  const scss = ``;
  return { ts, html, scss };
}

module.exports = { getLayoutSource };