'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Edit2, Trash2, Search, Filter, X, Globe, Mail, Phone } from 'lucide-react';
import * as brandService from '../services/brandService';
import './ClientsManager.css';

const BrandsManager = ({ user }) => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    website: '',
    notes: '',
    image_url: '',
    logo_url: ''
  });

  const canEdit = ['admin', 'staff'].includes(user?.role);

  const categories = [
    'Building Products',
    'Acoustics',
    'Automation',
    'Security',
    'Insulation',
    'Blinds & Shutters',
    'Lighting',
    'Stone & Surfaces',
    'Interior Design',
    'Plumbing',
    'Wood Finishes',
    'Wallcoverings',
    'Furniture',
    'Flooring',
    'Bathware',
    'Other'
  ];

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const data = await brandService.getBrands();
      setBrands(data);
    } catch (error) {
      console.error('Failed to fetch brands:', error);
      alert('Failed to load brands. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        await brandService.updateBrand(editingBrand.id, formData);
      } else {
        await brandService.createBrand(formData);
      }
      setShowModal(false);
      setEditingBrand(null);
      resetForm();
      fetchBrands();
    } catch (error) {
      console.error('Failed to save brand:', error);
      alert(error.message || 'Failed to save brand');
    }
  };

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      category: brand.category || '',
      description: brand.description || '',
      contact_name: brand.contact_name || '',
      contact_email: brand.contact_email || '',
      contact_phone: brand.contact_phone || '',
      website: brand.website || '',
      notes: brand.notes || '',
      image_url: brand.image_url || '',
      logo_url: brand.logo_url || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand? This will not delete projects or meetings associated with it.')) {
      try {
        await brandService.deleteBrand(id);
        fetchBrands();
      } catch (error) {
        console.error('Failed to delete brand:', error);
        alert(error.message || 'Failed to delete brand');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      description: '',
      contact_name: '',
      contact_email: '',
      contact_phone: '',
      website: '',
      notes: '',
      image_url: '',
      logo_url: ''
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Building Products': 'linear-gradient(135deg, #667eea, #764ba2)',
      'Acoustics': 'linear-gradient(135deg, #fa709a, #fee140)',
      'Automation': 'linear-gradient(135deg, #4facfe, #00f2fe)',
      'Security': 'linear-gradient(135deg, #f093fb, #f5576c)',
      'Insulation': 'linear-gradient(135deg, #c7ecee, #778beb)',
      'Blinds & Shutters': 'linear-gradient(135deg, #feca57, #ff9ff3)',
      'Lighting': 'linear-gradient(135deg, #feca57, #ee5a6f)',
      'Stone & Surfaces': 'linear-gradient(135deg, #54a0ff, #2e86de)',
      'Interior Design': 'linear-gradient(135deg, #ff6b6b, #ee5a6f)',
      'Plumbing': 'linear-gradient(135deg, #48dbfb, #0abde3)',
      'Wood Finishes': 'linear-gradient(135deg, #d4a373, #8b6f47)',
      'Wallcoverings': 'linear-gradient(135deg, #fa709a, #fee140)',
      'Furniture': 'linear-gradient(135deg, #43e97b, #38f9d7)',
      'Flooring': 'linear-gradient(135deg, #d4a373, #a67c52)',
      'Bathware': 'linear-gradient(135deg, #48dbfb, #4facfe)',
      'Other': 'linear-gradient(135deg, #6b7280, #4b5563)'
    };
    return colors[category] || colors['Other'];
  };

  const filteredBrands = brands.filter(brand => {
    if (filterCategory !== 'all' && brand.category !== filterCategory) return false;
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      brand.name?.toLowerCase().includes(searchLower) ||
      brand.category?.toLowerCase().includes(searchLower) ||
      brand.description?.toLowerCase().includes(searchLower) ||
      brand.contact_name?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="brands-manager">
      {/* Header */}
      <div className="manager-header">
        <div className="header-left">
          <div className="header-icon">
            <Package size={32} />
          </div>
          <div>
            <h1>Brands & Principals</h1>
            <p>Manage your brand relationships and product lines</p>
          </div>
        </div>
        {canEdit && (
          <motion.button
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <Plus size={20} />
            <span>New Brand</span>
          </motion.button>
        )}
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterCategory === 'all' ? 'active' : ''}`}
            onClick={() => setFilterCategory('all')}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${filterCategory === category ? 'active' : ''}`}
              onClick={() => setFilterCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Brands Grid */}
      <div className="brands-grid">
        {filteredBrands.length === 0 ? (
          <div className="placeholder-content">
            <p>No brands found. {canEdit && 'Click "New Brand" to create one.'}</p>
          </div>
        ) : (
          filteredBrands.map((brand, index) => (
            <motion.div
              key={brand.id}
              className="brand-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              {/* Brand Image Header */}
              {brand.image_url && (
                <div className="brand-image-header" style={{
                  backgroundImage: `url(${brand.image_url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '180px',
                  borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
                  marginBottom: '1rem',
                  position: 'relative'
                }}>
                  {/* Logo overlay if available */}
                  {brand.logo_url && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-30px',
                      left: '20px',
                      width: '80px',
                      height: '80px',
                      background: 'white',
                      borderRadius: 'var(--radius-lg)',
                      padding: '10px',
                      boxShadow: 'var(--shadow-lg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img 
                        src={brand.logo_url} 
                        alt={`${brand.name} logo`}
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '100%',
                          objectFit: 'contain'
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* If no image but logo exists, show logo prominently */}
              {!brand.image_url && brand.logo_url && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  padding: '1rem',
                  marginBottom: '1rem'
                }}>
                  <img 
                    src={brand.logo_url} 
                    alt={`${brand.name} logo`}
                    style={{ 
                      maxWidth: '150px',
                      maxHeight: '80px',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              )}

              <div className="brand-card-header" style={{ marginTop: brand.image_url ? '40px' : '0' }}>
                <span
                  className="brand-category-badge"
                  style={{ background: getCategoryColor(brand.category) }}
                >
                  {brand.category || 'Uncategorized'}
                </span>
                {canEdit && (
                  <div className="brand-actions">
                    <button className="action-btn edit" onClick={() => handleEdit(brand)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(brand.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="brand-info">
                <h3>{brand.name}</h3>

                {brand.description && (
                  <p style={{ color: 'var(--gray-600)', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: '1.5' }}>
                    {brand.description}
                  </p>
                )}

                {brand.contact_name && (
                  <div className="info-row">
                    <Mail size={16} />
                    <span>{brand.contact_name}</span>
                  </div>
                )}

                {brand.contact_email && (
                  <div className="info-row">
                    <Mail size={16} />
                    <span>{brand.contact_email}</span>
                  </div>
                )}

                {brand.contact_phone && (
                  <div className="info-row">
                    <Phone size={16} />
                    <span>{brand.contact_phone}</span>
                  </div>
                )}

                {brand.website && (
                  <div className="info-row">
                    <Globe size={16} />
                    <a
                      href={brand.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--primary)', textDecoration: 'none' }}
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              {brand.notes && (
                <div className="brand-notes">
                  {brand.notes}
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{editingBrand ? 'Edit Brand' : 'New Brand'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Brand Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Trillidor"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brand description and product information"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Contact Name</label>
                    <input
                      type="text"
                      value={formData.contact_name}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                      placeholder="Main contact person"
                    />
                  </div>

                  <div className="form-group">
                    <label>Contact Email</label>
                    <input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      placeholder="contact@brand.com"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Website</label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://www.brand.com"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Brand Image URL</label>
                    <input
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://example.com/brand-image.jpg"
                    />
                    <small style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                      Header/banner image for the brand card
                    </small>
                  </div>

                  <div className="form-group">
                    <label>Brand Logo URL</label>
                    <input
                      type="url"
                      value={formData.logo_url}
                      onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                      placeholder="https://example.com/brand-logo.png"
                    />
                    <small style={{ color: 'var(--gray-500)', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                      Logo image for the brand
                    </small>
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes and information"
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingBrand ? 'Update Brand' : 'Create Brand'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrandsManager;
