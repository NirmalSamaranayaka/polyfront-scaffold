function aboutSource() {
  return `import { Box, Text, Container, Card, Heading, SimpleGrid, Tag, List, Separator, Icon, HStack } from '@chakra-ui/react';
  import { FiCheckCircle, FiStar, FiZap, FiUsers } from 'react-icons/fi';
  
  export default function About() {
    const techStack = [
      { name: 'React 19', version: 'Latest', category: 'Framework' },
      { name: 'TypeScript', version: '5.x', category: 'Language' },
      { name: 'Vite', version: '7.x', category: 'Build Tool' },
      { name: 'Chakra UI', version: '3.x', category: 'UI Library' },
      { name: 'React Router', version: '7.x', category: 'Routing' },
      { name: 'Zustand', version: '5.x', category: 'State Management' },
      { name: 'Axios', version: '1.x', category: 'HTTP Client' },
      { name: 'Vitest', version: '3.x', category: 'Testing' },
    ];
  
    const features = [
      'Modern React with hooks and functional components',
      'Full TypeScript support with strict mode',
      'Accessible, themable Chakra UI components',
      'Client-side routing with React Router',
      'State management with Zustand',
      'API integration with Axios',
      'Comprehensive testing setup with Vitest',
      'ESLint and Prettier for code quality',
      'Hot module replacement for fast development',
      'Responsive design with mobile-first approach',
    ];
  
    return (
      <Container maxW="6xl" py={6}>
        <Box textAlign="center" mb={8}>
          <Heading as="h1" size="2xl" color="blue.500" mb={2}>
            About PolyFront
          </Heading>
          <Text fontSize="xl" color="gray.500">
            A comprehensive scaffold for modern web applications
          </Text>
        </Box>
  
        <SimpleGrid columns={{ base: 1, md: 2 }} gap={5} mb={8}>
          <Card.Root>
            <Card.Header>
              <Heading size="md" color="blue.500">
                Technology Stack
              </Heading>
            </Card.Header>
            <Card.Body>
              <SimpleGrid columns={{ base: 2, sm: 3 }} gap={3}>
                {techStack.map((t, i) => (
                  <Box key={i}>
                    <Tag.Root colorPalette="blue" variant="subtle" mb={1}>
                      {t.name} {t.version}
                    </Tag.Root>
                    <Text fontSize="xs" color="gray.500">
                      {t.category}
                    </Text>
                  </Box>
                ))}
              </SimpleGrid>
            </Card.Body>
          </Card.Root>
  
          <Card.Root>
            <Card.Header>
              <Heading size="md" color="blue.500">
                Key Features
              </Heading>
            </Card.Header>
            <Card.Body>
              <List.Root>
                {features.map((f, i) => (
                  <List.Item key={i}>
                    <HStack gap={2} align="start">
                      <Icon as={FiCheckCircle} color="green.400" mt={1} />
                      <Text>{f}</Text>
                    </HStack>
                  </List.Item>
                ))}
              </List.Root>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>
  
        <Card.Root>
          <Card.Body textAlign="center">
            <SimpleGrid columns={{ base: 1, sm: 3 }} gap={6}>
              <Box>
                <Icon as={FiStar} boxSize={10} color="blue.500" mb={1} />
                <Heading size="sm" mb={1}>
                  Production Ready
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  Built with best practices and industry standards
                </Text>
              </Box>
              <Box>
                <Icon as={FiZap} boxSize={10} color="blue.500" mb={1} />
                <Heading size="sm" mb={1}>
                  Fast Development
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  Hot reload and instant feedback for rapid iteration
                </Text>
              </Box>
              <Box>
                <Icon as={FiUsers} boxSize={10} color="blue.500" mb={1} />
                <Heading size="sm" mb={1}>
                  Team Friendly
                </Heading>
                <Text fontSize="sm" color="gray.500">
                  Consistent code style and comprehensive tooling
                </Text>
              </Box>
            </SimpleGrid>
          </Card.Body>
        </Card.Root>
  
        <Separator mt={8} />
      </Container>
    );
  }`;
  }
 module.exports = { aboutSource };