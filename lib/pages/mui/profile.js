function profileSource(useTS) {
  return `import { useState } from 'react';
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
}`;
  }
 module.exports = { profileSource };