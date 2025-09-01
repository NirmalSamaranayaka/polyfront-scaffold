// lib/scaffold-react-project-structure.js
const fs = require("fs");
const path = require("path");

function writeFileSafe(p, content) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content);
}

/**
 * Create common React folders, env files, optional axios/i18n/date utils, and page/router stubs.
 * Non-destructive: won't overwrite if a file already exists.
 * Now supports multiple UI frameworks: MUI, Bootstrap
 */
function scaffoldReactProjectStructure({
  projectDir,
  useTS,
  bundler,
  ui,
  store,
  i18n,
  dateLib,
  axiosOn,
  storeWriters = {},
}) {
  const srcDir = path.join(projectDir, "src");
  const extx = useTS ? "tsx" : "jsx";
  const ext  = useTS ? "ts"  : "js";

  // 1) folders
  const folders = ["api","assets","components","context","features","hooks","i18n","layout","pages","routes","services","store","styles","tests","utils"];
  folders.forEach(f => fs.mkdirSync(path.join(srcDir,f), { recursive: true }));

  // 2) env files
  const appName = path.basename(projectDir);
  const devEnv = bundler === "vite"
    ? `VITE_API_BASE_URL=https://jsonplaceholder.typicode.com
VITE_APP_NAME=${appName}
`
    : `API_BASE_URL=https://jsonplaceholder.typicode.com
APP_NAME=${appName}
`;
  const prodEnv = devEnv.replace("https://jsonplaceholder.typicode.com","");
  const exampleEnv = devEnv.split("\n").filter(Boolean).map(line => line.split("=")[0] + "=").join("\n") + "\n";
  writeFileSafe(path.join(projectDir, ".env.development"), devEnv);
  writeFileSafe(path.join(projectDir, ".env.test"), devEnv);
  writeFileSafe(path.join(projectDir, ".env.production"), prodEnv);
  writeFileSafe(path.join(projectDir, ".env.example"), exampleEnv);

  // 3) axios client
  if (axiosOn) {
    const baseExpr = bundler === "vite" ? "import.meta.env.VITE_API_BASE_URL" : "process.env.API_BASE_URL";
    const body = `import axios from 'axios';
export const api = axios.create({
  baseURL: ${baseExpr} || 'https://jsonplaceholder.typicode.com'
});
`;
    writeFileSafe(path.join(srcDir, "api", `client.${ext}`), body);
  }

  // 4) Create UI-specific templates
  createUITemplates(srcDir, ui, useTS, extx, ext);

  // 5) Create global CSS based on UI framework
  createGlobalCSS(srcDir, ui);

  // 6) store
  if (store === "redux" && typeof storeWriters.redux === "function") storeWriters.redux(projectDir, useTS);
  if (store === "mobx"  && typeof storeWriters.mobx  === "function") storeWriters.mobx(projectDir, useTS);

  // 7) enhanced i18n with demo translations
  if (i18n && !fs.existsSync(path.join(srcDir,"i18n",`index.${ext}`))) {
    createI18nFiles(srcDir, ext, useTS);
  }

  // 8) enhanced date utils with more functionality
  if (dateLib && dateLib !== "none" && !fs.existsSync(path.join(srcDir,"utils",`date.${ext}`))) {
    createDateUtils(srcDir, dateLib, ext, useTS);
  }

  // 9) Additional utility functions
  createCommonUtils(srcDir, ext, useTS);

  // 10) Custom hooks for advanced functionality
  createCustomHooks(srcDir, ext, useTS);

  // 11) Reusable components
  createReusableComponents(srcDir, ui, extx, ext, useTS);

  // 12) Layout component
  createLayoutComponent(srcDir, ui, extx, ext, useTS);

   // 12) Custom context functions
  createCustomContext(srcDir, extx, useTS);


}

function createUITemplates(srcDir, ui, useTS, extx, ext) {
  const pagesDir = path.join(srcDir,"pages");
  const routes = path.join(srcDir,"routes",`index.${extx}`);
  
  // Create routes file
  if (!fs.existsSync(routes)) {
    writeFileSafe(routes, `import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layout/Layout';
import Home from '../pages/Home';
import About from '../pages/About';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'profile', element: <Profile /> },
    ],
  },
]);`);
  }

  // Create pages based on UI framework
  if (ui === "mui") {
    createMUIPages(pagesDir, extx, ext, useTS);
  } else if (ui === "bootstrap") {
    createBootstrapPages(pagesDir, extx, ext, useTS);
  } else if (ui === "tailwind") {
    createTailwindPages(pagesDir, extx, ext);
  } else {
    // Default to MUI if no specific UI is chosen
    createMUIPages(pagesDir, extx, ext, useTS);
  }
}

function createMUIPages(pagesDir, extx, ext, useTS) {
  const home = path.join(pagesDir, `Home.${extx}`);
  if (!fs.existsSync(home)) {
    writeFileSafe(home, `import { Box, Typography, Grid, Card, CardContent, Button, Avatar, Container, Paper } from '@mui/material';
import { TrendingUp, People, Speed, Security, Code, Palette } from '@mui/icons-material';

export default function Home() {
  const features = [
    { icon: <TrendingUp />, title: 'Performance', description: 'Lightning-fast builds with modern tooling', color: 'primary' },
    { icon: <People />, title: 'Team Ready', description: 'Built for collaboration and scalability', color: 'secondary' },
    { icon: <Speed />, title: 'Fast Development', description: 'Hot reload and instant feedback', color: 'success' },
    { icon: <Security />, title: 'Type Safe', description: 'Full TypeScript support with strict mode', color: 'warning' },
    { icon: <Code />, title: 'Clean Code', description: 'ESLint + Prettier for code quality', color: 'info' },
    { icon: <Palette />, title: 'Beautiful UI', description: 'Material-UI components with theming', color: 'error' }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom color="primary" fontWeight="bold">
          Welcome to PolyFront
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Your comprehensive multi-frontend scaffold with everything you need
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Built with React, TypeScript, Vite, Material-UI, and modern development practices.
          Start building your next great application today.
        </Typography>
      </Box>

      <Grid container spacing={4} mb={6}>
        {features.map((feature, index) => (
          <Grid size={{ xs: 12, sm:6, md: 4 }} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Avatar sx={{ bgcolor: \`\${feature.color}.main\`, width: 64, height: 64, mx: 'auto', mb: 2 }}>
                  {feature.icon}
                </Avatar>
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Ready to Get Started?
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          This scaffold includes routing, state management, API integration, testing, and much more.
          Explore the different pages to see all the features in action.
        </Typography>
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" size="large" sx={{ mr: 2 }}>
            View Documentation
          </Button>
          <Button variant="outlined" size="large">
            Learn More
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
`);
  }

  // Create other MUI pages (About, Dashboard, Profile)
  createOtherMUIPages(pagesDir, extx, ext, useTS);
}

