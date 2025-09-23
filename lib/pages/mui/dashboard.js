function dashboardSource(useTS) {
  return `import React,{ useState } from 'react';
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
}`;
  }
 module.exports = { dashboardSource };

  