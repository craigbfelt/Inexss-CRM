const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'inexss-crm-secret-key-change-in-production');
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid authentication' });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid authentication' });
  }
};

const adminAuth = async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

const brandRepAuth = async (req, res, next) => {
  if (req.user.role === 'brand_representative') {
    req.brandFilter = req.user.brandAccess;
  }
  next();
};

const contractorAuth = async (req, res, next) => {
  if (req.user.role === 'contractor') {
    req.restrictedAccess = true;
    req.userRole = 'contractor';
  }
  next();
};

const supplierAuth = async (req, res, next) => {
  if (req.user.role === 'supplier') {
    req.restrictedAccess = true;
    req.userRole = 'supplier';
    req.brandFilter = req.user.brandAccess;
  }
  next();
};

const restrictedRoleCheck = (req, res, next) => {
  if (['contractor', 'supplier'].includes(req.user.role)) {
    return res.status(403).json({ error: 'Access restricted for your role' });
  }
  next();
};

module.exports = { auth, adminAuth, brandRepAuth, contractorAuth, supplierAuth, restrictedRoleCheck };
