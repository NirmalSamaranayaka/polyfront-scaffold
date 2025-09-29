const { getPageContent } = require("./content");

function comp(name, title, intro, sections) {
  const sectionHtml = sections.map(s => `<section class="my-3"><h4 class="font-semibold">${s.title}</h4><p>${s.body}</p></section>`).join('');
  return `import { Component } from '@angular/core';

@Component({
  selector: 'app-${name}',
  standalone: true,
  template: \`
<div class="p-2">
  <h2 class="text-xl">${title}</h2>
  <p class="opacity-80">${intro}</p>
  ${sectionHtml}
</div>
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