function createOtherMUIPages(pagesDir, extx, ext, useTS) {
  // About page
  const about = path.join(pagesDir, `About.${extx}`);
  if (!fs.existsSync(about)) {
    writeFileSafe(about, `import React from 'react';
import { Box, Typography, Container, Paper, List, ListItem, ListItemIcon, ListItemText, Divider, Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import { CheckCircle, Star, Speed, Group } from '@mui/icons-material';

export default function About() {
  const techStack = [
    { name: 'React 19', version: 'Latest', category: 'Framework' },
    { name: 'TypeScript', version: '5.x', category: 'Language' },
    { name: 'Vite', version: '7.x', category: 'Build Tool' },
    { name: 'Material-UI', version: '7.x', category: 'UI Library' },
    { name: 'React Router', version: '7.x', category: 'Routing' },
    { name: 'Zustand', version: '5.x', category: 'State Management' },
    { name: 'Axios', version: '1.x', category: 'HTTP Client' },
    { name: 'Vitest', version: '3.x', category: 'Testing' }
  ];

  const features = [
    'Modern React with hooks and functional components',
    'Full TypeScript support with strict mode',
    'Beautiful Material-UI components with theming',
    'Client-side routing with React Router',
    'State management with Zustand',
    'API integration with Axios',
    'Comprehensive testing setup with Vitest',
    'ESLint and Prettier for code quality',
    'Hot module replacement for fast development',
    'Responsive design with mobile-first approach'
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center"  mb={6}>
        <Typography variant="h2" component="h1" gutterBottom color="primary" fontWeight="bold">
          About PolyFront
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          A comprehensive scaffold for modern web applications
        </Typography>
      </Box>

      <Grid container spacing={4} mb={6}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h4" gutterBottom color="primary">
              Technology Stack
            </Typography>
            <Typography variant="body1" paragraph>
              Built with the latest and greatest technologies in the React ecosystem.
            </Typography>
            <Grid container spacing={2}>
              {techStack.map((tech, index) => (
                <Grid size={{ xs: 6 }} key={index}>
                  <Chip label={\`\${tech.name} \${tech.version}\`} variant="outlined" color="primary" size="small" sx={{ mb: 1 }} />
                  <Typography variant="caption" display="block" color="text.secondary">{tech.category}</Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h4" gutterBottom color="primary">Key Features</Typography>
            <List>
              {features.map((feature, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon><CheckCircle color="success" /></ListItemIcon>
                    <ListItemText primary={feature} />
                  </ListItem>
                  {index < features.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Why Choose PolyFront?</Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Star color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" gutterBottom>Production Ready</Typography>
            <Typography variant="body2" color="text.secondary">Built with best practices and industry standards</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Speed color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" gutterBottom>Fast Development</Typography>
            <Typography variant="body2" color="text.secondary">Hot reload and instant feedback for rapid iteration</Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Group color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" gutterBottom>Team Friendly</Typography>
            <Typography variant="body2" color="text.secondary">Consistent code style and comprehensive tooling</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
`);

  }

  // Dashboard page
  const dashboard = path.join(pagesDir, `Dashboard.${extx}`);
  if (!fs.existsSync(dashboard)) {
    writeFileSafe(dashboard, `import React,{ useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  TrendingUp,
  People,
  AttachMoney,
  ShoppingCart,
  Visibility,
  CheckCircle,
  Warning,
  Error
} from '@mui/icons-material';

export default function Dashboard() {
  const [stats] = useState({
    users: 1234,
    revenue: 45678,
    orders: 89,
    views: 12345
  });

  const [recentActivity] = useState([
    { id: 1, user: 'Nirmal Samaranayaka', action: 'Order placed', time: '2 min ago', status: 'success' },
    { id: 2, user: 'Jane Smith', action: 'Payment received', time: '5 min ago', status: 'success' },
    { id: 3, user: 'Bob Johnson', action: 'Login attempt', time: '10 min ago', status: 'warning' },
    { id: 4, user: 'Alice Brown', action: 'Account created', time: '15 min ago', status: 'success' },
  ]);

  const [topProducts] = useState([
    { name: 'Premium Widget', sales: 156, revenue: 2340, growth: 12 },
    { name: 'Super Gadget', sales: 98, revenue: 1890, growth: -5 },
    { name: 'Mega Tool', sales: 87, revenue: 1450, growth: 8 },
    { name: 'Ultra Device', sales: 76, revenue: 1230, growth: 15 },
  ]);

  const getStatusIcon = (status ${useTS ? ':string' : ''}) => {
    switch (status) {
      case 'success': return <CheckCircle color="success" />;
      case 'warning': return <Warning color="warning" />;
      case 'error': return <Error color="error" />;
      default: return <CheckCircle color="success" />;
    }
  };

  const getGrowthColor = (growth ${useTS ? ': number' : ''}) => growth >= 0 ? 'success' : 'error';

  return (
    <Box>
      <Typography variant="h3" component="h1" gutterBottom color="primary" fontWeight="bold">
        Dashboard
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Welcome back! Here's what's happening with your application today.
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm:6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="h6">
                    Total Users
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.users.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main" display="flex" alignItems="center">
                    <TrendingUp fontSize="small" sx={{ mr: 0.5 }} />
                    +12% from last month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                  <People />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm:6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="h6">
                    Revenue
                  </Typography>
                  <Typography variant="h4" component="div">
                    \${stats.revenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main" display="flex" alignItems="center">
                    <TrendingUp fontSize="small" sx={{ mr: 0.5 }} />
                    +8% from last month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main', width: 56, height: 56 }}>
                  <AttachMoney />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm:6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="h6">
                    Orders
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.orders}
                  </Typography>
                  <Typography variant="body2" color="success.main" display="flex" alignItems="center">
                    <TrendingUp fontSize="small" sx={{ mr: 0.5 }} />
                    +15% from last month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main', width: 56, height: 56 }}>
                  <ShoppingCart />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm:6, md: 3 }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom variant="h6">
                    Page Views
                  </Typography>
                  <Typography variant="h4" component="div">
                    {stats.views.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="success.main" display="flex" alignItems="center">
                    <TrendingUp fontSize="small" sx={{ mr: 0.5 }} />
                    +22% from last month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main', width: 56, height: 56 }}>
                  <Visibility />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Tables */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardHeader
              title="Top Products"
              action={
                <Button size="small" color="primary">
                  View All
                </Button>
              }
            />
            <CardContent>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Sales</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Growth</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topProducts.map((product) => (
                      <TableRow key={product.name}>
                        <TableCell component="th" scope="row">
                          {product.name}
                        </TableCell>
                        <TableCell align="right">{product.sales}</TableCell>
                        <TableCell align="right">\${product.revenue.toLocaleString()}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={\`\${product.growth >= 0 ? '+' : ''}\${product.growth}%\`}
                            color={getGrowthColor(product.growth)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardHeader title="Recent Activity" />
            <CardContent>
              <List>
                {recentActivity.map((activity) => (
                  <ListItem key={activity.id} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'grey.100' }}>
                        {getStatusIcon(activity.status)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.action}
                      secondary={
                        <React.Fragment>
                          <Typography component="span" variant="body2" color="text.primary">
                            {activity.user}
                        </Typography>
                          {' — '}{activity.time}
                        </React.Fragment>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}`);
  }

  // Profile page
  const profile = path.join(pagesDir, `Profile.${extx}`);
  if (!fs.existsSync(profile)) {
    writeFileSafe(profile, `import { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Button,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Email,
  Phone,
  LocationOn,
  Work,
  Notifications,
  Security,
  Palette
} from '@mui/icons-material';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile] = useState({
    name: 'Nirmal Samaranayaka',
    email: 'nirmal.fullstack@gmail.com',
    phone: '+46 (72) xxx-xxxx',
    location: 'Stockholm, Sweden',
    company: 'Scania AB.',
    position: 'Senior Fullstack Developer',
    education: 'Computer Science, University of Colombo',
    website: 'https://dev.to/nirmalsamaranayaka',
    bio: 'Experienced Full Stack Engineer & Tech Lead | Specialized in .NET, React, Angular, and scalable cloud-native solutions.'
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
    twoFactorAuth: true
  });

 const [skills] = useState([
  // Frontend
  'React', 'Redux', 'MobX', 'React Query', 'Angular', 'Micro Frontends', 
  'TypeScript', 'JavaScript', 'HTML/CSS', 'jQuery',

  // UI Libraries & Styling
  'MUI (Material-UI)', 'Kendo UI', 'Tailwind CSS', 'Tegel',

  // Backend
  '.NET 6/7/8', 'ASP.NET Core', 'C#', 'Web API', 'WCF', 
  'Microservices', 'gRPC', 'REST APIs', 'SOAP', 'Node.js',

  // Blockchain
  'Solidity', 'Truffle',

  // Cloud & DevOps
  'Azure', 'AWS', 'Docker', 'Kubernetes', 'Helm', 
  'CI/CD', 'Azure DevOps', 'Jenkins', 'Git', 'TFS/TFVC',

  // Data & BI
  'MSSQL', 'Oracle', 'Entity Framework Core', 'Entity Framework 6', 'Dapper', 
  'T-SQL', 'PL-SQL', 'SSIS', 'SSRS', 'Data Migration', 'Query Tuning',

  // Architecture & Patterns
  'Clean Architecture', 'Domain-Driven Design (DDD)', 'SOLID', 
  'Object-Oriented Programming (OOP)', 'Test-Driven Development (TDD)', 
  'MVVM', 'Agile (Scrum, Kanban)'
]);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to an API
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
  };

  const handleSettingChange = (setting  ${useTS ? ':string' : ''}) => (event ${useTS ? ': React.ChangeEvent<HTMLInputElement>' : ''} ) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }));
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h3" component="h1" color="primary" fontWeight="bold">
          Profile
        </Typography>
        <Box>
          {isEditing ? (
            <>
              <Button
                variant="contained"
                startIcon={<Save />}
                onClick={handleSave}
                sx={{ mr: 1 }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid size={{ xs: 12}}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={3}>
                <Avatar
                  sx={{ width: 120, height: 120, fontSize: '3rem' }}
                  src="/static/images/avatar/1.jpg"
                >
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Box flex={1}>
                  <Typography variant="h4" gutterBottom>
                    {profile.name}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {profile.position} at {profile.company}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {profile.bio}
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {skills.map((skill) => (
                      <Chip key={skill} label={skill} variant="outlined" size="small" />
                    ))}
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardHeader title="Personal Information" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={profile.name}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={profile.email}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={profile.phone}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Location"
                    value={profile.location}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Company"
                    value={profile.company}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <Work sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Position"
                    value={profile.position}
                    disabled={!isEditing}
                    InputProps={{
                      startAdornment: <Work sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Bio"
                    value={profile.bio}
                    disabled={!isEditing}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Settings */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardHeader title="Settings" />
            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText primary="Email Notifications" />
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={handleSettingChange('emailNotifications')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Notifications />
                  </ListItemIcon>
                  <ListItemText primary="Push Notifications" />
                  <Switch
                    checked={settings.pushNotifications}
                    onChange={handleSettingChange('pushNotifications')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Palette />
                  </ListItemIcon>
                  <ListItemText primary="Dark Mode" />
                  <Switch
                    checked={settings.darkMode}
                    onChange={handleSettingChange('darkMode')}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Security />
                  </ListItemIcon>
                  <ListItemText primary="Two-Factor Auth" />
                  <Switch
                    checked={settings.twoFactorAuth}
                    onChange={handleSettingChange('twoFactorAuth')}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardHeader title="Quick Actions" />
            <CardContent>
              <Button
                fullWidth
                variant="outlined"
                sx={{ mb: 1 }}
              >
                Download Resume
              </Button>
              <Button
                fullWidth
                variant="outlined"
                sx={{ mb: 1 }}
              >
                Share Profile
              </Button>
              <Button
                fullWidth
                variant="outlined"
                color="error"
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}`);
  }
}

