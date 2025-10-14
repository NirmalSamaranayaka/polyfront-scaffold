const { getPageContent } = require("./content");

function getPageTemplate(pageName, content) {
  const ts = `import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-${pageName}',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './${pageName}.component.html',
  styleUrls: ['./${pageName}.component.scss']
})
export class ${capitalize(pageName)}Component {
  content = ${JSON.stringify(content, null, 2)};
}`;

  let html = '';
  let scss = '';

  switch (pageName) {
    case 'home':
      html = `<div class="max-w-7xl mx-auto px-4 py-8">
  <div class="text-center mb-12">
    <h1 class="text-5xl font-bold text-blue-600 mb-4">{{ content.title }}</h1>
    <p class="text-xl text-gray-600 mb-4">{{ content.intro }}</p>
    <p class="text-gray-500 max-w-2xl mx-auto">{{ content.description }}</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
    @for (feature of content.features; track feature.title) {
      <div class="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
        <div class="text-5xl mb-4" [innerHTML]="feature.icon" [ngClass]="feature.color"></div>
        <h3 class="text-xl font-semibold mb-2">{{ feature.title }}</h3>
        <p class="text-gray-600">{{ feature.description }}</p>
      </div>
    }
  </div>

  <div class="bg-white rounded-lg shadow-md p-8 text-center">
    <h2 class="text-3xl font-bold mb-4">Ready to Get Started?</h2>
    <p class="text-gray-600 mb-6">This scaffold includes routing, state management, API integration, testing, and much more.</p>
    <div class="space-x-4">
      <button class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">View Documentation</button>
      <button class="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50">Learn More</button>
    </div>
  </div>
</div>`;

      scss = ``;
      break;

    case 'about':
      html = `<div class="max-w-7xl mx-auto px-4 py-8">
  <div class="text-center mb-12">
    <h1 class="text-5xl font-bold text-blue-600 mb-4">{{ content.title }}</h1>
    <p class="text-xl text-gray-600">{{ content.intro }}</p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
    <div class="bg-white rounded-lg shadow-md p-6">
    <h3 class="text-2xl font-bold text-blue-600 mb-4">Technology Stack</h3>
    <p class="text-gray-600 mb-6">
      Built with the latest and greatest technologies in the Angular ecosystem.
    </p>

    <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
      @for (tech of content.techStack; track tech.name) {
        <div class="flex flex-col items-start">
          <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {{ tech.name }} {{ tech.version }}
          </span>
          <span class="text-gray-500 text-xs mt-1">{{ tech.category }}</span>
        </div>
      }
    </div>
  </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-2xl font-bold text-blue-600 mb-4">Key Features</h3>
      <ul class="space-y-2">
        @for (feature of content.features; track feature) {
          <li class="flex items-center">
            <span class="text-green-600 mr-2">✓</span>
            {{ feature }}
          </li>
        }
      </ul>
    </div>
  </div>

  <div class="bg-white rounded-lg shadow-md p-8 text-center">
    <h2 class="text-3xl font-bold mb-8">Why Choose PolyFront?</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      @for (benefit of content.benefits; track benefit.title) {
        <div class="text-center">
          <div class="text-5xl mb-4">{{ benefit.icon }}</div>
          <h3 class="text-xl font-semibold mb-2">{{ benefit.title }}</h3>
          <p class="text-gray-600">{{ benefit.description }}</p>
        </div>
      }
    </div>
  </div>
</div>`;

      scss = ``;
      break;

    case 'dashboard':
      html = `<div class="p-6">
  <h1 class="text-4xl font-bold text-blue-600 mb-2">{{ content.title }}</h1>
  <p class="text-lg text-gray-600 mb-8">{{ content.intro }}</p>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center">
        <div>
          <p class="text-gray-600 text-sm">Total Users</p>
          <p class="text-3xl font-bold">{{ content.stats.users | number }}</p>
          <p class="text-green-600 text-sm">+12% from last month</p>
        </div>
        <div class="text-4xl text-blue-500">👥</div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center">
        <div>
          <p class="text-gray-600 text-sm">Revenue</p>
          <p class="text-3xl font-bold">\${{ content.stats.revenue | number }}</p>
          <p class="text-green-600 text-sm">+8% from last month</p>
        </div>
        <div class="text-4xl text-green-500">💰</div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center">
        <div>
          <p class="text-gray-600 text-sm">Orders</p>
          <p class="text-3xl font-bold">{{ content.stats.orders }}</p>
          <p class="text-green-600 text-sm">+15% from last month</p>
        </div>
        <div class="text-4xl text-yellow-500">🛒</div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center">
        <div>
          <p class="text-gray-600 text-sm">Page Views</p>
          <p class="text-3xl font-bold">{{ content.stats.views | number }}</p>
          <p class="text-green-600 text-sm">+22% from last month</p>
        </div>
        <div class="text-4xl text-blue-500">👁️</div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
      <h3 class="text-xl font-bold mb-4">Top Products</h3>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b">
              <th class="text-left py-2">Product</th>
              <th class="text-right py-2">Sales</th>
              <th class="text-right py-2">Revenue</th>
              <th class="text-right py-2">Growth</th>
            </tr>
          </thead>
          <tbody>
            @for (product of content.topProducts; track product.name) {
              <tr class="border-b">
                <td class="py-2">{{ product.name }}</td>
                <td class="text-right py-2">{{ product.sales }}</td>
                <td class="text-right py-2">\${{ product.revenue | number }}</td>
                <td class="text-right py-2">
                  <span class="px-2 py-1 rounded text-sm" [class]="product.growth >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ product.growth >= 0 ? '+' : '' }}{{ product.growth }}%
                  </span>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-xl font-bold mb-4">Recent Activity</h3>
      <div class="space-y-4">
        @for (activity of content.recentActivity; track activity.id) {
          <div class="flex items-start">
            <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3" [class]="activity.status === 'success' ? 'bg-green-100' : activity.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'">
              <span [class]="activity.status === 'success' ? 'text-green-600' : activity.status === 'warning' ? 'text-yellow-600' : 'text-red-600'">
                {{ activity.status === 'success' ? '✓' : activity.status === 'warning' ? '⚠' : '✗' }}
              </span>
            </div>
            <div class="flex-1">
              <p class="font-medium">{{ activity.action }}</p>
              <p class="text-sm text-gray-600">{{ activity.user }} — {{ activity.time }}</p>
            </div>
          </div>
        }
      </div>
    </div>
  </div>
</div>`;

      scss = ``;
      break;

    case 'profile':
      html = `<div class="p-6">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-4xl font-bold text-blue-600">{{ content.title }}</h1>
    <button class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center">
      <span class="mr-2">✏️</span>
      Edit Profile
    </button>
  </div>

  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <div class="flex items-center">
      <div class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mr-6">
        <span class="text-4xl text-gray-500">👤</span>
      </div>
      <div class="flex-1">
        <h2 class="text-2xl font-bold mb-1">{{ content.profile.name }}</h2>
        <p class="text-gray-600 mb-2">{{ content.profile.position }} at {{ content.profile.company }}</p>
        <p class="text-gray-500 mb-4">{{ content.profile.bio }}</p>
        <div class="flex flex-wrap gap-2">
          @for (skill of content.skills; track skill) {
            <span class="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">{{ skill }}</span>
          }
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
      <h3 class="text-xl font-bold mb-4">Personal Information</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">👤</span>
            <input type="text" placeholder="Full Name"  class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100" [value]="content.profile.name" readonly>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📧</span>
            <input type="email" placeholder="Email" class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100" [value]="content.profile.email" readonly>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📞</span>
            <input type="tel" placeholder="Phone" class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100" [value]="content.profile.phone" readonly>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">📍</span>
            <input type="text" placeholder="Location" class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100" [value]="content.profile.location" readonly>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🏢</span>
            <input type="text" placeholder="Company" class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100" [value]="content.profile.company" readonly>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Position</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">💼</span>
            <input type="text" placeholder="Position" class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100" [value]="content.profile.position" readonly>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-md p-6">
      <h3 class="text-xl font-bold mb-4">Settings</h3>
      <div class="space-y-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <span class="mr-3">🔔</span>
            <span>Email Notifications</span>
          </div>
          <input type="checkbox" placeholder="Email Notifications" class="w-4 h-4" [checked]="content.settings.emailNotifications" disabled>
        </div>
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <span class="mr-3">📱</span>
            <span>Push Notifications</span>
          </div>
          <input type="checkbox" placeholder="Push Notifications" class="w-4 h-4" [checked]="content.settings.pushNotifications" disabled>
        </div>
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <span class="mr-3">🎨</span>
            <span>Dark Mode</span>
          </div>
          <input type="checkbox" placeholder="Dark Mode" class="w-4 h-4" [checked]="content.settings.darkMode" disabled>
        </div>
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <span class="mr-3">🔒</span>
            <span>Two-Factor Auth</span>
          </div>
          <input type="checkbox"placeholder="Two-Factor Auth" class="w-4 h-4" [checked]="content.settings.twoFactorAuth" disabled>
        </div>
      </div>
    </div>
  </div>
</div>`;

      scss = ``;
      break;
  }

  return { ts, html, scss };
}

function capitalize(s){return s.charAt(0).toUpperCase()+s.slice(1);}

module.exports = { getPageTemplate };