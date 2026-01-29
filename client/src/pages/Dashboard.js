import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Users, Building2, Calendar, BarChart3, Package, 
  Settings, LogOut, Menu, X, Sparkles, TrendingUp,
  UserCircle, Bell, Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Home, roles: ['admin', 'staff', 'brand_representative', 'contractor', 'supplier'] },
    { id: 'meetings', label: 'Meetings', icon: Calendar, roles: ['admin', 'staff', 'brand_representative', 'contractor'] },
    { id: 'clients', label: 'Clients', icon: Users, roles: ['admin', 'staff', 'brand_representative', 'contractor', 'supplier'] },
    { id: 'projects', label: 'Projects', icon: Building2, roles: ['admin', 'staff', 'brand_representative', 'contractor', 'supplier'] },
    { id: 'brands', label: 'Brands', icon: Package, roles: ['admin', 'staff', 'brand_representative', 'supplier'] },
    { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['admin', 'staff', 'brand_representative'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin', 'staff', 'brand_representative', 'contractor', 'supplier'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  const getRoleDisplay = (role) => {
    const roleMap = {
      'admin': 'Administrator',
      'staff': 'Staff Member',
      'brand_representative': 'Brand Representative',
      'contractor': 'Contractor',
      'supplier': 'Supplier'
    };
    return roleMap[role] || role;
  };

  const getRoleBadgeClass = (role) => {
    const classMap = {
      'admin': 'role-badge-admin',
      'staff': 'role-badge-staff',
      'brand_representative': 'role-badge-brand',
      'contractor': 'role-badge-contractor',
      'supplier': 'role-badge-supplier'
    };
    return classMap[role] || 'role-badge-default';
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            className="sidebar"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="sidebar-header">
              <motion.div 
                className="logo"
                whileHover={{ scale: 1.05 }}
              >
                <Sparkles size={32} className="logo-icon" />
                <span className="logo-text gradient-text">Inexss CRM</span>
              </motion.div>
            </div>

            <div className="user-info">
              <div className="user-avatar">
                <UserCircle size={40} />
              </div>
              <div className="user-details">
                <h3>{user?.name}</h3>
                <span className={`role-badge ${getRoleBadgeClass(user?.role)}`}>
                  {getRoleDisplay(user?.role)}
                </span>
              </div>
            </div>

            <nav className="sidebar-nav">
              {filteredMenuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.button
                    key={item.id}
                    className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(item.id)}
                    whileHover={{ x: 10 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                    {activeTab === item.id && (
                      <motion.div
                        className="active-indicator"
                        layoutId="activeTab"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>

            <button className="logout-btn" onClick={logout}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="top-bar">
          <div className="top-bar-left">
            <button 
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="page-title">
              {filteredMenuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="top-bar-right">
            <div className="search-bar">
              <Search size={20} />
              <input type="text" placeholder="Search..." />
            </div>

            <motion.button
              className="notification-btn"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={22} />
              <span className="notification-badge">3</span>
            </motion.button>
          </div>
        </header>

        {/* Content Area */}
        <div className="content-area">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && <OverviewContent user={user} />}
              {activeTab === 'meetings' && <MeetingsContent user={user} />}
              {activeTab === 'clients' && <ClientsContent user={user} />}
              {activeTab === 'projects' && <ProjectsContent user={user} />}
              {activeTab === 'brands' && <BrandsContent user={user} />}
              {activeTab === 'reports' && <ReportsContent user={user} />}
              {activeTab === 'settings' && <SettingsContent user={user} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Overview Content Component
const OverviewContent = ({ user }) => {
  const stats = [
    { 
      label: 'Total Meetings', 
      value: '24', 
      change: '+12%', 
      positive: true,
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      icon: Calendar
    },
    { 
      label: 'Active Projects', 
      value: '8', 
      change: '+3', 
      positive: true,
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      icon: Building2
    },
    { 
      label: 'Total Clients', 
      value: '42', 
      change: '+8%', 
      positive: true,
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      icon: Users
    },
    { 
      label: 'Brands Managed', 
      value: '15', 
      change: '0', 
      positive: true,
      gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      icon: Package
    },
  ];

  const restrictedStats = ['contractor', 'supplier'].includes(user?.role) 
    ? stats.filter(s => s.label !== 'Brands Managed')
    : stats;

  return (
    <div className="overview-content">
      <div className="welcome-banner">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="welcome-text"
        >
          <h2>Welcome back, {user?.name}! 👋</h2>
          <p>Here's what's happening with your projects today.</p>
        </motion.div>
        <motion.div
          className="welcome-illustration"
          animate={{ 
            y: [0, -10, 0],
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <TrendingUp size={100} className="illustration-icon" />
        </motion.div>
      </div>

      <div className="stats-grid">
        {restrictedStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="stat-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="stat-card-inner">
                <div className="stat-icon" style={{ background: stat.gradient }}>
                  <Icon size={24} />
                </div>
                <div className="stat-details">
                  <p className="stat-label">{stat.label}</p>
                  <h3 className="stat-value">{stat.value}</h3>
                  <span className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                    {stat.change} from last month
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <motion.div 
            className="activity-item"
            whileHover={{ x: 5 }}
          >
            <div className="activity-icon meeting">
              <Calendar size={20} />
            </div>
            <div className="activity-details">
              <h4>Meeting with ABC Architects</h4>
              <p>Discussed Trillidor and window solutions</p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </motion.div>

          <motion.div 
            className="activity-item"
            whileHover={{ x: 5 }}
          >
            <div className="activity-icon project">
              <Building2 size={20} />
            </div>
            <div className="activity-details">
              <h4>New project added</h4>
              <p>Sandton Office Complex - Phase 2</p>
              <span className="activity-time">5 hours ago</span>
            </div>
          </motion.div>

          <motion.div 
            className="activity-item"
            whileHover={{ x: 5 }}
          >
            <div className="activity-icon client">
              <Users size={20} />
            </div>
            <div className="activity-details">
              <h4>New client registered</h4>
              <p>Design Studio Cape Town</p>
              <span className="activity-time">Yesterday</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Placeholder components for other tabs
const MeetingsContent = ({ user }) => (
  <div className="placeholder-content">
    <h2>Meetings Management</h2>
    <p>Track and manage all your client meetings here.</p>
    {['contractor'].includes(user?.role) && (
      <div className="info-banner">
        <p>📝 As a contractor, you can view your own meetings and related information.</p>
      </div>
    )}
  </div>
);

const ClientsContent = ({ user }) => (
  <div className="placeholder-content">
    <h2>Clients & Architects</h2>
    <p>Manage your client relationships and contact information.</p>
    {['contractor', 'supplier'].includes(user?.role) && (
      <div className="info-banner">
        <p>👁️ You have read-only access to client information.</p>
      </div>
    )}
  </div>
);

const ProjectsContent = ({ user }) => (
  <div className="placeholder-content">
    <h2>Projects Overview</h2>
    <p>View and track all your building projects.</p>
    {user?.role === 'contractor' && (
      <div className="info-banner">
        <p>🏗️ You can view projects you're involved with.</p>
      </div>
    )}
    {user?.role === 'supplier' && (
      <div className="info-banner">
        <p>📦 You can view projects related to your supplied brands.</p>
      </div>
    )}
  </div>
);

const BrandsContent = ({ user }) => (
  <div className="placeholder-content">
    <h2>Brand Management</h2>
    <p>Manage your 15+ brand relationships and product lines.</p>
    {user?.role === 'supplier' && (
      <div className="info-banner">
        <p>📦 You can view information for your supplied brands only.</p>
      </div>
    )}
  </div>
);

const ReportsContent = () => (
  <div className="placeholder-content">
    <h2>Reports & Analytics</h2>
    <p>Generate monthly reports and view performance analytics.</p>
  </div>
);

const SettingsContent = () => (
  <div className="placeholder-content">
    <h2>Settings</h2>
    <p>Manage your account settings and preferences.</p>
  </div>
);

export default Dashboard;
