import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-icon">
          <AlertTriangle size={80} />
        </div>
        <h1 className="notfound-title gradient-text">404</h1>
        <h2 className="notfound-subtitle">Page Not Found</h2>
        <p className="notfound-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard" className="notfound-button">
          <Home size={20} />
          <span>Back to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
