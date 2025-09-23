function aboutSource() {
  return `import React from 'react';
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
`;
  }
 module.exports = { aboutSource };