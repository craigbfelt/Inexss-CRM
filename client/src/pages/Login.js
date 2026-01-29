import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Sparkles, Building2, Users, TrendingUp } from 'lucide-react';
import ConfigurationError from '../components/ConfigurationError';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, configError } = useAuth();

  // Show configuration error if present
  if (configError) {
    return (
      <div className="login-container">
        <div className="animated-bg">
          <div className="floating-shape shape-1"></div>
          <div className="floating-shape shape-2"></div>
          <div className="floating-shape shape-3"></div>
          <div className="floating-shape shape-4"></div>
        </div>
        <div className="login-content" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <ConfigurationError message={configError} />
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="login-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      <div className="login-content">
        {/* Left Side - Branding */}
        <motion.div 
          className="login-branding"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="logo-container"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Sparkles size={48} className="logo-icon" />
            <h1 className="logo-text gradient-text">Inexss CRM</h1>
          </motion.div>
          
          <motion.p 
            className="tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Specialized Solutions for Building Excellence
          </motion.p>

          <div className="features-list">
            <motion.div 
              className="feature-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Building2 className="feature-icon" />
              <div>
                <h3>Manage Projects</h3>
                <p>Track all your building projects in one place</p>
              </div>
            </motion.div>

            <motion.div 
              className="feature-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Users className="feature-icon" />
              <div>
                <h3>Client Relations</h3>
                <p>Build lasting relationships with architects</p>
              </div>
            </motion.div>

            <motion.div 
              className="feature-item"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <TrendingUp className="feature-icon" />
              <div>
                <h3>Insightful Reports</h3>
                <p>Generate detailed monthly performance reports</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Form */}
        <motion.div 
          className="login-form-container"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="form-card">
            <motion.div 
              className="form-header"
              layoutId="form-header"
            >
              <h2>Welcome Back</h2>
              <p>Sign in to your account</p>
            </motion.div>

            {error && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="login-form">

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input"
                  placeholder="••••••••"
                  required
                />
              </div>

              <motion.button
                type="submit"
                className="btn btn-primary btn-submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading ? (
                  <div className="spinner"></div>
                ) : (
                  <>
                    <LogIn size={20} />
                    Sign In
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
