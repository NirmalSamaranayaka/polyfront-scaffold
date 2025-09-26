function aboutSource() {
  return `import { Typography, Row, Col, Card, List, Divider, Tag } from 'antd';
  import { CheckCircleTwoTone, StarFilled, ThunderboltOutlined, TeamOutlined } from '@ant-design/icons';
  
  export default function About() {
    const techStack = [
      { name: 'React 19', version: 'Latest', category: 'Framework' },
      { name: 'TypeScript', version: '5.x', category: 'Language' },
      { name: 'Vite', version: '7.x', category: 'Build Tool' },
      { name: 'Ant Design', version: '5.x', category: 'UI Library' },
      { name: 'React Router', version: '7.x', category: 'Routing' },
      { name: 'Zustand', version: '5.x', category: 'State Management' },
      { name: 'Axios', version: '1.x', category: 'HTTP Client' },
      { name: 'Vitest', version: '3.x', category: 'Testing' }
    ];
  
    const features = [
      'Modern React with hooks and functional components',
      'Full TypeScript support with strict mode',
      'Beautiful Ant Design components with theming',
      'Client-side routing with React Router',
      'State management with Zustand',
      'API integration with Axios',
      'Comprehensive testing setup with Vitest',
      'ESLint and Prettier for code quality',
      'Hot module replacement for fast development',
      'Responsive design with mobile-first approach'
    ];
  
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Typography.Title level={1} style={{ fontWeight: 800 }}>
            About PolyFront
          </Typography.Title>
          <Typography.Paragraph type="secondary">
            A comprehensive scaffold for modern web applications
          </Typography.Paragraph>
        </div>
  
        <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
          <Col xs={24} md={12}>
            <Card title={<Typography.Title level={3} style={{ margin: 0 }}>Technology Stack</Typography.Title>}>
              <Typography.Paragraph>
                Built with the latest and greatest technologies in the React ecosystem.
              </Typography.Paragraph>
              <Row gutter={[12, 12]}>
                {techStack.map((tech, idx) => (
                  <Col xs={12} key={idx}>
                    <Tag style={{ marginBottom: 4 }}>
                      {\`\${tech.name} \${tech.version}\`}
                    </Tag>
                    <div style={{ color: '#999', fontSize: 12 }}>{tech.category}</div>
                  </Col>
                ))}
              </Row>
            </Card>
          </Col>
  
          <Col xs={24} md={12}>
            <Card title={<Typography.Title level={3} style={{ margin: 0 }}>Key Features</Typography.Title>}>
              <List
                itemLayout="horizontal"
                dataSource={features}
                renderItem={(text, index) => (
                  <>
                    <List.Item>
                      <List.Item.Meta
                        avatar={<CheckCircleTwoTone twoToneColor="#52c41a" />}
                        title={<span>{text}</span>}
                      />
                    </List.Item>
                    {index < features.length - 1 && <Divider style={{ margin: 0 }} />}
                  </>
                )}
              />
            </Card>
          </Col>
        </Row>
  
        <Card>
          <Row gutter={[24, 24]} align="middle" justify="center">
            <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
              <StarFilled style={{ fontSize: 40, color: '#1677ff', marginBottom: 8 }} />
              <Typography.Title level={4}>Production Ready</Typography.Title>
              <Typography.Paragraph type="secondary">Built with best practices and industry standards</Typography.Paragraph>
            </Col>
            <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
              <ThunderboltOutlined style={{ fontSize: 40, color: '#1677ff', marginBottom: 8 }} />
              <Typography.Title level={4}>Fast Development</Typography.Title>
              <Typography.Paragraph type="secondary">Hot reload and instant feedback for rapid iteration</Typography.Paragraph>
            </Col>
            <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
              <TeamOutlined style={{ fontSize: 40, color: '#1677ff', marginBottom: 8 }} />
              <Typography.Title level={4}>Team Friendly</Typography.Title>
              <Typography.Paragraph type="secondary">Consistent code style and comprehensive tooling</Typography.Paragraph>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }`;
  }
 module.exports = { aboutSource };