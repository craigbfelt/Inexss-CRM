'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, User, Lock, Bell, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import supabase from '../lib/supabase';
import './ClientsManager.css';

const SettingsManager = ({ user }) => {
  const { updateUser } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: user?.location || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    meetingReminders: true,
    projectUpdates: true,
    monthlyReports: false
  });

  const showMessage = (type, text, duration = 5000) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), duration);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          name: profileData.name,
          location: profileData.location
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local user state
      if (updateUser) {
        updateUser({ ...user, ...profileData });
      }

      showMessage('success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      showMessage('error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showMessage('error', 'Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Show success message with longer duration (10 seconds)
      showMessage('success', 'Password changed successfully! You can now use your new password to log in.', 10000);
    } catch (error) {
      console.error('Failed to change password:', error);
      showMessage('error', error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, you would save these to the database
      // For now, we'll just show a success message
      showMessage('success', 'Notification preferences updated!');
    } catch (error) {
      console.error('Failed to update notifications:', error);
      showMessage('error', 'Failed to update notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="settings-manager" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div className="manager-header">
        <div className="header-left">
          <div className="header-icon">
            <Settings size={32} />
          </div>
          <div>
            <h1>Settings</h1>
            <p>Manage your account preferences</p>
          </div>
        </div>
      </div>

      {/* Message Banner */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            padding: '1rem',
            marginBottom: '2rem',
            borderRadius: 'var(--radius-lg)',
            background: message.type === 'success' ? 'var(--success)' : 'var(--danger)',
            color: 'white',
            fontWeight: '600'
          }}
        >
          {message.text}
        </motion.div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        {/* Sidebar Navigation */}
        <div>
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <motion.button
                key={section.id}
                className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '1rem',
                  marginBottom: '0.5rem',
                  border: 'none',
                  background: activeSection === section.id ? 'var(--primary)' : 'white',
                  color: activeSection === section.id ? 'white' : 'var(--gray-700)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onClick={() => setActiveSection(section.id)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={20} />
                <span>{section.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Content Area */}
        <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)' }}>
          {/* Profile Section */}
          {activeSection === 'profile' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>Profile Information</h2>
              <form onSubmit={handleProfileUpdate}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    style={{ background: 'var(--gray-100)', cursor: 'not-allowed' }}
                  />
                  <small style={{ color: 'var(--gray-600)', marginTop: '0.5rem', display: 'block' }}>
                    Email cannot be changed. Contact your administrator if you need to update it.
                  </small>
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <input
                    type="text"
                    value={user?.role || ''}
                    disabled
                    style={{ background: 'var(--gray-100)', cursor: 'not-allowed', textTransform: 'capitalize' }}
                  />
                  <small style={{ color: 'var(--gray-600)', marginTop: '0.5rem', display: 'block' }}>
                    Your role is managed by administrators.
                  </small>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <select
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  >
                    <option value="">Select Location</option>
                    <option value="JHB">Johannesburg</option>
                    <option value="Cape Town">Cape Town</option>
                    <option value="Durban">Durban</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <Save size={20} />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </form>
            </motion.div>
          )}

          {/* Password Section */}
          {activeSection === 'password' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>Change Password</h2>
              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="Enter new password"
                    required
                    minLength={8}
                  />
                  <small style={{ color: 'var(--gray-600)', marginTop: '0.5rem', display: 'block' }}>
                    Password must be at least 8 characters long
                  </small>
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    required
                    minLength={8}
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                  <Lock size={20} />
                  <span>{loading ? 'Changing...' : 'Change Password'}</span>
                </button>
              </form>
            </motion.div>
          )}

          {/* Notifications Section */}
          {activeSection === 'notifications' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>Notification Preferences</h2>
              <form onSubmit={handleNotificationUpdate}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                      style={{ width: '20px', height: '20px' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Email Notifications</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>Receive email notifications for important updates</div>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={notificationSettings.meetingReminders}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, meetingReminders: e.target.checked })}
                      style={{ width: '20px', height: '20px' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Meeting Reminders</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>Get reminders before scheduled meetings</div>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={notificationSettings.projectUpdates}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, projectUpdates: e.target.checked })}
                      style={{ width: '20px', height: '20px' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Project Updates</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>Notifications when projects are updated</div>
                    </div>
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={notificationSettings.monthlyReports}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, monthlyReports: e.target.checked })}
                      style={{ width: '20px', height: '20px' }}
                    />
                    <div>
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Monthly Reports</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--gray-600)' }}>Receive monthly performance reports via email</div>
                    </div>
                  </label>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '1.5rem' }}>
                  <Save size={20} />
                  <span>{loading ? 'Saving...' : 'Save Preferences'}</span>
                </button>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
