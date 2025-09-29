const path = require("path");
const { writeIfMissing } = require("../../../utils/page-writer");

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

  writeIfMissing(path.join(appDir, "pages", "page.component.ts"), ts);
  writeIfMissing(path.join(appDir, "pages", "page.component.html"), html);
  writeIfMissing(path.join(appDir, "pages", "page.component.scss"), scss);

  // Generate concrete Home/About/Dashboard/Profile components in their own folders
  const { getPageContent } = require("../providers/content");
  const content = getPageContent();

  const makeComp = (name, c) => {
    const dir = path.join(appDir, "pages", name.toLowerCase());
    const tsBody = `import { Component } from '@angular/core';

@Component({
  selector: 'app-${name.toLowerCase()}',
  standalone: true,
  templateUrl: './${name.toLowerCase()}.component.html',
  styleUrls: ['./${name.toLowerCase()}.component.scss']
})
export class ${capitalize(name)}Component {
  content = ${JSON.stringify(c, null, 2)};
}
`;
    const htmlBody = `<h2>{{ content.title }}</h2>
@if (content.intro) {
  <p>{{ content.intro }}</p>
}
@for (s of content.sections; track s.title) {
  <section class="section">
    <h4>{{ s.title }}</h4>
    <p>{{ s.body }}</p>
  </section>
}
`;
    const scssBody = `.section { margin: 12px 0; }`;

    writeIfMissing(path.join(dir, `${name.toLowerCase()}.component.ts`), tsBody);
    writeIfMissing(path.join(dir, `${name.toLowerCase()}.component.html`), htmlBody);
    writeIfMissing(path.join(dir, `${name.toLowerCase()}.component.scss`), scssBody);
  };

  makeComp('Home', content.home);
  makeComp('About', content.about);
  makeComp('Dashboard', content.dashboard);
  makeComp('Profile', content.profile);
}

function capitalize(s){return s.charAt(0).toUpperCase()+s.slice(1);}

module.exports = { writeAngularPages };