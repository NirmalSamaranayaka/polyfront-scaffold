function profileSource(useTS) {
  return `import { useState } from 'react';
   import {
     Typography,
     Row,
     Col,
     Card,
     Avatar,
     Button,
     Tag,
     List,
     Switch,
     Form,
     Input,
   } from 'antd';
   import {
     EditOutlined,
     SaveOutlined,
     CloseOutlined,
     MailOutlined,
     PhoneOutlined,
     EnvironmentOutlined,
     BankOutlined,
     BellOutlined,
     SafetyOutlined,
     BgColorsOutlined,
     UserOutlined,
   } from '@ant-design/icons';
   
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
       'React', 'Redux', 'MobX', 'React Query', 'Angular', 'Micro Frontends',
       'TypeScript', 'JavaScript', 'HTML/CSS', 'jQuery',
       'MUI (Material-UI)', 'Kendo UI', 'Tailwind CSS', 'Tegel',
       '.NET 6/7/8', 'ASP.NET Core', 'C#', 'Web API', 'WCF',
       'Microservices', 'gRPC', 'REST APIs', 'SOAP', 'Node.js',
       'Solidity', 'Truffle',
       'Azure', 'AWS', 'Docker', 'Kubernetes', 'Helm',
       'CI/CD', 'Azure DevOps', 'Jenkins', 'Git', 'TFS/TFVC',
       'MSSQL', 'Oracle', 'Entity Framework Core', 'Entity Framework 6', 'Dapper',
       'T-SQL', 'PL-SQL', 'SSIS', 'SSRS', 'Data Migration', 'Query Tuning',
       'Clean Architecture', 'Domain-Driven Design (DDD)', 'SOLID',
       'OOP', 'TDD', 'MVVM', 'Agile (Scrum, Kanban)'
     ];
   
     const onSettingChange = (key ${useTS?': keyof typeof settings':''}) => (checked ${useTS?': boolean':''}) =>
       setSettings(prev => ({ ...prev, [key]: checked }));
   
     return (
       <div>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
           <Typography.Title level={1} style={{ margin: 0 }}>Profile</Typography.Title>
           <div>
             {isEditing ? (
               <>
                 <Button type="primary" icon={<SaveOutlined />} onClick={() => setIsEditing(false)} style={{ marginRight: 8 }}>Save</Button>
                 <Button icon={<CloseOutlined />} onClick={() => setIsEditing(false)}>Cancel</Button>
               </>
             ) : (
               <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>Edit Profile</Button>
             )}
           </div>
         </div>
   
         <Row gutter={[16, 16]}>
           {/* Header */}
           <Col span={24}>
             <Card>
               <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                 <Avatar size={120} icon={<UserOutlined />} />
                 <div style={{ flex: 1 }}>
                   <Typography.Title level={3} style={{ marginBottom: 4 }}>{profile.name}</Typography.Title>
                   <Typography.Text type="secondary" style={{ display: 'block', marginBottom: 8 }}>
                     {profile.position} at {profile.company}
                   </Typography.Text>
                   <Typography.Paragraph type="secondary" style={{ marginBottom: 12 }}>{profile.bio}</Typography.Paragraph>
                   <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                     {skills.map((s) => (
                       <Tag key={s}>{s}</Tag>
                     ))}
                   </div>
                 </div>
               </div>
             </Card>
           </Col>
   
           {/* Info */}
           <Col xs={24} md={16}>
             <Card title="Personal Information">
               <Form layout="vertical" disabled={!isEditing}>
                 <Row gutter={12}>
                   <Col xs={24} sm={12}>
                     <Form.Item label="Full Name">
                       <Input defaultValue={profile.name} prefix={<MailOutlined />} />
                     </Form.Item>
                   </Col>
                   <Col xs={24} sm={12}>
                     <Form.Item label="Email">
                       <Input defaultValue={profile.email} prefix={<MailOutlined />} />
                     </Form.Item>
                   </Col>
                   <Col xs={24} sm={12}>
                     <Form.Item label="Phone">
                       <Input defaultValue={profile.phone} prefix={<PhoneOutlined />} />
                     </Form.Item>
                   </Col>
                   <Col xs={24} sm={12}>
                     <Form.Item label="Location">
                       <Input defaultValue={profile.location} prefix={<EnvironmentOutlined />} />
                     </Form.Item>
                   </Col>
                   <Col xs={24} sm={12}>
                     <Form.Item label="Company">
                       <Input defaultValue={profile.company} prefix={<BankOutlined />} />
                     </Form.Item>
                   </Col>
                   <Col xs={24} sm={12}>
                     <Form.Item label="Position">
                       <Input defaultValue={profile.position} prefix={<BankOutlined />} />
                     </Form.Item>
                   </Col>
                   <Col span={24}>
                     <Form.Item label="Bio">
                       <Input.TextArea rows={3} defaultValue={profile.bio} />
                     </Form.Item>
                   </Col>
                 </Row>
               </Form>
             </Card>
           </Col>
   
           {/* Settings & Actions */}
           <Col xs={24} md={8}>
             <Card title="Settings" style={{ marginBottom: 16 }}>
               <List>
                 <List.Item actions={[<Switch checked={settings.emailNotifications} onChange={onSettingChange('emailNotifications')} />]}>
                   <List.Item.Meta avatar={<BellOutlined />} title="Email Notifications" />
                 </List.Item>
                 <List.Item actions={[<Switch checked={settings.pushNotifications} onChange={onSettingChange('pushNotifications')} />]}>
                   <List.Item.Meta avatar={<BellOutlined />} title="Push Notifications" />
                 </List.Item>
                 <List.Item actions={[<Switch checked={settings.darkMode} onChange={onSettingChange('darkMode')} />]}>
                   <List.Item.Meta avatar={<BgColorsOutlined />} title="Dark Mode" />
                 </List.Item>
                 <List.Item actions={[<Switch checked={settings.twoFactorAuth} onChange={onSettingChange('twoFactorAuth')} />]}>
                   <List.Item.Meta avatar={<SafetyOutlined />} title="Two-Factor Auth" />
                 </List.Item>
               </List>
             </Card>
   
             <Card title="Quick Actions">
               <Button block style={{ marginBottom: 8 }}>Download Resume</Button>
               <Button block style={{ marginBottom: 8 }}>Share Profile</Button>
               <Button block danger>Delete Account</Button>
             </Card>
           </Col>
         </Row>
       </div>
     );
   }`;
  }
 module.exports = { profileSource };