function createBootstrapPages(pagesDir, extx, ext, useTS) {
  const home = path.join(pagesDir, `Home.${extx}`);
  if (!fs.existsSync(home)) {
    writeFileSafe(home, `export default function Home() {
  const features = [
    { icon: '🚀', title: 'Performance', description: 'Lightning-fast builds with modern tooling', color: 'primary' },
    { icon: '👥', title: 'Team Ready', description: 'Built for collaboration and scalability', color: 'success' },
    { icon: '⚡', title: 'Fast Development', description: 'Hot reload and instant feedback', color: 'info' },
    { icon: '🛡️', title: 'Type Safe', description: 'Full TypeScript support with strict mode', color: 'warning' },
    { icon: '🧹', title: 'Clean Code', description: 'ESLint + Prettier for code quality', color: 'secondary' },
    { icon: '🎨', title: 'Beautiful UI', description: 'Bootstrap components with theming', color: 'danger' }
  ];

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">
          Welcome to PolyFront
        </h1>
        <p className="lead text-muted mb-4">
          Your comprehensive multi-frontend scaffold with everything you need
        </p>
        <p className="text-muted mx-auto" style={{ maxWidth: '600px' }}>
          Built with React, TypeScript, Vite, Bootstrap, and modern development practices.
          Start building your next great application today.
        </p>
      </div>

      <div className="row g-4 mb-5">
        {features.map((feature, index) => (
          <div className="col-12 col-sm-6 col-md-4" key={index}>
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center">
                <div className="display-4 mb-3">{feature.icon}</div>
                <h5 className="card-title">{feature.title}</h5>
                <p className="card-text text-muted">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body text-center p-5">
          <h2 className="mb-3">Ready to Get Started?</h2>
          <p className="text-muted mb-4">
            This scaffold includes routing, state management, API integration, testing, and much more.
            Explore the different pages to see all the features in action.
          </p>
          <div className="mt-4">
            <button className="btn btn-primary btn-lg me-3">View Documentation</button>
            <button className="btn btn-outline-primary btn-lg">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  );
}`);
  }

  // Create other Bootstrap pages
  createOtherBootstrapPages(pagesDir, extx, ext, useTS);
}

