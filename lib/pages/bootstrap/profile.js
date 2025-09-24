function profileSource(useTS) {
  return `import { useState } from 'react';
  
  export default function Profile() {
    const [isEditing, setIsEditing] = useState(false);
    const [profile] = useState({
      name: 'Nirmal Samaranayaka',
      email: 'nirmal.fullstack@gmail.com',
      phone: '+46 (72) xxx-xxxx',
      location: 'Stockholm, Sweden',
      company: 'Scania AB.',
      position: 'Senior Fullstack Developer',
      education: 'Computer Science, University of Colombo',
      website: 'https://dev.to/nirmalsamaranayaka',
      bio: 'Experienced Full Stack Engineer & Tech Lead | Specialized in .NET, React, Angular, and scalable cloud-native solutions.'
    });
  
    const [settings, setSettings] = useState({
      emailNotifications: true,
      pushNotifications: false,
      darkMode: false,
      twoFactorAuth: true
    });
  
    const [skills] = useState([
      'React', 'Redux', 'MobX', 'React Query', 'Angular', 'Micro Frontends', 
      'TypeScript', 'JavaScript', 'HTML/CSS', 'jQuery', 'Bootstrap', 'Tailwind CSS',
      '.NET 6/7/8', 'ASP.NET Core', 'C#', 'Web API', 'Microservices', 'Azure', 'AWS'
    ]);
  
    const handleSave = () => {
      setIsEditing(false);
    };
  
    const handleCancel = () => {
      setIsEditing(false);
    };
  
    const handleSettingChange = (setting${useTS ? ':string' : ''}) => (event${useTS ? ': React.ChangeEvent<HTMLInputElement>' : ''}) => {
      setSettings(prev => ({
        ...prev,
        [setting]: event.target.checked
      }));
    };
  
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="display-4 fw-bold text-primary">Profile</h1>
          <div>
            {isEditing ? (
              <>
                <button className="btn btn-primary me-2" onClick={handleSave}>
                  <i className="bi bi-check me-1"></i>Save
                </button>
                <button className="btn btn-outline-secondary" onClick={handleCancel}>
                  <i className="bi bi-x me-1"></i>Cancel
                </button>
              </>
            ) : (
              <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                <i className="bi bi-pencil me-1"></i>Edit Profile
              </button>
            )}
          </div>
        </div>
  
        <div className="row g-4">
          {/* Profile Header */}
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center gap-4">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '120px', height: '120px', fontSize: '3rem' }}>
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-grow-1">
                    <h2 className="mb-2">{profile.name}</h2>
                    <h5 className="text-muted mb-3">{profile.position} at {profile.company}</h5>
                    <p className="text-muted mb-3">{profile.bio}</p>
                    <div className="d-flex gap-1 flex-wrap">
                      {skills.map((skill) => (
                        <span key={skill} className="badge bg-secondary me-1 mb-1">{skill}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Profile Details */}
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Personal Information</h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.name}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={profile.email}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={profile.phone}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.location}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Company</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.company}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label">Position</label>
                    <input
                      type="text"
                      className="form-control"
                      value={profile.position}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Bio</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={profile.bio}
                      disabled={!isEditing}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          {/* Settings */}
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">Settings</h5>
              </div>
              <div className="card-body">
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={handleSettingChange('emailNotifications')}
                  />
                  <label className="form-check-label">Email Notifications</label>
                </div>
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={handleSettingChange('pushNotifications')}
                  />
                  <label className="form-check-label">Push Notifications</label>
                </div>
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.darkMode}
                    onChange={handleSettingChange('darkMode')}
                  />
                  <label className="form-check-label">Dark Mode</label>
                </div>
                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={settings.twoFactorAuth}
                    onChange={handleSettingChange('twoFactorAuth')}
                  />
                  <label className="form-check-label">Two-Factor Auth</label>
                </div>
              </div>
            </div>
  
            <div className="card mt-3">
              <div className="card-header">
                <h5 className="mb-0">Quick Actions</h5>
              </div>
              <div className="card-body">
                <button className="btn btn-outline-primary w-100 mb-2">Download Resume</button>
                <button className="btn btn-outline-primary w-100 mb-2">Share Profile</button>
                <button className="btn btn-outline-danger w-100">Delete Account</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }`;
  }
 module.exports = { profileSource };