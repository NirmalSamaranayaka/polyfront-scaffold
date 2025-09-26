function dashboardSource(useTS) {
  return `import {
        Box,
        Heading,
        Text,
        SimpleGrid,
        Card,
        Avatar,
        HStack,
        VStack,
        Badge,
        Table,
        Icon,
      } from '@chakra-ui/react';
      import { FiTrendingUp, FiUsers, FiShoppingCart, FiEye, FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi';
      
      export default function Dashboard() {
        const stats = { users: 1234, revenue: 45678, orders: 89, views: 12345 };
      
        const recentActivity = [
          { id: 1, user: 'Nirmal Samaranayaka', action: 'Order placed', time: '2 min ago', status: 'success'  ${useTS?' as const':''} },
          { id: 2, user: 'Jane Smith', action: 'Payment received', time: '5 min ago', status: 'success'  ${useTS?' as const':''} },
          { id: 3, user: 'Bob Johnson', action: 'Login attempt', time: '10 min ago', status: 'warning'  ${useTS?' as const':''} },
          { id: 4, user: 'Alice Brown', action: 'Account created', time: '15 min ago', status: 'success'  ${useTS?' as const':''} },
        ];
      
        const topProducts = [
          { name: 'Premium Widget', sales: 156, revenue: 2340, growth: 12 },
          { name: 'Super Gadget', sales: 98, revenue: 1890, growth: -5 },
          { name: 'Mega Tool', sales: 87, revenue: 1450, growth: 8 },
          { name: 'Ultra Device', sales: 76, revenue: 1230, growth: 15 },
        ];
      
        function StatusIcon({ status }${useTS? `: { status: 'success' | 'warning' | 'error' }`:''}) {
          if (status === 'success') return <Icon as={FiCheckCircle} color="green.400" />;
          if (status === 'warning') return <Icon as={FiAlertTriangle} color="yellow.400" />;
          return <Icon as={FiXCircle} color="red.400" />;
        }
      
        return (
          <Box>
            <Heading as="h1" size="2xl" color="blue.500" mb={2}>
              Dashboard
            </Heading>
            <Text color="gray.500" mb={6}>
              Welcome back! Here's what's happening with your application today.
            </Text>
      
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} gap={4} mb={6}>
              <Card.Root>
                <Card.Body>
                  <HStack justify="space-between">
                    <Box>
                      <Text fontSize="sm" color="gray.500">Total Users</Text>
                      <Heading size="lg">{stats.users.toLocaleString()}</Heading>
                      <HStack color="green.500" fontSize="sm" gap={1}>
                        <Icon as={FiTrendingUp} />
                        <Text>+12% from last month</Text>
                      </HStack>
                    </Box>
                    <Avatar.Root>
                      <Avatar.Fallback>
                        <Icon as={FiUsers} />
                      </Avatar.Fallback>
                    </Avatar.Root>
                  </HStack>
                </Card.Body>
              </Card.Root>
      
              <Card.Root>
                <Card.Body>
                  <HStack justify="space-between">
                    <Box>
                      <Text fontSize="sm" color="gray.500">Revenue</Text>
                      <Heading size="lg">{stats.revenue.toLocaleString()}</Heading>
                      <HStack color="green.500" fontSize="sm" gap={1}>
                        <Icon as={FiTrendingUp} />
                        <Text>+8% from last month</Text>
                      </HStack>
                    </Box>
                    <Avatar.Root>
                      <Avatar.Fallback>💰</Avatar.Fallback>
                    </Avatar.Root>
                  </HStack>
                </Card.Body>
              </Card.Root>
      
              <Card.Root>
                <Card.Body>
                  <HStack justify="space-between">
                    <Box>
                      <Text fontSize="sm" color="gray.500">Orders</Text>
                      <Heading size="lg">{stats.orders}</Heading>
                      <HStack color="green.500" fontSize="sm" gap={1}>
                        <Icon as={FiTrendingUp} />
                        <Text>+15% from last month</Text>
                      </HStack>
                    </Box>
                    <Avatar.Root>
                      <Avatar.Fallback>
                        <Icon as={FiShoppingCart} />
                      </Avatar.Fallback>
                    </Avatar.Root>
                  </HStack>
                </Card.Body>
              </Card.Root>
      
              <Card.Root>
                <Card.Body>
                  <HStack justify="space-between">
                    <Box>
                      <Text fontSize="sm" color="gray.500">Page Views</Text>
                      <Heading size="lg">{stats.views.toLocaleString()}</Heading>
                      <HStack color="green.500" fontSize="sm" gap={1}>
                        <Icon as={FiTrendingUp} />
                        <Text>+22% from last month</Text>
                      </HStack>
                    </Box>
                    <Avatar.Root>
                      <Avatar.Fallback>
                        <Icon as={FiEye} />
                      </Avatar.Fallback>
                    </Avatar.Root>
                  </HStack>
                </Card.Body>
              </Card.Root>
            </SimpleGrid>
      
            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
              <Card.Root gridColumn={{ base: 'span 1', md: 'span 2' }}>
                <Card.Header>
                  <Heading size="md">Top Products</Heading>
                </Card.Header>
                <Card.Body>
                  <Table.Root size="sm">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader>Product</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="end">Sales</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="end">Revenue</Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="end">Growth</Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {topProducts.map((p) => (
                        <Table.Row key={p.name}>
                          <Table.Cell>{p.name}</Table.Cell>
                          <Table.Cell textAlign="end">{p.sales}</Table.Cell>
                          <Table.Cell textAlign="end">{p.revenue.toLocaleString()}</Table.Cell>
                          <Table.Cell textAlign="end">
                            <Badge colorPalette={p.growth >= 0 ? 'green' : 'red'}>
                              {p.growth >= 0 ? '+' : ''}
                              {p.growth}%
                            </Badge>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                </Card.Body>
              </Card.Root>
      
              <Card.Root>
                <Card.Header>
                  <Heading size="md">Recent Activity</Heading>
                </Card.Header>
                <Card.Body>
                  <VStack align="stretch" gap={3}>
                    {recentActivity.map((a) => (
                      <HStack key={a.id} align="start" gap={3}>
                        <Avatar.Root>
                          <Avatar.Fallback>
                            <StatusIcon status={a.status} />
                          </Avatar.Fallback>
                        </Avatar.Root>
                        <Box>
                          <Text fontWeight="medium">{a.action}</Text>
                          <Text fontSize="sm" color="gray.500">
                            {a.user} — {a.time}
                          </Text>
                        </Box>
                      </HStack>
                    ))}
                  </VStack>
                </Card.Body>
              </Card.Root>
            </SimpleGrid>
          </Box>
        );
      }`;
  }
 module.exports = { dashboardSource };
