function homeSource() {
  return `import { Box, Text, SimpleGrid, Container, Card, Heading, Avatar, Button, Stack } from '@chakra-ui/react';
  import { FiTrendingUp, FiUsers, FiZap, FiShield, FiCode, FiFeather } from 'react-icons/fi';
  
  
  export default function Home() {
    const features = [
      { icon: <FiTrendingUp />, title: 'Performance', description: 'Lightning-fast builds with modern tooling' },
      { icon: <FiUsers />, title: 'Team Ready', description: 'Built for collaboration and scalability' },
      { icon: <FiZap />, title: 'Fast Development', description: 'Hot reload and instant feedback' },
      { icon: <FiShield />, title: 'Type Safe', description: 'Full TypeScript support with strict mode' },
      { icon: <FiCode />, title: 'Clean Code', description: 'ESLint + Prettier for code quality' },
      { icon: <FiFeather />, title: 'Beautiful UI', description: 'Chakra UI components with theming' },
    ];
  
    return (
      <Container maxW="6xl" py={6}>
        <Box textAlign="center" mb={8}>
          <Heading as="h1" size="2xl" color="blue.500" mb={2}>
            Welcome to PolyFront
          </Heading>
          <Text fontSize="xl" color="gray.500">
            Your comprehensive multi-frontend scaffold with everything you need
          </Text>
          <Text maxW="3xl" mx="auto" mt={3} color="gray.500">
            Built with React, TypeScript, Vite, Chakra UI, and modern development practices.
            Start building your next great application today.
          </Text>
        </Box>
  
        {/* spacing -> gap in v3 */}
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={5} mb={10}>
          {features.map((feature, i) => (
            <Card.Root
              key={i}
              transition="all 0.2s"
              _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
            >
              <Card.Body textAlign="center">
                {/* v3 Avatar parts */}
                <Avatar.Root size="xl" mb={3} bg="blue.500" color="white">
                  <Avatar.Fallback>
                    <Box fontSize="28px" lineHeight="1">
                      {feature.icon}
                    </Box>
                  </Avatar.Fallback>
                </Avatar.Root>
  
                <Heading as="h3" size="md" mb={1}>
                  {feature.title}
                </Heading>
                <Text color="gray.500">{feature.description}</Text>
              </Card.Body>
            </Card.Root>
          ))}
        </SimpleGrid>
  
        <Card.Root>
          <Card.Body textAlign="center">
            <Heading size="lg" mb={2}>
              Ready to Get Started?
            </Heading>
            <Text color="gray.500" mb={4}>
              This scaffold includes routing, state management, API integration, testing, and much more.
              Explore the different pages to see all the features in action.
            </Text>
  
            {/* spacing -> gap in v3 */}
            <Stack direction={{ base: 'column', sm: 'row' }} gap={3} justify="center">
              {/* In v3 prefer colorPalette; colorScheme also works if you’ve enabled it */}
              <Button colorPalette="blue" size="lg">
                View Documentation
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Stack>
          </Card.Body>
        </Card.Root>
      </Container>
    );
  }`;
  }
 module.exports = { homeSource };