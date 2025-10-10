function source(useTS) {
  return `import React, { useState } from 'react';
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
            <Chip label="v0.0.42" size="small" variant="outlined" />
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

export default Layout;`;
}

module.exports = { source };