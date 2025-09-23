function homeSource() {
  return `import { Box, Typography, Grid, Card, CardContent, Button, Avatar, Container, Paper } from '@mui/material';
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
`;
  }
 module.exports = { homeSource };