function createOtherBootstrapPages(pagesDir, extx, ext, useTS) {
  // About page
  const about = path.join(pagesDir, `About.${extx}`);
  if (!fs.existsSync(about)) {
    writeFileSafe(about, `export default function About() {
  const techStack = [
    { name: 'React 19', version: 'Latest', category: 'Framework' },
    { name: 'TypeScript', version: '5.x', category: 'Language' },
    { name: 'Vite', version: '7.x', category: 'Build Tool' },
    { name: 'Bootstrap', version: '5.x', category: 'UI Library' },
    { name: 'React Router', version: '7.x', category: 'Routing' },
    { name: 'Zustand', version: '5.x', category: 'State Management' },
    { name: 'Axios', version: '1.x', category: 'HTTP Client' },
    { name: 'Vitest', version: '3.x', category: 'Testing' }
  ];

  const features = [
    'Modern React with hooks and functional components',
    'Full TypeScript support with strict mode',
    'Beautiful Bootstrap components with theming',
    'Client-side routing with React Router',
    'State management with Zustand',
    'API integration with Axios',
    'Comprehensive testing setup with Vitest',
    'ESLint and Prettier for code quality',
    'Hot module replacement for fast development',
    'Responsive design with mobile-first approach'
  ];

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary mb-3">
          About PolyFront
        </h1>
        <p className="lead text-muted mb-4">
          A comprehensive scaffold for modern web applications
        </p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h4 className="card-title text-primary">Technology Stack</h4>
              <p className="card-text">
                Built with the latest and greatest technologies in the React ecosystem.
              </p>
              <div className="row g-2">
                {techStack.map((tech, index) => (
                  <div className="col-6" key={index}>
                    <span className="badge bg-primary me-2 mb-2">
                      {tech.name} {tech.version}
                    </span>
                    <small className="text-muted d-block">{tech.category}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card h-100 shadow-sm">
            <div className="card-body">
              <h4 className="card-title text-primary">Key Features</h4>
              <ul className="list-unstyled">
                {features.map((feature, index) => (
                  <li key={index} className="mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2"></i>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body text-center p-5">
          <h2 className="mb-4">Why Choose PolyFront?</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="display-4 mb-3">⭐</div>
              <h5>Production Ready</h5>
              <p className="text-muted">Built with best practices and industry standards</p>
            </div>
            <div className="col-md-4">
              <div className="display-4 mb-3">⚡</div>
              <h5>Fast Development</h5>
              <p className="text-muted">Hot reload and instant feedback for rapid iteration</p>
            </div>
            <div className="col-md-4">
              <div className="display-4 mb-3">👥</div>
              <h5>Team Friendly</h5>
              <p className="text-muted">Consistent code style and comprehensive tooling</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`);
  }

  // Dashboard page
  const dashboard = path.join(pagesDir, `Dashboard.${extx}`);
  if (!fs.existsSync(dashboard)) {
    writeFileSafe(dashboard, `import { useState } from 'react';

export default function Dashboard() {
  const [stats] = useState({
    users: 1234,
    revenue: 45678,
    orders: 89,
    views: 12345
  });

  const [recentActivity] = useState([
    { id: 1, user: 'Nirmal Samaranayaka', action: 'Order placed', time: '2 min ago', status: 'success' },
    { id: 2, user: 'Jane Smith', action: 'Payment received', time: '5 min ago', status: 'success' },
    { id: 3, user: 'Bob Johnson', action: 'Login attempt', time: '10 min ago', status: 'warning' },
    { id: 4, user: 'Alice Brown', action: 'Account created', time: '15 min ago', status: 'success' },
  ]);

  const [topProducts] = useState([
    { name: 'Premium Widget', sales: 156, revenue: 2340, growth: 12 },
    { name: 'Super Gadget', sales: 98, revenue: 1890, growth: -5 },
    { name: 'Mega Tool', sales: 87, revenue: 1450, growth: 8 },
    { name: 'Ultra Device', sales: 76, revenue: 1230, growth: 15 },
  ]);

  const getStatusIcon = (status${useTS ? ':string' : ''}) => {
    switch (status) {
      case 'success': return <i className="bi bi-check-circle-fill text-success"></i>;
      case 'warning': return <i className="bi bi-exclamation-triangle-fill text-warning"></i>;
      case 'error': return <i className="bi bi-x-circle-fill text-danger"></i>;
      default: return <i className="bi bi-check-circle-fill text-success"></i>;
    }
  };

  const getGrowthColor = (growth ${useTS ? ': number' : ''}) => growth >= 0 ? 'success' : 'danger';

  return (
    <div>
      <h1 className="display-4 fw-bold text-primary mb-3">Dashboard</h1>
      <p className="lead text-muted mb-4">
        Welcome back! Here's what's happening with your application today.
      </p>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-muted mb-2">Total Users</h6>
                  <h3 className="mb-2">{stats.users.toLocaleString()}</h3>
                  <small className="text-success">
                    <i className="bi bi-arrow-up me-1"></i>
                    +12% from last month
                  </small>
                </div>
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                  <i className="bi bi-people-fill"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-muted mb-2">Revenue</h6>
                  <h3 className="mb-2">\${stats.revenue.toLocaleString()}</h3>
                  <small className="text-success">
                    <i className="bi bi-arrow-up me-1"></i>
                    +8% from last month
                  </small>
                </div>
                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                  <i className="bi bi-currency-dollar"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-muted mb-2">Orders</h6>
                  <h3 className="mb-2">{stats.orders}</h3>
                  <small className="text-success">
                    <i className="bi bi-arrow-up me-1"></i>
                    +15% from last month
                  </small>
                </div>
                <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                  <i className="bi bi-cart"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-md-3">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-muted mb-2">Page Views</h6>
                  <h3 className="mb-2">{stats.views.toLocaleString()}</h3>
                  <small className="text-success">
                    <i className="bi bi-arrow-up me-1"></i>
                    +22% from last month
                  </small>
                </div>
                <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '56px', height: '56px' }}>
                  <i className="bi bi-eye"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="row g-3">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Top Products</h5>
              <button className="btn btn-primary btn-sm">View All</button>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th className="text-end">Sales</th>
                      <th className="text-end">Revenue</th>
                      <th className="text-end">Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product) => (
                      <tr key={product.name} className="border-b border-gray-100">
                        <td className="py-3 px-4">{product.name}</td>
                        <td className="py-3 px-4 text-right">{product.sales}</td>
                        <td className="py-3 px-4 text-right">\${product.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right">
                          <span className={\`px-2 py-1 rounded-full text-xs font-medium \${getGrowthColor(product.growth)}\`}>
                            {product.growth >= 0 ? '+' : ''}{product.growth}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Recent Activity</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="list-group-item d-flex align-items-start">
                    <div className="me-3">
                      {getStatusIcon(activity.status)}
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-bold">{activity.action}</div>
                      <small className="text-muted">
                        {activity.user} — {activity.time}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`);
  }

  // Profile page
  const profile = path.join(pagesDir, `Profile.${extx}`);
  if (!fs.existsSync(profile)) {
    writeFileSafe(profile, `import { useState } from 'react';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile] = useState({
    name: 'Nirmal Samaranayaka',
    email: 'nirmal.fullstack@gmail.com',
    phone: '+46 (72) xxx-xxxx',
    location: 'Stockholm, Sweden',
    company: 'Scania AB.',
    position: 'Senior Fullstack Developer',
    education: 'Computer Science, University of Colombo',
    website: 'https://dev.to/nirmalsamaranayaka',
    bio: 'Experienced Full Stack Engineer & Tech Lead | Specialized in .NET, React, Angular, and scalable cloud-native solutions.'
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
    twoFactorAuth: true
  });

  const [skills] = useState([
    'React', 'Redux', 'MobX', 'React Query', 'Angular', 'Micro Frontends', 
    'TypeScript', 'JavaScript', 'HTML/CSS', 'jQuery', 'Bootstrap', 'Tailwind CSS',
    '.NET 6/7/8', 'ASP.NET Core', 'C#', 'Web API', 'Microservices', 'Azure', 'AWS'
  ]);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSettingChange = (setting${useTS ? ':string' : ''}) => (event${useTS ? ': React.ChangeEvent<HTMLInputElement>' : ''}) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }));
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="display-4 fw-bold text-primary">Profile</h1>
        <div>
          {isEditing ? (
            <>
              <button className="btn btn-primary me-2" onClick={handleSave}>
                <i className="bi bi-check me-1"></i>Save
              </button>
              <button className="btn btn-outline-secondary" onClick={handleCancel}>
                <i className="bi bi-x me-1"></i>Cancel
              </button>
            </>
          ) : (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              <i className="bi bi-pencil me-1"></i>Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="row g-4">
        {/* Profile Header */}
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center gap-4">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px', fontSize: '3rem' }}>
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-grow-1">
                  <h2 className="mb-2">{profile.name}</h2>
                  <h5 className="text-muted mb-3">{profile.position} at {profile.company}</h5>
                  <p className="text-muted mb-3">{profile.bio}</p>
                  <div className="d-flex gap-1 flex-wrap">
                    {skills.map((skill) => (
                      <span key={skill} className="badge bg-secondary me-1 mb-1">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Personal Information</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-sm-6">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.name}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={profile.email}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={profile.phone}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.location}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Company</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.company}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label">Position</label>
                  <input
                    type="text"
                    className="form-control"
                    value={profile.position}
                    disabled={!isEditing}
                  />
                </div>
                <div className="col-12">
                  <label className="form-label">Bio</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={profile.bio}
                    disabled={!isEditing}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Settings</h5>
            </div>
            <div className="card-body">
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={handleSettingChange('emailNotifications')}
                />
                <label className="form-check-label">Email Notifications</label>
              </div>
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={handleSettingChange('pushNotifications')}
                />
                <label className="form-check-label">Push Notifications</label>
              </div>
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={handleSettingChange('darkMode')}
                />
                <label className="form-check-label">Dark Mode</label>
              </div>
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={handleSettingChange('twoFactorAuth')}
                />
                <label className="form-check-label">Two-Factor Auth</label>
              </div>
            </div>
          </div>

          <div className="card mt-3">
            <div className="card-header">
              <h5 className="mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <button className="btn btn-outline-primary w-100 mb-2">Download Resume</button>
              <button className="btn btn-outline-primary w-100 mb-2">Share Profile</button>
              <button className="btn btn-outline-danger w-100">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`);
  }
}

