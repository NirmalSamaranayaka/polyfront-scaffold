const { getPageContent } = require("./content");

function comp(name, title, intro, sections) {
  const sectionHtml = sections.map(s => `<section style="margin: 12px 0"><h4>${s.title}</h4><p>${s.body}</p></section>`).join('');
  return `import { Component } from '@angular/core';

@Component({
  selector: 'app-${name}',
  standalone: true,
  template: \`
<h2>${title}</h2>
<p>${intro}</p>
${sectionHtml}
\`
})
export class ${capitalize(name)}Component {}
`;
}

function capitalize(s){return s.charAt(0).toUpperCase()+s.slice(1);}

const pagesSources = (() => {
  const c = getPageContent();
  return {
    home: () => comp('home', c.home.title, c.home.intro, c.home.sections),
    about: () => comp('about', c.about.title, c.about.intro, c.about.sections),
    dashboard: () => comp('dashboard', c.dashboard.title, c.dashboard.intro, c.dashboard.sections),
    profile: () => comp('profile', c.profile.title, c.profile.intro, c.profile.sections),
  };
})();

module.exports = { pagesSources };