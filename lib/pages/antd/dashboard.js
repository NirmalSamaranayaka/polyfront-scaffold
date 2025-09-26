function dashboardSource(useTS) {
  return `import React, { useState } from 'react';
  import {
    Typography,
    Row,
    Col,
    Card,
    Avatar,
    Table,
    Tag,
    List,
    theme,
    Button,
  } from 'antd';
  import {
    UserOutlined,
    DollarOutlined,
    ShoppingCartOutlined,
    EyeOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    CheckCircleTwoTone,
    ExclamationCircleTwoTone,
    CloseCircleTwoTone,
  } from '@ant-design/icons';
  
  export default function Dashboard() {
    const { token } = theme.useToken();
  
    const [stats] = useState({
      users: 1234,
      revenue: 45678,
      orders: 89,
      views: 12345,
    });
  
    const [recentActivity] = useState([
      { id: 1, user: 'Nirmal Samaranayaka', action: 'Order placed', time: '2 min ago', status: 'success' },
      { id: 2, user: 'Jane Smith', action: 'Payment received', time: '5 min ago', status: 'success' },
      { id: 3, user: 'Bob Johnson', action: 'Login attempt', time: '10 min ago', status: 'warning' },
      { id: 4, user: 'Alice Brown', action: 'Account created', time: '15 min ago', status: 'success' },
    ]);
  
    const [topProducts] = useState([
      { key: '1', name: 'Premium Widget', sales: 156, revenue: 2340, growth: 12 },
      { key: '2', name: 'Super Gadget', sales: 98, revenue: 1890, growth: -5 },
      { key: '3', name: 'Mega Tool', sales: 87, revenue: 1450, growth: 8 },
      { key: '4', name: 'Ultra Device', sales: 76, revenue: 1230, growth: 15 },
    ]);
  
    const growthTag = (g ${useTS?': number':''}) => (
      <Tag color={g >= 0 ? 'success' : 'error'}>
        {g >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {g}%
      </Tag>
    );
  
    const columns = [
      { title: 'Product', dataIndex: 'name' },
      { title: 'Sales', dataIndex: 'sales', align: 'right' ${useTS?' as const':''} },
      { title: 'Revenue', dataIndex: 'revenue', align: 'right' ${useTS?' as const':''}, render: (v ${useTS?': number':''}) => \`$\${v.toLocaleString()}\` },
      { title: 'Growth', dataIndex: 'growth', align: 'right'${useTS?' as const':''} , render: (g${useTS?': number':''}) => growthTag(g) },
    ];
  
    const StatCard ${useTS?': React.FC<{ title: string; value: React.ReactNode; sub: string; avatarBg: string; icon: React.ReactNode }>':''} 
      = ({ title, value, sub, avatarBg, icon }) => (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <Typography.Text type="secondary">{title}</Typography.Text>
              <Typography.Title level={3} style={{ margin: 0 }}>{value}</Typography.Title>
              <Typography.Text style={{ color: token.colorSuccess }}>
                <ArrowUpOutlined style={{ marginRight: 6 }} />{sub}
              </Typography.Text>
            </div>
            <Avatar size={56} style={{ background: avatarBg, color: '#fff' }}>
              {icon}
            </Avatar>
          </div>
        </Card>
      );
  
    const statusIcon = (status${useTS?': string':''}) => {
      switch (status) {
        case 'success':
          return <CheckCircleTwoTone twoToneColor="#52c41a" />;
        case 'warning':
          return <ExclamationCircleTwoTone twoToneColor="#faad14" />;
        case 'error':
          return <CloseCircleTwoTone twoToneColor="#ff4d4f" />;
        default:
          return <CheckCircleTwoTone twoToneColor="#52c41a" />;
      }
    };
  
    return (
      <div>
        <Typography.Title level={1} style={{ color: token.colorPrimary, fontWeight: 800 }}>Dashboard</Typography.Title>
        <Typography.Paragraph type="secondary">
          Welcome back! Here's what's happening with your application today.
        </Typography.Paragraph>
  
        {/* Stats */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <StatCard title="Total Users" value={stats.users.toLocaleString()} sub="+12% from last month" avatarBg={token.colorPrimary} icon={<UserOutlined />} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatCard title="Revenue" value={\`$\${stats.revenue.toLocaleString()}\`} sub="+8% from last month" avatarBg={token.colorSuccess} icon={<DollarOutlined />} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatCard title="Orders" value={stats.orders} sub="+15% from last month" avatarBg={token.colorWarning} icon={<ShoppingCartOutlined />} />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatCard title="Page Views" value={stats.views.toLocaleString()} sub="+22% from last month" avatarBg={token.colorInfo} icon={<EyeOutlined />} />
          </Col>
        </Row>
  
        <Row gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Card title="Top Products" extra={<Button type="link">View All</Button>}>
              <Table columns={columns} dataSource={topProducts} pagination={false} />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card title="Recent Activity">
              <List
                dataSource={recentActivity}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar style={{ background: '#f5f5f5' }}>{statusIcon(item.status)}</Avatar>}
                      title={item.action}
                      description={<span><strong>{item.user}</strong> — {item.time}</span>}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }`;
  }
 module.exports = { dashboardSource };