function createTailwindPages(pagesDir, extx, ext) {
  const home = path.join(pagesDir, `Home.${extx}`);
  if (!fs.existsSync(home)) {
    writeFileSafe(home, `export default function Home() {
  const features = [
    { icon: '🚀', title: 'Performance', description: 'Lightning-fast builds with modern tooling', color: 'text-blue-600' },
    { icon: '👥', title: 'Team Ready', description: 'Built for collaboration and scalability', color: 'text-green-600' },
    { icon: '⚡', title: 'Fast Development', description: 'Hot reload and instant feedback', color: 'text-purple-600' },
    { icon: '🛡️', title: 'Type Safe', description: 'Full TypeScript support with strict mode', color: 'text-yellow-600' },
    { icon: '🧹', title: 'Clean Code', description: 'ESLint + Prettier for code quality', color: 'text-gray-600' },
    { icon: '🎨', title: 'Beautiful UI', description: 'Tailwind CSS with utility-first approach', color: 'text-red-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">PolyFront</span>
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Your comprehensive multi-frontend scaffold with everything you need
          </p>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Built with React, TypeScript, Vite, Tailwind CSS, and modern development practices.
            Start building your next great application today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            This scaffold includes routing, state management, API integration, testing, and much more.
            Explore the different pages to see all the features in action.
          </p>
          <div className="space-x-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
              View Documentation
            </button>
            <button className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}`);
  }

  // Create other Tailwind pages
  createOtherTailwindPages(pagesDir, extx, ext);
}

function createGlobalCSS(srcDir, ui) {
  const css = path.join(srcDir, "styles", "global.css");
  if (!fs.existsSync(css)) {
    let cssContent = '';
    
    if (ui === "mui") {
      cssContent = `/* Global styles for PolyFront with Material-UI */
* {
  box-sizing: border-box;
}

html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease-in-out;
}

/* Focus styles */
*:focus {
  outline: 2px solid #1976d2;
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
}`;
    } else if (ui === "bootstrap") {
      cssContent = `/* Global styles for PolyFront with Bootstrap */
* {
  box-sizing: border-box;
}

html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f8f9fa;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease-in-out;
}

/* Focus styles */
*:focus {
  outline: 2px solid #0d6efd;
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
}`;
    } else if (ui === "tailwind") {
      cssContent = `/* Global styles for PolyFront with Tailwind CSS */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease-in-out;
}

/* Focus styles */
*:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
}`;
    } else {
      // Default CSS
      cssContent = `/* Global styles for PolyFront */
* {
  box-sizing: border-box;
}

html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #ffffff;
}`;
    }
    
    writeFileSafe(css, cssContent);
  }
}

function createI18nFiles(srcDir, ext, useTS) {
  if (useTS) {
    writeFileSafe(path.join(srcDir,"i18n",`index.${ext}`), `// Simple i18n implementation for PolyFront
interface Translations {
  [key: string]: Record<string, unknown>;
}

const translations: Translations = {
  en: {
    common: {
      welcome: 'Welcome',
      home: 'Home',
      about: 'About',
      dashboard: 'Dashboard',
      profile: 'Profile',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success'
    },
    home: {
      title: 'Welcome to PolyFront',
      subtitle: 'Your comprehensive multi-frontend scaffold with everything you need',
      description: 'Built with React, TypeScript, Vite, Material-UI, and modern development practices. Start building your next great application today.',
      features: {
        performance: 'Performance',
        teamReady: 'Team Ready',
        fastDevelopment: 'Fast Development',
        typeSafe: 'Type Safe',
        cleanCode: 'Clean Code',
        beautifulUI: 'Beautiful UI'
      }
    }
  },sv: {
    common: { welcome: 'Välkommen', home: 'Startsida', about: 'Om oss', dashboard: 'Översiktspanel', profile: 'Användarprofil' },
    home: { title: 'Välkommen till PolyFront' }
  },
  si: {
    common: { welcome: 'ආයුබෝවන්', home: 'මුල් පිටුව', about: 'සම්බන්ධයෙන්', dashboard: 'නිරීක්ෂණ පුවරුව', profile: 'පරිශීලක පැතිකඩ' },
    home: { title: 'PolyFront වෙත ඔබව සාදරයෙන් පිළිගනිමු' }
  }
};

export const t = (key: string, lang: string = 'en'): string => {
  const keys = key.split('.');
  let value: unknown = translations[lang] || translations.en;
  
  for (const k of keys) {
    if (typeof value === 'object' && value !== null && k in value) {
      value = (value as Record<string, unknown>)[k];
    } else {
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
};

export const getLanguage = (): string => 'en';

export const setLanguage = (lang: string): void => {
  if (lang in translations) {
    localStorage.setItem('lang', lang);
    console.log('Language set to:', lang);
  } else {
    console.log('Language not supported:', lang);
  }
};

export default { t, getLanguage, setLanguage, translations };`);
  } else {
    writeFileSafe(path.join(srcDir,"i18n",`index.${ext}`), `// Simple i18n implementation for PolyFront
const translations = {
  en: {
    common: {
      welcome: 'Welcome',
      home: 'Home',
      about: 'About',
      dashboard: 'Dashboard',
      profile: 'Profile',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success'
    },
    home: {
      title: 'Welcome to PolyFront',
      subtitle: 'Your comprehensive multi-frontend scaffold with everything you need',
      description: 'Built with React, TypeScript, Vite, Material-UI, and modern development practices. Start building your next great application today.',
      features: {
        performance: 'Performance',
        teamReady: 'Team Ready',
        fastDevelopment: 'Fast Development',
        typeSafe: 'Type Safe',
        cleanCode: 'Clean Code',
        beautifulUI: 'Beautiful UI'
      }
    }
  },
sv: {
    common: { welcome: 'Välkommen', home: 'Startsida', about: 'Om oss', dashboard: 'Översiktspanel', profile: 'Användarprofil' },
    home: { title: 'Välkommen till PolyFront' }
  },
  si: {
    common: { welcome: 'ආයුබෝවන්', home: 'මුල් පිටුව', about: 'සම්බන්ධයෙන්', dashboard: 'නිරීක්ෂණ පුවරුව', profile: 'පරිශීලක පැතිකඩ' },
    home: { title: 'PolyFront වෙත ඔබව සාදරයෙන් පිළිගනිමු' }
  }
};

export const t = (key, lang = 'en') => {
  const keys = key.split('.');
  let value = translations[lang] || translations.en;
  
  for (const k of keys) {
    value = value?.[k];
    if (!value) break;
  }
  
  return value || key;
};

export const getLanguage = () => 'en';
export const setLanguage = (lang) => {
  // In a real app, you'd save this to localStorage or context
  console.log('Language set to:', lang);
};

export default { t, getLanguage, setLanguage };`);
  }
}

