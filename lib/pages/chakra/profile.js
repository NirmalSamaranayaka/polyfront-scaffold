function profileSource(useTS) {
  return `import { useState } from 'react';
  import {
    Box,
    Heading,
    Text,
    SimpleGrid,
    Card,
    Avatar,
    Button,
    Field,
    Input,
    Textarea,
    Tag,
    HStack,
    Icon,
    VStack,
    Switch,
  } from '@chakra-ui/react';
  import { FiEdit, FiSave, FiX, FiBell, FiShield, FiMoon } from 'react-icons/fi';
  
  export default function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [settings, setSettings] = useState({
      emailNotifications: true,
      pushNotifications: false,
      darkMode: false,
      twoFactorAuth: true,
    });
  
    const profile = {
      name: 'Nirmal Samaranayaka',
      email: 'nirmal.fullstack@gmail.com',
      phone: '+46 (72) xxx-xxxx',
      location: 'Stockholm, Sweden',
      company: 'Scania AB.',
      position: 'Senior Fullstack Developer',
      education: 'Computer Science, University of Colombo',
      website: 'https://dev.to/nirmalsamaranayaka',
      bio: 'Experienced Full Stack Engineer & Tech Lead | Specialized in .NET, React, Angular, and scalable cloud-native solutions.',
    };
  
    const skills = [
      'React', 'Redux', 'MobX', 'React Query', 'Angular', 'Micro Frontends', 'TypeScript', 'JavaScript',
      'HTML/CSS', 'MUI', 'Tailwind', '.NET', 'C#', 'Azure', 'Docker', 'Kubernetes',
    ];
  
    return (
      <Box>
        <HStack justify="space-between" mb={4}>
          <Heading as="h1" size="2xl" color="blue.500">
            Profile
          </Heading>
  
          {isEditing ? (
            <HStack gap={3}>
              <Button colorPalette="blue" onClick={() => setIsEditing(false)}>
                <HStack gap={2}>
                  <FiSave />
                  <span>Save</span>
                </HStack>
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <HStack gap={2}>
                  <FiX />
                  <span>Cancel</span>
                </HStack>
              </Button>
            </HStack>
          ) : (
            <Button colorPalette="blue" onClick={() => setIsEditing(true)}>
              <HStack gap={2}>
                <FiEdit />
                <span>Edit Profile</span>
              </HStack>
            </Button>
          )}
        </HStack>
  
        <SimpleGrid columns={{ base: 1 }} gap={4}>
          <Card.Root>
            <Card.Body>
              <HStack align="start" gap={6}>
                <Avatar.Root size="2xl">
                  <Avatar.Fallback>
                    {profile.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </Avatar.Fallback>
                </Avatar.Root>
  
                <Box flex="1">
                  <Heading size="lg" mb={1}>{profile.name}</Heading>
                  <Text color="gray.600" mb={3}>
                    {profile.position} at {profile.company}
                  </Text>
                  <Text color="gray.600" mb={3}>{profile.bio}</Text>
  
                  <HStack gap={2} flexWrap="wrap">
                    {skills.map((s) => (
                      <Tag.Root key={s} variant="outline" colorPalette="blue">
                        {s}
                      </Tag.Root>
                    ))}
                  </HStack>
                </Box>
              </HStack>
            </Card.Body>
          </Card.Root>
  
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
            <Card.Root gridColumn={{ base: 'span 1', md: 'span 2' }}>
              <Card.Header>
                <Heading size="md">Personal Information</Heading>
              </Card.Header>
              <Card.Body>
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={4}>
                  <Field.Root>
                    <Field.Label>Full Name</Field.Label>
                    <Input value={profile.name} disabled={!isEditing} />
                  </Field.Root>
  
                  <Field.Root>
                    <Field.Label>Email</Field.Label>
                    <Input value={profile.email} disabled={!isEditing} />
                  </Field.Root>
  
                  <Field.Root>
                    <Field.Label>Phone</Field.Label>
                    <Input value={profile.phone} disabled={!isEditing} />
                  </Field.Root>
  
                  <Field.Root>
                    <Field.Label>Location</Field.Label>
                    <Input value={profile.location} disabled={!isEditing} />
                  </Field.Root>
  
                  <Field.Root>
                    <Field.Label>Company</Field.Label>
                    <Input value={profile.company} disabled={!isEditing} />
                  </Field.Root>
  
                  <Field.Root>
                    <Field.Label>Position</Field.Label>
                    <Input value={profile.position} disabled={!isEditing} />
                  </Field.Root>
  
                  <Field.Root gridColumn={{ base: 'span 1', sm: 'span 2' }}>
                    <Field.Label>Bio</Field.Label>
                    <Textarea value={profile.bio} disabled={!isEditing} rows={3} />
                  </Field.Root>
                </SimpleGrid>
              </Card.Body>
            </Card.Root>
  
            <Card.Root>
              <Card.Header>
                <Heading size="md">Settings</Heading>
              </Card.Header>
              <Card.Body>
                <VStack align="stretch" gap={4}>
                  <HStack justify="space-between">
                    <HStack gap={2}>
                      <Icon as={FiBell} />
                      <Text>Email Notifications</Text>
                    </HStack>
                    <Switch.Root
                      checked={settings.emailNotifications}
                      onCheckedChange={(e) =>
                        setSettings((s) => ({ ...s, emailNotifications: e.checked }))
                      }
                    >
                      {/* hide the built-in checkbox to avoid double rendering */}
                      <Switch.HiddenInput style={{ display: 'none' }} />
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch.Root>
                  </HStack>
  
                  <HStack justify="space-between">
                    <HStack gap={2}>
                      <Icon as={FiBell} />
                      <Text>Push Notifications</Text>
                    </HStack>
                    <Switch.Root
                      checked={settings.pushNotifications}
                      onCheckedChange={(e) =>
                        setSettings((s) => ({ ...s, pushNotifications: e.checked }))
                      }
                    >
                      <Switch.HiddenInput style={{ display: 'none' }} />
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch.Root>
                  </HStack>
  
                  <HStack justify="space-between">
                    <HStack gap={2}>
                      <Icon as={FiMoon} />
                      <Text>Dark Mode</Text>
                    </HStack>
                    <Switch.Root
                      checked={settings.darkMode}
                      onCheckedChange={(e) =>
                        setSettings((s) => ({ ...s, darkMode: e.checked }))
                      }
                    >
                      <Switch.HiddenInput style={{ display: 'none' }} />
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch.Root>
                  </HStack>
  
                  <HStack justify="space-between">
                    <HStack gap={2}>
                      <Icon as={FiShield} />
                      <Text>Two-Factor Auth</Text>
                    </HStack>
                    <Switch.Root
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(e) =>
                        setSettings((s) => ({ ...s, twoFactorAuth: e.checked }))
                      }
                    >
                      <Switch.HiddenInput style={{ display: 'none' }} />
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch.Root>
                  </HStack>
                </VStack>
              </Card.Body>
            </Card.Root>
          </SimpleGrid>
        </SimpleGrid>
      </Box>
    );
  }`;
  }
 module.exports = { profileSource };