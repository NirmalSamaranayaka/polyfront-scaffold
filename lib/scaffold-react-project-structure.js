// lib/scaffold-react-project-structure.js
const fs = require("fs");
const path = require("path");
const { createMUIPages, createBootstrapPages, createTailwindPages, createAntdPages, createChakraPages } = require("./pages/index");

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
  createCustomHooks(srcDir, ext, useTS, ui);

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
    createTailwindPages(pagesDir, extx, ext, useTS);
  }else if (ui === "antd") {
    createAntdPages(pagesDir, extx, ext, useTS);
  }else if (ui === "chakra") {
    createChakraPages(pagesDir, extx, ext, useTS);
  } else {
    // Default to MUI if no specific UI is chosen
    createMUIPages(pagesDir, extx, ext, useTS);
  }
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

function createCustomHooks(srcDir, ext, useTS, ui) {
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

    if (ui === "chakra"){
      if (useTS) {
        writeFileSafe(path.join(hooksDir,`useColorMode.${ext}`), `import * as React from "react";
import { useTheme } from "next-themes";

export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme();
  const colorMode = (resolvedTheme ?? "light") as "light" | "dark";
  const toggleColorMode = React.useCallback(
    () => setTheme(colorMode === "light" ? "dark" : "light"),
    [colorMode, setTheme]
  );
  return { colorMode, toggleColorMode, setColorMode: setTheme };
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { resolvedTheme } = useTheme();
  return (resolvedTheme === "dark" ? dark : light) as T;
};`);
      } else {
        writeFileSafe(path.join(hooksDir,`useColorMode.${ext}`), `import * as React from "react";
import { useTheme } from "next-themes";

export function useColorMode() {
  const { resolvedTheme, setTheme } = useTheme();
  const colorMode = (resolvedTheme ?? "light");
  const toggleColorMode = React.useCallback(
    () => setTheme(colorMode === "light" ? "dark" : "light"),
    [colorMode, setTheme]
  );
  return { colorMode, toggleColorMode, setColorMode: setTheme };
}

export function useColorModeValue(light, dark) {
  const { resolvedTheme } = useTheme();
  return (resolvedTheme === "dark" ? dark : light);
};`);
      }
    }

    writeFileSafe(path.join(hooksDir,`index.${ext}`), `// Export all custom hooks
export { useLocalStorage } from './useLocalStorage';
export { useDebounce } from './useDebounce';
export { useApi } from './useApi';
export { useTheme } from './useTheme';
export { useLanguage } from './useLanguage';
${ui === "chakra" ? "export { useColorMode, useColorModeValue } from './useColorMode';":""}`);

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
            <Chip label="v0.0.29" size="small" variant="outlined" />
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
              <span className="badge bg-secondary">v0.0.29</span>
              
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
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-sm">v0.0.29</span>
      
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
    }else if (ui === "antd") {
      writeFileSafe(layout, `import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu as AntMenu, Drawer, Button, Typography, Select, Tag, Badge, Dropdown, Grid } from 'antd';
import { MenuOutlined, HomeOutlined, InfoCircleOutlined, DashboardOutlined, UserOutlined, BellOutlined } from '@ant-design/icons';
${useTS?'import type { MenuProps } from \'antd\';':''} 
import i18n from '../i18n';
import { useLanguage } from '../hooks/useLanguage';
import { languages } from '../utils/common';
const { Header, Sider, Content } = AntLayout;
const Layout = () => {
const [mobileOpen, setMobileOpen] = useState(false);
const navigate = useNavigate();
const location = useLocation();
const screens = Grid.useBreakpoint();
const { currentLang, setCurrentLang } = useLanguage();
const menuItems = [
{ key: '/', icon: <HomeOutlined />, label: i18n.t('common.home', currentLang) },
{ key: '/about', icon: <InfoCircleOutlined />, label: i18n.t('common.about', currentLang) },
{ key: '/dashboard', icon: <DashboardOutlined />, label: i18n.t('common.dashboard', currentLang) },
{ key: '/profile', icon: <UserOutlined />, label: i18n.t('common.profile', currentLang) },
];
const profileMenu = {
items: [
{ key: 'profile', label: 'Profile' },
{ key: 'settings', label: 'Settings' },
{ type: 'divider' },
{ key: 'logout', label: 'Logout' },
] ${useTS?'as MenuProps[\'items\'],':''} 
};
const handleLanguageChange = (value ${useTS ? ': string' : ''}) => {
setCurrentLang(value);
};
const Sidebar = (
<div style={{ width: 250 }}>
<div style={{ padding: 16, borderBottom: '1px solid #f0f0f0' }}>
<Typography.Title level={5} style={{ margin: 0, color: 'var(--ant-color-primary)' }}>PolyFront</Typography.Title>
<Typography.Text type="secondary">Multi-Frontend Scaffold</Typography.Text>
</div>
<AntMenu
mode="inline"
selectedKeys={[location.pathname]}
onClick={({ key }) => { navigate(key); if (!screens.md) setMobileOpen(false); }}
items={menuItems}
style={{ borderRight: 0 }}
/>
</div>
);
  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          position: "fixed",
          insetInlineStart: 0,
          insetInlineEnd: 0,
          zIndex: 1000,
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {!screens.md && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          />
        )}
        <Typography.Title
          level={4}
          style={{ color: "white", margin: 0, flex: 1 }}
        >
          PolyFront
        </Typography.Title>
        <Tag bordered={false}>v0.0.29</Tag>
        <Select
          size="small"
          value={currentLang}
          onChange={handleLanguageChange}
          options={languages.map((l) => ({ value: l.code, label: l.label }))}
          style={{ width: 120 }}
        />
        <Badge dot>
          <Button
            type="text"
            icon={<BellOutlined />}
            aria-label="Notifications"
          />
        </Badge>
        <Dropdown menu={profileMenu} trigger={["click"]}>
          <Button type="text" icon={<UserOutlined />} aria-label="Account" />
        </Dropdown>
      </Header>
      <AntLayout>
        {screens.md ? (
          <Sider
            width={250}
            style={{
              marginTop: 64,
              background: "var(--ant-layout-sider-background)",
            }}
          >
            {Sidebar}
          </Sider>
        ) : (
          <Drawer
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            width={250}
            bodyStyle={{ padding: 0 }}
          >
            {Sidebar}
          </Drawer>
        )}
        <AntLayout style={{ marginTop: 64 }}>
          <Content style={{ padding: 24 }}>
            <Outlet />
          </Content>
        </AntLayout>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;`);
    }else if (ui === "chakra"){
       writeFileSafe(layout, `import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Flex,
  IconButton,
  useDisclosure,
  VStack,
  HStack,
  Text,
  Container,
  Badge,
  Menu,
  Button,
  Separator,
  Avatar,
  Drawer,
  Select,
  Portal,
  createListCollection,
} from '@chakra-ui/react';
import { useColorMode, useColorModeValue } from '../hooks/useColorMode';
import { FiMenu, FiHome, FiInfo, FiGrid, FiUser, FiBell, FiChevronDown, FiSun, FiMoon } from 'react-icons/fi';

import i18n from '../i18n';
import { useLanguage } from '../hooks/useLanguage';
import { languages } from '../utils/common';

const sidebarWidth = 250;

${useTS ? `type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
};` : ''}

function NavItem({ icon, label, active, onClick } ${useTS ?': NavItemProps': ''}) {
  // Hover/background + text colors (fix: ensure text is visible on hover)
  const hoverBg = active ? 'blue.600' : useColorModeValue('gray.100', 'gray.700');
  const baseText = active ? 'white' : useColorModeValue('gray.800', 'gray.100');
  const hoverText = active ? 'white' : useColorModeValue('black', 'white');

  return (
    <HStack
      gap={3}
      px={3}
      py={2.5}
      borderRadius="md"
      cursor="pointer"
      bg={active ? 'blue.500' : 'transparent'}
      color={baseText}
      _hover={{ bg: hoverBg, color: hoverText }}
      onClick={onClick}
    >
      <Box fontSize="lg">{icon}</Box>
      <Text>{label}</Text>
    </HStack>
  );
}

function Layout() {
  // v3 disclosure: { open, setOpen, onOpen, onClose }
  const { open, setOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const location = useLocation();
  const { colorMode, toggleColorMode } = useColorMode();

  const headerBg = useColorModeValue('blue.600', 'blue.700');
  const pageBg = useColorModeValue('gray.50', 'gray.900');
  const sidebarBg = useColorModeValue('white', 'gray.800');

  const { currentLang, setCurrentLang } = useLanguage();

  const menuItems = [
    { key: 'home', icon: <FiHome />, path: '/' },
    { key: 'about', icon: <FiInfo />, path: '/about' },
    { key: 'dashboard', icon: <FiGrid />, path: '/dashboard' },
    { key: 'profile', icon: <FiUser />, path: '/profile' },
  ];

  // Select (v3) expects a collection + string[] value
  const langCollection = createListCollection({
    items: languages.map((l) => ({ label: l.label, value: l.code })),
  });

  const drawerContent = (
    <VStack align="stretch" gap={1}>
      <Box px={2} py={3}>
        <Text fontWeight="bold" color="blue.500">
          PolyFront
        </Text>
        <Text fontSize="xs" color="gray">
          Multi-Frontend Scaffold
        </Text>
      </Box>
      <Separator />
      {menuItems.map((item) => (
        <NavItem
          key={item.key}
          icon={item.icon}
          label={i18n.t(\`common.\${item.key}\`, currentLang)}
          active={location.pathname === item.path}
          onClick={() => {
            navigate(item.path);
            onClose();
          }}
        />
      ))}
    </VStack>
  );

  return (
    <Flex minH="100vh" bg={pageBg}>
      {/* Header */}
      <Box
        as="header"
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        bg={headerBg}
        color="white"
        boxShadow="sm"
      >
        <Flex h={14} align="center" px={{ base: 3, md: 4 }}>
          <IconButton
            aria-label="Open menu"
            variant="ghost"
            color="white"
            display={{ base: 'inline-flex', md: 'none' }}
            onClick={onOpen}
            mr={2}
          >
            <FiMenu />
          </IconButton>

          <Text fontWeight="bold">PolyFront</Text>
          <Box flex="1" />

          <HStack gap={2}>
            <Badge>v0.0.29</Badge>

            {/* Language Select (v3 controlled) */}
            <Select.Root
              size="sm"
              width="160px"
              collection={langCollection}
              value={[currentLang]}
              onValueChange={(e) => setCurrentLang(e.value[0] ?? currentLang)}
            >
              <Select.HiddenSelect />
              <Select.Control
                bg="transparent"
                borderColor="whiteAlpha.700"
                color="white"
                _focusVisible={{ borderColor: 'white' }}
              >
                <Select.Trigger>
                  <Select.ValueText placeholder="Language" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>

              <Portal>
                <Select.Positioner>
                  <Select.Content>
                    {langCollection.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>

            <IconButton aria-label="Notifications" variant="ghost" color="white">
              <FiBell />
            </IconButton>

            {/* Account menu (v3) */}
            <Menu.Root positioning={{ placement: 'bottom-end' }}>
              <Menu.Trigger asChild>
                <Button variant="ghost" color="white">
                  <HStack gap={2}>
                    <Avatar.Root size="sm">
                      <Avatar.Fallback>U</Avatar.Fallback>
                    </Avatar.Root>
                    <Text display={{ base: 'none', md: 'inline' }}>Account</Text>
                    <FiChevronDown />
                  </HStack>
                </Button>
              </Menu.Trigger>
              <Menu.Positioner>
                <Menu.Content>
                  <Menu.Item value="profile">Profile</Menu.Item>
                  <Menu.Item value="settings">Settings</Menu.Item>
                  <Menu.Item value="logout">Logout</Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Menu.Root>

            <IconButton aria-label="Toggle color mode" onClick={toggleColorMode} variant="ghost" color="white">
              {colorMode === 'light' ? <FiMoon /> : <FiSun />}
            </IconButton>
          </HStack>
        </Flex>
      </Box>

      {/* Sidebar (desktop) */}
      <Box
        as="nav"
        display={{ base: 'none', md: 'block' }}
        w={sidebarWidth}
        pt={16}
        px={3}
        position="fixed"
        h="100vh"
        overflowY="auto"
        borderRightWidth="1px"
        bg={sidebarBg}
      >
        {drawerContent}
      </Box>

      {/* Drawer (mobile, v3) */}
      <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)} placement="start">
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.CloseTrigger />
            <Drawer.Header>PolyFront</Drawer.Header>
            <Drawer.Body>{drawerContent}</Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>

      {/* Main */}
      <Box flex="1" pl={{ base: 0, md: sidebarWidth }} pt={16} w="full">
        <Container maxW="6xl" py={6}>
          <Outlet />
        </Container>
      </Box>
    </Flex>
  );
}

export default Layout;
`);

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