function createDateUtils(srcDir, dateLib, ext, useTS) {
  const body = dateLib === "dayjs"
    ? `import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export const fmt = (d${useTS ? ': Date | string' : ''}, format${useTS ? ': string' : ''} = 'YYYY-MM-DD') => dayjs(d).format(format);
export const fromNow = (d${useTS ? ': Date | string' : ''}) => dayjs(d).fromNow();
export const isToday = (d${useTS ? ': Date | string' : ''}) => dayjs(d).isSame(dayjs(), 'day');
export const isYesterday = (d${useTS ? ': Date | string' : ''}) => dayjs(d).isSame(dayjs().subtract(1, 'day'), 'day');
export const formatRelative = (d${useTS ? ': Date | string' : ''}) => {
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return fromNow(d);
};`
    : dateLib === "date-fns"
    ? `import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export const fmt = (d${useTS ? ': Date' : ''}, formatStr${useTS ? ': string' : ''} = 'yyyy-MM-dd') => format(d, formatStr);
export const fromNow = (d${useTS ? ': Date' : ''}) => formatDistanceToNow(d, { addSuffix: true });
export const isTodayDate = (d${useTS ? ': Date' : ''}) => isToday(d);
export const isYesterdayDate = (d${useTS ? ': Date' : ''}) => isYesterday(d);
export const formatRelative = (d${useTS ? ': Date' : ''}) => {
  if (isTodayDate(d)) return 'Today';
  if (isYesterdayDate(d)) return 'Yesterday';
  return fromNow(d);
};`
    : `import { format, formatDistanceToNow, isSameDay, subDays } from 'date-fns';

export const fmt = (d${useTS ? ': Date | string' : ''}, formatStr${useTS ? ': string' : ''} = 'yyyy-MM-dd') => format(new Date(d), formatStr);
export const fromNow = (d${useTS ? ': Date | string' : ''}) => formatDistanceToNow(new Date(d), { addSuffix: true });
export const isToday = (d${useTS ? ': Date | string' : ''}) => isSameDay(new Date(d), new Date());
export const isYesterday = (d${useTS ? ': Date | string' : ''}) => isSameDay(new Date(d), subDays(new Date(), 1));
export const formatRelative = (d${useTS ? ': Date | string' : ''}) => {
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return fromNow(d);
};`;
  writeFileSafe(path.join(srcDir,"utils",`date.${ext}`), body + "\n");
}

function createCommonUtils(srcDir, ext, useTS) {
  if (useTS) {
    writeFileSafe(path.join(srcDir,"utils",`common.${ext}`), `// Common utility functions for PolyFront
export const debounce = <T extends (...args: unknown[]) => unknown>(func: T, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = <T extends (...args: unknown[]) => unknown>(func: T, limit: number) => {
  let inThrottle = false;
  return function(this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[\\d\\s\-()]+$/;
  return phoneRegex.test(phone);
};

export const languages = [
  { code: 'en', label: 'English' },
  { code: 'sv', label: 'Svenska(Sweden)' },
  { code: 'si', label: 'සිංහල (Sri Lanka)' },
  // add more languages here
];`);
  } else {
    writeFileSafe(path.join(srcDir,"utils",`common.${ext}`), `// Common utility functions for PolyFront
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const isValidEmail = (email) => {
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone) => {
  const phoneRegex = /^[+]?[\\d\\s\-()]+$/;
  return phoneRegex.test(phone);
};

export const languages = [
  { code: 'en', label: 'English' },
  { code: 'sv', label: 'Svenska(Sweden)' },
  { code: 'si', label: 'සිංහල (Sri Lanka)' },
  // add more languages here
];
`);
  }
}

function createCustomHooks(srcDir, ext, useTS) {
  const hooksDir = path.join(srcDir,"hooks");
  if (!fs.existsSync(path.join(hooksDir,`useLocalStorage.${ext}`))) {
    if (useTS) {
      writeFileSafe(path.join(hooksDir,`useLocalStorage.${ext}`), `import { useState } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}`);
    } else {
      writeFileSafe(path.join(hooksDir,`useLocalStorage.${ext}`), `import { useState } from 'react';

export function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}`);
    }

    if (useTS) {
      writeFileSafe(path.join(hooksDir,`useDebounce.${ext}`), `import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}`);
    } else {
      writeFileSafe(path.join(hooksDir,`useDebounce.${ext}`), `import { useState, useEffect } from 'react';

export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}`);
    }

    if (useTS) {
      writeFileSafe(path.join(hooksDir,`useApi.${ext}`), `import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  immediate?: boolean;
}

export function useApi<T>(
  url: string,
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<T>(url);
      setData(response.data);
      options.onSuccess?.(response.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      options.onError?.(error);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, options.onSuccess, options.onError]);

  useEffect(() => {
    if (options.immediate !== false) {
      execute();
    }
  }, [execute, options.immediate]);

  return { data, loading, error, execute };
}`);
    } else {
      writeFileSafe(path.join(hooksDir,`useApi.${ext}`), `import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

export function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(url);
      setData(response.data);
      if (options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An error occurred');
      setError(error);
      if (options.onError) options.onError(error);
    } finally {
      setLoading(false);
    }
  }, [url, options.onSuccess, options.onError]);

  useEffect(() => {
    if (options.immediate !== false) {
      execute();
    }
  }, [execute, options.immediate]);

  return { data, loading, error, execute };
}`);
    }

    if (useTS) {
      writeFileSafe(path.join(hooksDir,`useTheme.${ext}`), `import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateTheme = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setResolvedTheme(theme);
      }
    };

    updateTheme();
    mediaQuery.addEventListener('change', updateTheme);
    
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark'
  };
}`);
    } else {
      writeFileSafe(path.join(hooksDir,`useTheme.${ext}`), `import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage('theme', 'system');
  const [resolvedTheme, setResolvedTheme] = useState('light');

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateTheme = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setResolvedTheme(theme);
      }
    };

    updateTheme();
    mediaQuery.addEventListener('change', updateTheme);
    
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark'
  };
}`);
    }
    if (useTS) {
      writeFileSafe(path.join(hooksDir,`useLanguage.${ext}`), `import { useContext } from 'react';
import LanguageContext from '../context/LanguageContext';

// Only exports a hook (non-component)
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
};`);
    } else {
      writeFileSafe(path.join(hooksDir,`useLanguage.${ext}`), `import { useContext } from 'react';
import LanguageContext from '../context/LanguageContext';

// Only exports a hook (non-component)
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }
  return context;
};`);
    }

    writeFileSafe(path.join(hooksDir,`index.${ext}`), `// Export all custom hooks
export { useLocalStorage } from './useLocalStorage';
export { useDebounce } from './useDebounce';
export { useApi } from './useApi';
export { useTheme } from './useTheme';
export { useLanguage } from './useLanguage';`);

  }
}

function createReusableComponents(srcDir, ui, extx, ext, useTS) {
  const componentsDir = path.join(srcDir,"components");
  if (!fs.existsSync(path.join(componentsDir,`LoadingSpinner.${extx}`))) {
    if (ui === "mui") {
      writeFileSafe(path.join(componentsDir,`LoadingSpinner.${extx}`), `import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 40 
}) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={3}
    >
      <CircularProgress size={size} />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingSpinner;`);
    } else if (ui === "bootstrap") {
      writeFileSafe(path.join(componentsDir,`LoadingSpinner.${extx}`), `interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'md' 
}) => {
  const sizeClass = size === 'sm' ? 'spinner-border-sm' : size === 'lg' ? 'spinner-border-lg' : '';
  
  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-3">
      <div className={\`spinner-border \${sizeClass}\`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted mt-2">{message}</p>
    </div>
  );
};

export default LoadingSpinner;`);
    } else if (ui === "tailwind") {
      writeFileSafe(path.join(componentsDir,`LoadingSpinner.${extx}`), `interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-3">
      <div className={\`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 \${sizeClasses[size]}\`}></div>
      <p className="text-gray-500 mt-2">{message}</p>
    </div>
  );
};

export default LoadingSpinner;`);
    }
  }
}

