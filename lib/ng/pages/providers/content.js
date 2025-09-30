function getPageContent() {
  return {
    home: {
      title: "Welcome to PolyFront",
      intro: "Your comprehensive multi-frontend scaffold with everything you need",
      description: "Built with Angular, TypeScript, and modern development practices. Start building your next great application today.",
      features: [
        { icon: "trending_up", title: "Performance", description: "Lightning-fast builds with modern tooling", color: "primary" },
        { icon: "people", title: "Team Ready", description: "Built for collaboration and scalability", color: "secondary" },
        { icon: "speed", title: "Fast Development", description: "Hot reload and instant feedback", color: "success" },
        { icon: "security", title: "Type Safe", description: "Full TypeScript support with strict mode", color: "warning" },
        { icon: "code", title: "Clean Code", description: "ESLint + Prettier for code quality", color: "info" },
        { icon: "palette", title: "Beautiful UI", description: "Material-UI components with theming", color: "error" }
      ]
    },
    about: {
      title: "About PolyFront",
      intro: "A comprehensive scaffold for modern web applications",
      techStack: [
        { name: "Angular 20", version: "Latest", category: "Framework" },
        { name: "TypeScript", version: "5.x", category: "Language" },
        { name: "Vite", version: "7.x", category: "Build Tool" },
        { name: "Material-UI", version: "7.x", category: "UI Library" },
        { name: "Angular Router", version: "18.x", category: "Routing" },
        { name: "RxJS", version: "7.x", category: "Reactive Programming" },
        { name: "HttpClient", version: "18.x", category: "HTTP Client" },
        { name: "Jest", version: "29.x", category: "Testing" }
      ],
      features: [
        "Modern Angular with standalone components",
        "Full TypeScript support with strict mode",
        "Beautiful Material-UI components with theming",
        "Client-side routing with Angular Router",
        "Reactive programming with RxJS",
        "API integration with HttpClient",
        "Comprehensive testing setup with Jest",
        "ESLint and Prettier for code quality",
        "Hot module replacement for fast development",
        "Responsive design with mobile-first approach"
      ],
      benefits: [
        { icon: "star", title: "Production Ready", description: "Built with best practices and industry standards" },
        { icon: "speed", title: "Fast Development", description: "Hot reload and instant feedback for rapid iteration" },
        { icon: "group", title: "Team Friendly", description: "Consistent code style and comprehensive tooling" }
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