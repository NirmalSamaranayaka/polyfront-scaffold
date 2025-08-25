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

  // 4) enhanced pages + router with beautiful UI
  const home = path.join(srcDir,"pages",`Home.${extx}`);
  if (!fs.existsSync(home)) {
    writeFileSafe(home, `import React from 'react';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Chip, Avatar, Container, Paper } from '@mui/material';
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
          <Grid item xs={12} sm={6} md={4} key={index}>
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
}`);
    
    writeFileSafe(path.join(srcDir,"pages",`About.${extx}`), `import React from 'react';
import { Box, Typography, Container, Paper, Grid, List, ListItem, ListItemIcon, ListItemText, Divider, Chip } from '@mui/material';
import { CheckCircle, Star, Code, BugReport, Security, Speed, Palette, Group } from '@mui/icons-material';

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
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom color="primary" fontWeight="bold">
          About PolyFront
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          A comprehensive scaffold for modern web applications
        </Typography>
      </Box>

      <Grid container spacing={4} mb={6}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h4" gutterBottom color="primary">
              Technology Stack
            </Typography>
            <Typography variant="body1" paragraph>
              Built with the latest and greatest technologies in the React ecosystem.
            </Typography>
            <Grid container spacing={2}>
              {techStack.map((tech, index) => (
                <Grid item xs={6} key={index}>
                  <Chip 
                    label={\`\${tech.name} \${tech.version}\`}
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="caption" display="block" color="text.secondary">
                    {tech.category}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 4, height: '100%' }}>
            <Typography variant="h4" gutterBottom color="primary">
              Key Features
            </Typography>
            <List>
              {features.map((feature, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
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
        <Typography variant="h4" gutterBottom>
          Why Choose PolyFront?
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={4}>
            <Star color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" gutterBottom>Production Ready</Typography>
            <Typography variant="body2" color="text.secondary">
              Built with best practices and industry standards
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Speed color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" gutterBottom>Fast Development</Typography>
            <Typography variant="body2" color="text.secondary">
              Hot reload and instant feedback for rapid iteration
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Group color="primary" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h6" gutterBottom>Team Friendly</Typography>
            <Typography variant="body2" color="text.secondary">
              Consistent code style and comprehensive tooling
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}`);
  }
  const routes = path.join(srcDir,"routes",`index.${extx}`);
  if (!fs.existsSync(routes)) {
    writeFileSafe(routes, `import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
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
]);
`);
  }

  // 5) enhanced global CSS with Material-UI theme support
  const css = path.join(srcDir,"styles","global.css");
  if (!fs.existsSync(css)) {
    writeFileSafe(css, `/* Global styles for PolyFront */
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
}`);
  }

  // 6) store
  if (store === "redux" && typeof storeWriters.redux === "function") storeWriters.redux(projectDir, useTS);
  if (store === "mobx"  && typeof storeWriters.mobx  === "function") storeWriters.mobx(projectDir, useTS);

  // 7) enhanced i18n with demo translations
  if (i18n && !fs.existsSync(path.join(srcDir,"i18n",`index.${ext}`))) {
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
  es: {
    common: {
      welcome: 'Bienvenido',
      home: 'Inicio',
      about: 'Acerca de',
      dashboard: 'Panel',
      profile: 'Perfil',
      save: 'Guardar',
      cancel: 'Cancelar',
      edit: 'Editar',
      delete: 'Eliminar',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito'
    }
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

  // 8) enhanced date utils with more functionality
  if (dateLib && dateLib !== "none" && !fs.existsSync(path.join(srcDir,"utils",`date.${ext}`))) {
    const body = dateLib === "dayjs"
      ? `import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export const fmt = (d, format = 'YYYY-MM-DD') => dayjs(d).format(format);
export const fromNow = (d) => dayjs(d).fromNow();
export const isToday = (d) => dayjs(d).isSame(dayjs(), 'day');
export const isYesterday = (d) => dayjs(d).isSame(dayjs().subtract(1, 'day'), 'day');
export const formatRelative = (d) => {
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return fromNow(d);
};`
      : dateLib === "date-fns"
      ? `import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export const fmt = (d, formatStr = 'yyyy-MM-dd') => format(d, formatStr);
export const fromNow = (d) => formatDistanceToNow(d, { addSuffix: true });
export const isTodayDate = (d) => isToday(d);
export const isYesterdayDate = (d) => isYesterday(d);
export const formatRelative = (d) => {
  if (isTodayDate(d)) return 'Today';
  if (isYesterdayDate(d)) return 'Yesterday';
  return fromNow(d);
};`
      : `import moment from 'moment';

export const fmt = (d, format = 'YYYY-MM-DD') => moment(d).format(format);
export const fromNow = (d) => moment(d).fromNow();
export const isToday = (d) => moment(d).isSame(moment(), 'day');
export const isYesterday = (d) => moment(d).isSame(moment().subtract(1, 'day'), 'day');
export const formatRelative = (d) => {
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return fromNow(d);
};`;
    writeFileSafe(path.join(srcDir,"utils",`date.${ext}`), body + "\n");
  }

  // 8.5) Additional utility functions
  const utils = path.join(srcDir,"utils",`common.${ext}`);
  if (!fs.existsSync(utils)) {
    writeFileSafe(utils, `// Common utility functions for PolyFront
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
  const phoneRegex = /^[+]?[\\d\\s\\-\\(\\)]+$/;
  return phoneRegex.test(phone);
};`);
  }

  // 9) Custom hooks for advanced functionality
  const hooksDir = path.join(srcDir,"hooks");
  if (!fs.existsSync(path.join(hooksDir,`useLocalStorage.${ext}`))) {
    writeFileSafe(path.join(hooksDir,`useLocalStorage.${ext}`), `import { useState, useEffect } from 'react';

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

    writeFileSafe(path.join(hooksDir,`useApi.${ext}`), `import { useState, useEffect } from 'react';
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

  const execute = async () => {
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
  };

  useEffect(() => {
    if (options.immediate !== false) {
      execute();
    }
  }, [url]);

  return { data, loading, error, execute };
}`);

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

    writeFileSafe(path.join(hooksDir,`index.${ext}`), `// Export all custom hooks
export { useLocalStorage } from './useLocalStorage';
export { useDebounce } from './useDebounce';
export { useApi } from './useApi';
export { useTheme } from './useTheme';`);
  }
  // 10) Reusable components
  const componentsDir = path.join(srcDir,"components");
  if (!fs.existsSync(path.join(componentsDir,`LoadingSpinner.${extx}`))) {
    writeFileSafe(path.join(componentsDir,`LoadingSpinner.${extx}`), `import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

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

    writeFileSafe(path.join(componentsDir,`ErrorBoundary.${extx}`), `import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { BugReport, Refresh } from '@mui/icons-material';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="400px"
          p={3}
        >
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center', maxWidth: 500 }}>
            <BugReport color="error" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h4" gutterBottom color="error">
              Oops! Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </Typography>
            {this.state.error && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Error: {this.state.error.message}
              </Typography>
            )}
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={this.handleReset}
              sx={{ mr: 2 }}
            >
              Try Again
            </Button>
            <Button
              variant="outlined"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;`);

    writeFileSafe(path.join(componentsDir,`ConfirmDialog.${extx}`), `import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography
} from '@mui/material';
import { Warning } from '@mui/icons-material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  severity?: 'warning' | 'error' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  severity = 'warning',
  onConfirm,
  onCancel
}) => {
  const getSeverityColor = () => {
    switch (severity) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'warning';
    }
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Warning color={getSeverityColor()} />
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          color={getSeverityColor()} 
          variant="contained"
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;`);

    writeFileSafe(path.join(componentsDir,`index.${ext}`), `// Export all reusable components
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as ErrorBoundary } from './ErrorBoundary';
export { default as ConfirmDialog } from './ConfirmDialog';`);
  }

  // 11) Layout component
  const layout = path.join(srcDir,"layout",`Layout.${extx}`);
  if (!fs.existsSync(layout)) {
    writeFileSafe(layout, `import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
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
  Avatar,
  Menu,
  MenuItem,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home,
  Info,
  Dashboard,
  Person,
  Brightness4,
  Brightness7,
  Notifications,
  AccountCircle
} from '@mui/icons-material';

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'About', icon: <Info />, path: '/about' },
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Profile', icon: <Person />, path: '/profile' },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleProfileMenuClose = () => setAnchorEl(null);

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
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
            selected={location.pathname === item.path}
            sx={{
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
            <ListItemText primary={item.text} />
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
            <Chip label="v1.0.0" size="small" variant="outlined" color="inherit" />
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
  }

  // 10) Additional demo pages
  const dashboard = path.join(srcDir,"pages",`Dashboard.${extx}`);
  if (!fs.existsSync(dashboard)) {
    writeFileSafe(dashboard, `import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  AttachMoney,
  ShoppingCart,
  Visibility,
  MoreVert,
  CheckCircle,
  Warning,
  Error
} from '@mui/icons-material';

export default function Dashboard() {
  const [stats, setStats] = useState({
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle color="success" />;
      case 'warning': return <Warning color="warning" />;
      case 'error': return <Error color="error" />;
      default: return <CheckCircle color="success" />;
    }
  };

  const getGrowthColor = (growth) => growth >= 0 ? 'success' : 'error';

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
        <Grid item xs={12} sm={6} md={3}>
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

        <Grid item xs={12} sm={6} md={3}>
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

        <Grid item xs={12} sm={6} md={3}>
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

        <Grid item xs={12} sm={6} md={3}>
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
        <Grid item xs={12} md={8}>
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

        <Grid item xs={12} md={4}>
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

  const profile = path.join(srcDir,"pages",`Profile.${extx}`);
  if (!fs.existsSync(profile)) {
    writeFileSafe(profile, `import React, { useState } from 'react';
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
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Switch,
  FormControlLabel,
  Alert
} from '@mui/material';
import {
  Edit,
  Save,
  Cancel,
  Email,
  Phone,
  LocationOn,
  Work,
  School,
  Language,
  Notifications,
  Security,
  Palette
} from '@mui/icons-material';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
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

  const handleSettingChange = (setting) => (event) => {
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
        <Grid item xs={12}>
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
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Personal Information" />
            <CardContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12} sm={6}>
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
                <Grid item xs={12}>
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
        <Grid item xs={12} md={4}>
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

module.exports = { scaffoldReactProjectStructure };