function createLayoutComponent(srcDir, ui, extx, ext, useTS) {
  const layout = path.join(srcDir,"layout",`Layout.${extx}`);
  if (!fs.existsSync(layout)) {
    if (ui === "mui") {
      writeFileSafe(layout, `import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  Chip,
  ListItemButton,
  Select,
  ${useTS ? 'type SelectChangeEvent' : ''}
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Info,
  Dashboard,
  Person,
  Notifications,
  AccountCircle
} from '@mui/icons-material';

import i18n from '../i18n';
import { useLanguage } from '../hooks/useLanguage';
import { languages } from '../utils/common';

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  ${useTS ? "const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);": "const [anchorEl, setAnchorEl] = useState(null);"}
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const { currentLang, setCurrentLang } = useLanguage();

  const menuItems = [
    { key: 'home', icon: <Home />, path: '/' },
    { key: 'about', icon: <Info />, path: '/about' },
    { key: 'dashboard', icon: <Dashboard />, path: '/dashboard' },
    { key: 'profile', icon: <Person />, path: '/profile' },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleProfileMenuOpen = (event ${useTS ? ': React.MouseEvent<HTMLButtonElement>' : ''}) => {
    setAnchorEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => setAnchorEl(null);

  const handleLanguageChange = (event ${useTS ? ': SelectChangeEvent' : ''} ) => {
    setCurrentLang(event.target.value);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          PolyFront
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Multi-Frontend Scaffold
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem disablePadding key={item.key}>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              selected={location.pathname === item.path}
              sx={{
                cursor: 'pointer',
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={i18n.t(\`common.\${item.key}\`, currentLang)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PolyFront
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip label="v0.0.4" size="small" variant="outlined" />
            {/* Language selector using i18n */}
            <Select
              value={currentLang}
              onChange={handleLanguageChange}
              size="small"
              sx={{
                color: 'white',
                borderColor: 'white',
                '.MuiSvgIcon-root': { color: 'white' },
              }}
            >
              {languages.map((lang) => (
                <MenuItem key={lang.code} value={lang.code}>
                  {lang.label}
                </MenuItem>
              ))}
            </Select>
            <IconButton color="inherit">
              <Notifications />
            </IconButton>
            <IconButton
              color="inherit"
              onClick={handleProfileMenuOpen}
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: 250 }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: \`calc(100% - 250px)\` },
          mt: 8,
        }}
      >
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={handleProfileMenuClose}>Profile</MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>Settings</MenuItem>
        <MenuItem onClick={handleProfileMenuClose}>Logout</MenuItem>
      </Menu>
    </Box>
  );
};

export default Layout;`);
    } else if (ui === "bootstrap") {
      writeFileSafe(layout, `import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import i18n from '../i18n';
import { useLanguage } from '../hooks/useLanguage';
import { languages } from '../utils/common';


const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentLang, setCurrentLang } = useLanguage();

  const menuItems = [
    { key: 'home', path: '/' },
    { key: 'about', path: '/about' },
    { key: 'dashboard', path: '/dashboard' },
    { key: 'profile', path: '/profile' },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <nav className="bg-dark text-white" style={{ width: '250px' }}>
        <div className="p-3 border-bottom">
          <h5 className="text-primary fw-bold mb-1">PolyFront</h5>
          <small className="text-muted">{i18n.t('common.welcome', currentLang)}</small>
        </div>
        <ul className="nav flex-column">
          {menuItems.map((item) => (
            <li className="nav-item" key={item.key}>
              <button
                className={\`nav-link text-white w-100 text-start border-0 bg-transparent \${location.pathname === item.path ? 'active bg-primary' : ''}\`}
                onClick={() => navigate(item.path)}
              >
                {i18n.t(\`common.\${item.key}\`, currentLang)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main content */}
      <div className="flex-grow-1">
        {/* Header */}
        <header className="bg-white border-bottom p-3">
          <div className="d-flex justify-content-between align-items-center">
            <button
              className="btn btn-outline-secondary d-md-none"
              onClick={handleDrawerToggle}
            >
              ☰
            </button>
            <h4 className="mb-0">PolyFront</h4>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-secondary">v0.0.4</span>
              
              {/* Language Selector */}
              <select
                title='Select Language'
                className="form-select form-select-sm"
                value={currentLang}
                onChange={(e) => setCurrentLang(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.label}
                  </option>
                ))}
              </select>

              <button className="btn btn-outline-secondary btn-sm">👤</button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;`);
    } else if (ui === "tailwind") {
      writeFileSafe(layout, `import { useState } from 'react';
      import { Outlet, useNavigate, useLocation } from 'react-router-dom';
      import i18n from '../i18n';
      import { useLanguage } from '../hooks/useLanguage';
      import { languages } from '../utils/common';
      
      const Layout = () => {
        const navigate = useNavigate();
        const location = useLocation();
      
        // Language from context
        const { currentLang, setCurrentLang } = useLanguage();
      
        const menuItems = [
          { key: 'home', path: '/' },
          { key: 'about', path: '/about' },
          { key: 'dashboard', path: '/dashboard' },
          { key: 'profile', path: '/profile' },
        ];
      
        const [mobileOpen, setMobileOpen] = useState(false);
        const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
      
        return (
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <nav className="bg-gray-900 text-white w-64 hidden md:block">
              <div className="p-6 border-b border-gray-700">
                <h5 className="text-blue-400 font-bold text-lg mb-1">PolyFront</h5>
                <p className="text-gray-400 text-sm">{i18n.t('common.welcome', currentLang)}</p>
              </div>
              <ul className="py-4">
                {menuItems.map((item) => (
                  <li key={item.key}>
                    <button
                      className={\`w-full text-left px-6 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors \${
                        location.pathname === item.path ? 'bg-blue-600 text-white' : ''
                      }\`}
                      onClick={() => navigate(item.path)}
                    >
                      {i18n.t(\`common.\${item.key}\`, currentLang)}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
      
            {/* Main content */}
            <div className="flex-1">
              {/* Header */}
              <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <button
                  className="md:hidden bg-gray-200 p-2 rounded-lg"
                  onClick={handleDrawerToggle}
                >
                  ☰
                </button>
                <h4 className="text-xl font-semibold text-gray-900">PolyFront</h4>
      
                {/* Version + Language + User */}
                <div className="flex items-center gap-3">
                  {/* Version */}
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">v0.0.2</span>
      
                  {/* Language selector */}
                  <select
                    title='Select Language'
                    value={currentLang}
                    onChange={(e) => setCurrentLang(e.target.value)}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
      
                  {/* User button */}
                  <button className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 transition-colors">
                    👤
                  </button>
                </div>
              </header>
      
              {/* Page content */}
              <main className="p-6">
                <Outlet />
              </main>
            </div>
          </div>
        );
      };
      
      export default Layout;`);
    }
  }
}

