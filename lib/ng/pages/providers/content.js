const uiPresets = {
  material: {
    name: "Material-UI",
    icons: {
      performance: "trending_up",
      team: "people",
      fast: "speed",
      safe: "security",
      code: "code",
      ui: "palette",
      benefits: {
        production: "star",
        fast: "speed",
        team: "group"
      }
    },
    colors: {
      primary: "primary",
      secondary: "accent",
      success: "success",
      warning: "warn",
      info: "info",
      error: "error",
    }
  },
  bootstrap: {
    name: "Bootstrap",
    icons: {
      performance: "bi-speedometer2",
      team: "bi-people-fill",
      fast: "bi-lightning-fill",
      safe: "bi-shield-lock",
      code: "bi-code-slash",
      ui: "bi-palette",
      benefits: {
        production: "star-fill",
        fast: "lightning-fill",
        team: "people-fill"
      }
    },
    colors: {
      primary: "primary",
      secondary: "secondary",
      success: "success",
      warning: "warning",
      info: "info",
      error: "danger",
    }
  },
  tailwind: {
    name: "Tailwind CSS",
    icons: {
      performance: "📊",
      team: `👥`,
      fast: `⚡`,
      safe: "🛡️",
      code: "💻",
      ui: `🎨`,
      benefits: {
        production: `⭐`,
        fast: `⚡`,
        team: `👥`
    }
    },
    colors: {
      primary: "text-blue-600",
      secondary: "text-purple-600",
      success: "text-green-600",
      warning: "text-yellow-600",
      info: "text-sky-600",
      error: "text-red-600",
    }
  },
  primeng: {
    name: "PrimeNG",
    icons: {
      performance: "pi pi-chart-line",
      team: "pi pi-users",
      fast: "pi pi-bolt",
      safe: "pi pi-shield",
      code: "pi pi-code",
      ui: "pi pi-palette",
      benefits: {
        production: "pi pi-star",
        fast: "pi pi-bolt",
        team: "pi pi-users"
      }
    },
    colors: {
      primary: "p-button-primary",
      secondary: "p-button-secondary",
      success: "p-button-success",
      warning: "p-button-warning",
      info: "p-button-info",
      error: "p-button-danger",
    }
  }
};

function getPageContent(ui = "material") {
  const preset = uiPresets[ui] || uiPresets.material;

  return {
    home: {
      title: "Welcome to PolyFront",
      intro: "Your comprehensive multi-frontend scaffold with everything you need",
      description: `Built with Angular, TypeScript, ${preset.name}, and modern development practices. Start building your next great application today.`,
      features: [
        { icon: preset.icons.performance, title: "Performance", description: "Lightning-fast builds with modern tooling", color: preset.colors.primary },
        { icon: preset.icons.team, title: "Team Ready", description: "Built for collaboration and scalability", color: preset.colors.secondary },
        { icon: preset.icons.fast, title: "Fast Development", description: "Hot reload and instant feedback", color: preset.colors.success },
        { icon: preset.icons.safe, title: "Type Safe", description: "Full TypeScript support with strict mode", color: preset.colors.warning },
        { icon: preset.icons.code, title: "Clean Code", description: "ESLint + Prettier for code quality", color: preset.colors.info },
        { icon: preset.icons.ui, title: "Beautiful UI", description: `${preset.name} components with theming`, color: preset.colors.error }
      ]
    },
    about: {
      title: "About PolyFront",
      intro: "A comprehensive scaffold for modern web applications",
      techStack: [
        { name: "Angular 20", version: "Latest", category: "Framework" },
        { name: "TypeScript", version: "5.x", category: "Language" },
        { name: "Vite", version: "7.x", category: "Build Tool" },
        { name: preset.name, version: "Latest", category: "UI Library" },
        { name: "Angular Router", version: "18.x", category: "Routing" },
        { name: "RxJS", version: "7.x", category: "Reactive Programming" },
        { name: "HttpClient", version: "18.x", category: "HTTP Client" },
        { name: "Jest", version: "29.x", category: "Testing" }
      ],
      features: [
        "Modern Angular with standalone components",
        "Full TypeScript support with strict mode",
        `Beautiful ${preset.name} components with theming`,
        "Client-side routing with Angular Router",
        "Reactive programming with RxJS",
        "API integration with HttpClient",
        "Comprehensive testing setup with Jest",
        "ESLint and Prettier for code quality",
        "Hot module replacement for fast development",
        "Responsive design with mobile-first approach"
      ],
      benefits: [
        { icon: preset.icons.benefits.production, title: "Production Ready", description: "Built with best practices and industry standards", color: "#00B612" },
        { icon: preset.icons.benefits.fast, title: "Fast Development", description: "Hot reload and instant feedback for rapid iteration", color: "#FFD700" },
        { icon: preset.icons.benefits.team, title: "Team Friendly", description: "Consistent code style and comprehensive tooling", color: "#0D6EFD" }
      ]
    },
    dashboard: {
      title: "Dashboard",
      intro: "Welcome back! Here's what's happening with your application today.",
      stats: {
        users: 1234,
        revenue: 45678,
        orders: 89,
        views: 12345
      },
      recentActivity: [
        { id: 1, user: "Nirmal Samaranayaka", action: "Order placed", time: "2 min ago", status: "success" },
        { id: 2, user: "Jane Smith", action: "Payment received", time: "5 min ago", status: "success" },
        { id: 3, user: "Bob Johnson", action: "Login attempt", time: "10 min ago", status: "warning" },
        { id: 4, user: "Alice Brown", action: "Account created", time: "15 min ago", status: "success" }
      ],
      topProducts: [
        { name: "Premium Widget", sales: 156, revenue: 2340, growth: 12 },
        { name: "Super Gadget", sales: 98, revenue: 1890, growth: -5 },
        { name: "Mega Tool", sales: 87, revenue: 1450, growth: 8 },
        { name: "Ultra Device", sales: 76, revenue: 1230, growth: 15 }
      ]
    },
    profile: {
      title: "Profile",
      profile: {
        name: "Nirmal Samaranayaka",
        email: "nirmal.fullstack@gmail.com",
        phone: "+46 (72) xxx-xxxx",
        location: "Stockholm, Sweden",
        company: "Scania AB.",
        position: "Senior Fullstack Developer",
        education: "Computer Science, University of Colombo",
        website: "https://dev.to/nirmalsamaranayaka",
        bio: "Experienced Full Stack Engineer & Tech Lead | Specialized in .NET, React, Angular, and scalable cloud-native solutions."
      },
      skills: [
        "Angular", "React", "TypeScript", "JavaScript", "HTML/CSS",
        "Material-UI", "Tailwind CSS", "Bootstrap", "PrimeNG",
        ".NET 6/7/8", "ASP.NET Core", "C#", "Web API", "Node.js",
        "Azure", "AWS", "Docker", "Kubernetes", "CI/CD",
        "MSSQL", "Oracle", "Entity Framework", "Clean Architecture", "SOLID"
      ],
      settings: {
        emailNotifications: true,
        pushNotifications: false,
        darkMode: false,
        twoFactorAuth: true
      }
    }
  };
}

module.exports = { getPageContent };