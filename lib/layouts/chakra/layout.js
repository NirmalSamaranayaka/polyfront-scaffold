function source(useTS) {
  return `import React from 'react';
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
              <Badge>v0.0.40</Badge>
  
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
  `;
}

module.exports = { source };