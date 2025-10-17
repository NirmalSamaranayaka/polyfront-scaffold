function source(useTS) {
  return `import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu as AntMenu, Drawer, Button, Typography, Select, Tag, Badge, Dropdown, Grid } from 'antd';
import { MenuOutlined, HomeOutlined, InfoCircleOutlined, DashboardOutlined, UserOutlined, BellOutlined } from '@ant-design/icons';
${useTS?'import type { MenuProps } from \'antd\';':''} 
import i18n from '../i18n';
import { useLanguage } from '../hooks/useLanguage';
import { languages } from '../utils/common';
const { Header, Sider, Content } = AntLayout;
const Layout = () => {
const [mobileOpen, setMobileOpen] = useState(false);
const navigate = useNavigate();
const location = useLocation();
const screens = Grid.useBreakpoint();
const { currentLang, setCurrentLang } = useLanguage();
const menuItems = [
{ key: '/', icon: <HomeOutlined />, label: i18n.t('common.home', currentLang) },
{ key: '/about', icon: <InfoCircleOutlined />, label: i18n.t('common.about', currentLang) },
{ key: '/dashboard', icon: <DashboardOutlined />, label: i18n.t('common.dashboard', currentLang) },
{ key: '/profile', icon: <UserOutlined />, label: i18n.t('common.profile', currentLang) },
];
const profileMenu = {
items: [
{ key: 'profile', label: 'Profile' },
{ key: 'settings', label: 'Settings' },
{ type: 'divider' },
{ key: 'logout', label: 'Logout' },
] ${useTS?'as MenuProps[\'items\'],':''} 
};
const handleLanguageChange = (value ${useTS ? ': string' : ''}) => {
setCurrentLang(value);
};
const Sidebar = (
<div style={{ width: 250 }}>
<div style={{ padding: 16, borderBottom: '1px solid #f0f0f0' }}>
<Typography.Title level={5} style={{ margin: 0, color: 'var(--ant-color-primary)' }}>PolyFront</Typography.Title>
<Typography.Text type="secondary">Multi-Frontend Scaffold</Typography.Text>
</div>
<AntMenu
mode="inline"
selectedKeys={[location.pathname]}
onClick={({ key }) => { navigate(key); if (!screens.md) setMobileOpen(false); }}
items={menuItems}
style={{ borderRight: 0 }}
/>
</div>
);
  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          position: "fixed",
          insetInlineStart: 0,
          insetInlineEnd: 0,
          zIndex: 1000,
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {!screens.md && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          />
        )}
        <Typography.Title
          level={4}
          style={{ color: "white", margin: 0, flex: 1 }}
        >
          PolyFront
        </Typography.Title>
        <Tag bordered={false}>v1.0.45</Tag>
        <Select
          size="small"
          value={currentLang}
          onChange={handleLanguageChange}
          options={languages.map((l) => ({ value: l.code, label: l.label }))}
          style={{ width: 120 }}
        />
        <Badge dot>
          <Button
            type="text"
            icon={<BellOutlined />}
            aria-label="Notifications"
          />
        </Badge>
        <Dropdown menu={profileMenu} trigger={["click"]}>
          <Button type="text" icon={<UserOutlined />} aria-label="Account" />
        </Dropdown>
      </Header>
      <AntLayout>
        {screens.md ? (
          <Sider
            width={250}
            style={{
              marginTop: 64,
              background: "var(--ant-layout-sider-background)",
            }}
          >
            {Sidebar}
          </Sider>
        ) : (
          <Drawer
            open={mobileOpen}
            onClose={() => setMobileOpen(false)}
            width={250}
            bodyStyle={{ padding: 0 }}
          >
            {Sidebar}
          </Drawer>
        )}
        <AntLayout style={{ marginTop: 64 }}>
          <Content style={{ padding: 24 }}>
            <Outlet />
          </Content>
        </AntLayout>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;`;
}

module.exports = { source };