function createOtherTailwindPages(pagesDir, extx, ext) {
  // About page
  const about = path.join(pagesDir, `About.${extx}`);
  if (!fs.existsSync(about)) {
    writeFileSafe(about, `export default function About() {
  const techStack = [
    { name: 'React 19', version: 'Latest', category: 'Framework' },
    { name: 'TypeScript', version: '5.x', category: 'Language' },
    { name: 'Vite', version: '7.x', category: 'Build Tool' },
    { name: 'Tailwind CSS', version: '3.x', category: 'UI Library' },
    { name: 'React Router', version: '7.x', category: 'Routing' },
    { name: 'Zustand', version: '5.x', category: 'State Management' },
    { name: 'Axios', version: '1.x', category: 'HTTP Client' },
    { name: 'Vitest', version: '3.x', category: 'Testing' }
  ];
  const features = [
    'Modern React with hooks and functional components',
    'Full TypeScript support with strict mode',
    'Beautiful Tailwind CSS with utility-first approach',
    'Client-side routing with React Router',
    'State management with Zustand',
    'API integration with Axios',
    'Comprehensive testing setup with Vitest',
    'ESLint and Prettier for code quality',
    'Hot module replacement for fast development',
    'Responsive design with mobile-first approach'
  ];
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-blue-600">PolyFront</span>
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            A comprehensive scaffold for modern web applications
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Technology Stack</h2>
            <p className="text-gray-600 mb-6">
              Built with the latest and greatest technologies in the React ecosystem.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {techStack.map((tech, index) => (
                <div key={index} className="bg-blue-100 text-blue-800 px-3 py-2 rounded-lg">
                  <div className="font-semibold">{tech.name} {tech.version}</div>
                  <div className="text-sm text-blue-600">{tech.category}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">Key Features</h2>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Choose PolyFront?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Production Ready</h3>
              <p className="text-gray-600">Built with best practices and industry standards</p>
            </div>
            <div>
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast Development</h3>
              <p className="text-gray-600">Hot reload and instant feedback for rapid iteration</p>
            </div>
            <div>
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Team Friendly</h3>
              <p className="text-gray-600">Consistent code style and comprehensive tooling</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`);
    // Dashboard page
    const dashboard = path.join(pagesDir, `Dashboard.${extx}`);
    if (!fs.existsSync(dashboard)) {
      writeFileSafe(dashboard, `import { useState } from 'react';
export default function Dashboard() {
  const [stats] = useState({
    users: 1234,
    revenue: 45678,
    orders: 89,
    views: 12345
  });
  const [recentActivity] = useState([
    { id: 1, user: 'Nirmal Samaranayaka', action: 'Order placed', time: '2 min ago', status: 'success' },
    { id: 2, user: 'Jane Smith', action: 'Payment received', time: '5 min ago', status: 'success' },
    { id: 3, user: 'Bob Johnson', action: 'Login attempt', time: '10 min ago', status: 'warning' },
    { id: 4, user: 'Alice Brown', action: 'Account created', time: '15 min ago', status: 'success' },
  ]);
  const [topProducts] = useState([
    { name: 'Premium Widget', sales: 156, revenue: 2340, growth: 12 },
    { name: 'Super Gadget', sales: 98, revenue: 1890, growth: -5 },
    { name: 'Mega Tool', sales: 87, revenue: 1450, growth: 8 },
    { name: 'Ultra Device', sales: 76, revenue: 1230, growth: 15 },
  ]);
  const getStatusIcon = (status : string) => {
    switch (status) {
      case 'success': return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
      case 'warning': return <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>;
      case 'error': return <div className="w-3 h-3 bg-red-500 rounded-full"></div>;
      default: return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
    }
  };
  const getGrowthColor = (growth ${useTS?': number':''}) => growth >= 0 ? 'text-green-600' : 'text-red-600';
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome back! Here's what's happening with your application today.
        </p>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stats.users.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <span className="mr-1">↗</span>
                  +12% from last month
                </p>
              </div>
              <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">👥</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">\${stats.revenue.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <span className="mr-1">↗</span>
                  +8% from last month
                </p>
              </div>
              <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">💰</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Orders</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stats.orders}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <span className="mr-1">↗</span>
                  +15% from last month
                </p>
              </div>
              <div className="w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🛒</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Page Views</p>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stats.views.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <span className="mr-1">↗</span>
                  +22% from last month
                </p>
              </div>
              <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">👁️</span>
              </div>
            </div>
          </div>
        </div>
        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Top Products</h2>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Product</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Sales</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Revenue</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProducts.map((product) => (
                        <tr key={product.name} className="border-b border-gray-100">
                          <td className="py-3 px-4">{product.name}</td>
                          <td className="py-3 px-4 text-right">{product.sales}</td>
                          <td className="py-3 px-4 text-right">\${product.revenue.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right">
                            <span className={\`px-2 py-1 rounded-full text-xs font-medium \${getGrowthColor(product.growth)}\`}>
                              {product.growth >= 0 ? '+' : ''}{product.growth}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="mt-1">
                        {getStatusIcon(activity.status)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">
                          {activity.user} — {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`);
    // Profile page
    const profile = path.join(pagesDir, `Profile.${extx}`);
    if (!fs.existsSync(profile)) {
      writeFileSafe(profile, `import { useState } from 'react';
export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile] = useState({
    name: 'Nirmal Samaranayaka',
    email: 'nirmal.fullstack@gmail.com',
    phone: '+46 (72) xxx-xxxx',
    location: 'Stockholm, Sweden',
    company: 'Scania AB.',
    position: 'Senior Fullstack Developer',
    education: 'Computer Science, University of Colombo',
    website: 'https://dev.to/nirmalsamaranayaka',
    bio: 'Experienced Full Stack Engineer & Tech Lead | Specialized in .NET, React, Angular, and scalable cloud-native solutions.'
  });
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    darkMode: false,
    twoFactorAuth: true
  });
  const [skills] = useState([
    'React', 'Redux', 'MobX', 'React Query', 'Angular', 'Micro Frontends', 
    'TypeScript', 'JavaScript', 'HTML/CSS', 'jQuery', 'Tailwind CSS', 'Bootstrap',
    '.NET 6/7/8', 'ASP.NET Core', 'C#', 'Web API', 'Microservices', 'Azure', 'AWS'
  ]);
  const handleSave = () => {
    setIsEditing(false);
  };
  const handleCancel = () => {
    setIsEditing(false);
  };
  const handleSettingChange = (setting:string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      [setting]: event.target.checked
    }));
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Profile</h1>
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                  onClick={handleSave}
                >
                  Save
                </button>
                <button 
                  className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-3 rounded-lg transition-colors"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Header */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center space-x-8">
                <div className="w-32 h-32 bg-blue-600 text-white rounded-full flex items-center justify-center text-4xl font-bold">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">{profile.name}</h2>
                  <h4 className="text-xl text-gray-600 mb-4">{profile.position} at {profile.company}</h4>
                  <p className="text-gray-600 mb-6">{profile.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span key={skill} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={profile.name}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={profile.email}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={profile.phone}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={profile.location}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={profile.company}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={profile.position}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      value={profile.bio}
                      disabled={!isEditing}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Settings */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Settings</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      checked={settings.emailNotifications}
                      onChange={handleSettingChange('emailNotifications')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Push Notifications</span>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      checked={settings.pushNotifications}
                      onChange={handleSettingChange('pushNotifications')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Dark Mode</span>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      checked={settings.darkMode}
                      onChange={handleSettingChange('darkMode')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Two-Factor Auth</span>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                      checked={settings.twoFactorAuth}
                      onChange={handleSettingChange('twoFactorAuth')}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg mt-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                    Download Resume
                  </button>
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors">
                    Share Profile
                  </button>
                  <button className="w-full bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg transition-colors">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

 );
}`);
    }
  }
}
}

function createCustomContext(srcDir, extx, useTS) {
  const contextsDir = path.join(srcDir, "context");
  if (!fs.existsSync(contextsDir)) fs.mkdirSync(contextsDir);

  const filePath = path.join(contextsDir, `LanguageContext.${extx}`);
  if (fs.existsSync(filePath)) {
    console.log(` LanguageContext.${extx} already exists, skipping...`);
    return;
  }

  const codeTS = `import React, { createContext, useState } from 'react';
import i18n from '../i18n';

interface LanguageContextProps {
  currentLang: string;
  setCurrentLang: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextProps>({
  currentLang: i18n.getLanguage(),
  setCurrentLang: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('lang') || i18n.getLanguage());

  const changeLanguage = (lang: string) => {
    i18n.setLanguage(lang); // sets localStorage too
    setCurrentLang(lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setCurrentLang: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
`;

  const codeJS = `import React, { createContext, useState } from 'react';
import i18n from '../i18n';

const LanguageContext = createContext({
  currentLang: i18n.getLanguage(),
  setCurrentLang: () => {},
});

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(localStorage.getItem('lang') || i18n.getLanguage());

  const changeLanguage = (lang) => {
    i18n.setLanguage(lang);
    setCurrentLang(lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLang, setCurrentLang: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageContext;
`;

  fs.writeFileSync(filePath, useTS ? codeTS : codeJS, "utf8");
  console.log(` Created ${filePath}`);
}

module.exports = { scaffoldReactProjectStructure };
