const path = require("path");
const { writeFileSafe } = require("../../../fs-utils");

function writeAngularPages({ appDir, ui }) {
  // Generic PageComponent renders content via route data (using @if/@for)
  const ts = `import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page',
  standalone: true,
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent {
  private readonly route = inject(ActivatedRoute);
  data() { return this.route.snapshot.data['content']; }
}
`;
  const html = `<h2>{{ data()?.title }}</h2>
@if (data()?.intro) {
  <p>{{ data()?.intro }}</p>
}
@for (s of data()?.sections; track s.title) {
  <section class="section">
    <h4>{{ s.title }}</h4>
    <p>{{ s.body }}</p>
  </section>
}
`;
  const scss = `.section { margin: 12px 0; }`;

  writeFileSafe(path.join(appDir, "pages", "page.component.ts"), ts);
  writeFileSafe(path.join(appDir, "pages", "page.component.html"), html);
  writeFileSafe(path.join(appDir, "pages", "page.component.scss"), scss);

  // Generate concrete Home/About/Dashboard/Profile components in their own folders
  const { getPageContent } = require("../providers/content");
  const content = getPageContent(ui);

  const makeComp = (name, c) => {
    const dir = path.join(appDir, "pages", name.toLowerCase());
    let getPageTemplate;
    try {
      ({ getPageTemplate } = require(`../providers/${ui}`));
    } catch {
      ({ getPageTemplate } = require("../providers/generic"));
    }

  const template = getPageTemplate(name.toLowerCase(), c);
    
    writeFileSafe(path.join(dir, `${name.toLowerCase()}.component.ts`), template.ts);
    writeFileSafe(path.join(dir, `${name.toLowerCase()}.component.html`), template.html);
    writeFileSafe(path.join(dir, `${name.toLowerCase()}.component.scss`), template.scss);
  };

  makeComp('Home', content.home);
  makeComp('About', content.about);
  makeComp('Dashboard', content.dashboard);
  makeComp('Profile', content.profile);
}

function capitalize(s){return s.charAt(0).toUpperCase()+s.slice(1);}

module.exports = { writeAngularPages };