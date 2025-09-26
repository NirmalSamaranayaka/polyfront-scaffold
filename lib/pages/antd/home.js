function homeSource(useTS) {
  return `import { Typography, Row, Col, Card, Button, Avatar, theme } from 'antd';
  import {
    RiseOutlined,
    TeamOutlined,
    ThunderboltOutlined,
    SafetyOutlined,
    CodeOutlined,
    BgColorsOutlined,
  } from '@ant-design/icons';
  
  const { Title, Paragraph, Text } = Typography;
  
  export default function Home() {
    const { token } = theme.useToken();
  
    const colorMap${useTS?': Record<string, string>':''} = {
      primary: token.colorPrimary,
      secondary: token.colorInfo,
      success: token.colorSuccess,
      warning: token.colorWarning,
      info: token.colorInfo,
      error: token.colorError,
    };
  
    const features = [
      { icon: <RiseOutlined />, title: 'Performance', description: 'Lightning-fast builds with modern tooling', color: 'primary' },
      { icon: <TeamOutlined />, title: 'Team Ready', description: 'Built for collaboration and scalability', color: 'secondary' },
      { icon: <ThunderboltOutlined />, title: 'Fast Development', description: 'Hot reload and instant feedback', color: 'success' },
      { icon: <SafetyOutlined />, title: 'Type Safe', description: 'Full TypeScript support with strict mode', color: 'warning' },
      { icon: <CodeOutlined />, title: 'Clean Code', description: 'ESLint + Prettier for code quality', color: 'info' },
      { icon: <BgColorsOutlined />, title: 'Beautiful UI', description: 'Ant Design components with theming', color: 'error' },
    ];
  
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Title level={1} style={{ color: token.colorPrimary, fontWeight: 800, marginBottom: 8 }}>
            Welcome to PolyFront
          </Title>
          <Title level={4} type="secondary" style={{ marginBottom: 12 }}>
            Your comprehensive multi-frontend scaffold with everything you need
          </Title>
          <Paragraph type="secondary" style={{ maxWidth: 600, margin: '0 auto' }}>
            Built with React, TypeScript, Vite, Ant Design, and modern development practices.
            Start building your next great application today.
          </Paragraph>
        </div>
  
        <Row gutter={[24, 24]} style={{ marginBottom: 48 }}>
          {features.map((feature, idx) => (
            <Col key={idx} xs={24} sm={12} md={8}>
              <Card
                hoverable
                style={{ height: '100%', transition: 'transform .2s' }}
                bodyStyle={{ textAlign: 'center' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <Avatar
                  size={64}
                  style={{
                    backgroundColor: colorMap[feature.color] ?? token.colorPrimary,
                    margin: '0 auto 12px',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {feature.icon}
                </Avatar>
                <Title level={5} style={{ marginBottom: 8 }}>{feature.title}</Title>
                <Text type="secondary">{feature.description}</Text>
              </Card>
            </Col>
          ))}
        </Row>
  
        <Card style={{ textAlign: 'center' }}>
          <Title level={2} style={{ marginBottom: 8 }}>Ready to Get Started?</Title>
          <Paragraph type="secondary" style={{ maxWidth: 760, margin: '0 auto 16px' }}>
            This scaffold includes routing, state management, API integration, testing, and much more.
            Explore the different pages to see all the features in action.
          </Paragraph>
          <div style={{ marginTop: 16 }}>
            <Button type="primary" size="large" style={{ marginRight: 12 }}>
              View Documentation
            </Button>
            <Button size="large">Learn More</Button>
          </div>
        </Card>
      </div>
    );
  }`;
  }
 module.exports = { homeSource };