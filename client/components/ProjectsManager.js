'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Plus, Edit2, Trash2, Search, Filter, X, MapPin, Users, Package, DollarSign, Calendar } from 'lucide-react';
import * as projectService from '../services/projectService';
import * as clientService from '../services/clientService';
import * as brandService from '../services/brandService';
import './ClientsManager.css';

const ProjectsManager = ({ user }) => {
  const [projects, setProjects] = useState([]);
  const [clients, setClients] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    project_number: '',
    client_id: '',
    location: '',
    description: '',
    status: 'Lead',
    estimated_value: '',
    start_date: '',
    end_date: '',
    brands: []
  });

  const canEdit = !['contractor', 'supplier'].includes(user?.role);

  const projectStatuses = ['Lead', 'Quoted', 'In Progress', 'On Hold', 'Completed', 'Cancelled'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsData, clientsData, brandsData] = await Promise.all([
        projectService.getProjects(),
        clientService.getClients(),
        brandService.getBrands()
      ]);
      setProjects(projectsData);
      setClients(clientsData);
      setBrands(brandsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert('Failed to load projects. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const projectData = {
        ...formData,
        created_by: user?.id
      };

      if (editingProject) {
        await projectService.updateProject(editingProject.id, projectData);
      } else {
        await projectService.createProject(projectData);
      }
      setShowModal(false);
      setEditingProject(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Failed to save project:', error);
      alert(error.message || 'Failed to save project');
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      project_number: project.project_number || '',
      client_id: project.client_id || '',
      location: project.location || '',
      description: project.description || '',
      status: project.status || 'Lead',
      estimated_value: project.estimated_value || '',
      start_date: project.start_date ? project.start_date.split('T')[0] : '',
      end_date: project.end_date ? project.end_date.split('T')[0] : '',
      brands: project.brands?.map(b => b.id) || []
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectService.deleteProject(id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete project:', error);
        alert(error.message || 'Failed to delete project');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      project_number: '',
      client_id: '',
      location: '',
      description: '',
      status: 'Lead',
      estimated_value: '',
      start_date: '',
      end_date: '',
      brands: []
    });
  };

  const toggleBrand = (brandId) => {
    setFormData({
      ...formData,
      brands: formData.brands.includes(brandId)
        ? formData.brands.filter(id => id !== brandId)
        : [...formData.brands, brandId]
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Lead': 'linear-gradient(135deg, #667eea, #764ba2)',
      'Quoted': 'linear-gradient(135deg, #f093fb, #f5576c)',
      'In Progress': 'linear-gradient(135deg, #4facfe, #00f2fe)',
      'On Hold': 'linear-gradient(135deg, #fca5a5, #ef4444)',
      'Completed': 'linear-gradient(135deg, #43e97b, #38f9d7)',
      'Cancelled': 'linear-gradient(135deg, #6b7280, #4b5563)'
    };
    return colors[status] || colors['Lead'];
  };

  const filteredProjects = projects.filter(project => {
    if (filterStatus !== 'all' && project.status !== filterStatus) return false;
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      project.name?.toLowerCase().includes(searchLower) ||
      project.project_number?.toLowerCase().includes(searchLower) ||
      project.location?.toLowerCase().includes(searchLower) ||
      project.client?.name?.toLowerCase().includes(searchLower) ||
      project.client?.company?.toLowerCase().includes(searchLower)
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
    <div className="projects-manager">
      {/* Header */}
      <div className="manager-header">
        <div className="header-left">
          <div className="header-icon">
            <Building2 size={32} />
          </div>
          <div>
            <h1>Projects</h1>
            <p>Manage building projects and specifications</p>
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
            <span>New Project</span>
          </motion.button>
        )}
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All
          </button>
          {projectStatuses.map((status) => (
            <button
              key={status}
              className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="projects-grid">
        {filteredProjects.length === 0 ? (
          <div className="placeholder-content">
            <p>No projects found. {canEdit && 'Click "New Project" to create one.'}</p>
          </div>
        ) : (
          filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="project-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
            >
              <div className="project-card-header">
                <span
                  className="project-status-badge"
                  style={{ background: getStatusColor(project.status) }}
                >
                  {project.status}
                </span>
                {canEdit && (
                  <div className="project-actions">
                    <button className="action-btn edit" onClick={() => handleEdit(project)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(project.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              <div className="project-info">
                <h3>{project.name}</h3>
                {project.project_number && (
                  <p style={{ color: 'var(--gray-600)', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    #{project.project_number}
                  </p>
                )}

                {project.client && (
                  <div className="info-row">
                    <Users size={16} />
                    <span>{project.client.name} - {project.client.company}</span>
                  </div>
                )}

                {project.location && (
                  <div className="info-row">
                    <MapPin size={16} />
                    <span>{project.location}</span>
                  </div>
                )}

                {project.estimated_value && (
                  <div className="info-row">
                    <DollarSign size={16} />
                    <span>R {parseFloat(project.estimated_value).toLocaleString()}</span>
                  </div>
                )}

                {project.start_date && (
                  <div className="info-row">
                    <Calendar size={16} />
                    <span>Start: {new Date(project.start_date).toLocaleDateString()}</span>
                  </div>
                )}

                {project.brands && project.brands.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {project.brands.map((brand) => (
                        <span key={brand.id} className="brand-tag">
                          <Package size={12} style={{ display: 'inline', marginRight: '4px' }} />
                          {brand.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {project.description && (
                <div className="project-notes">
                  {project.description}
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
                <h2>{editingProject ? 'Edit Project' : 'New Project'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <form className="modal-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Project Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Sandton Office Complex"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Project Number</label>
                    <input
                      type="text"
                      value={formData.project_number}
                      onChange={(e) => setFormData({ ...formData, project_number: e.target.value })}
                      placeholder="e.g., P-2024-001"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Client *</label>
                    <select
                      value={formData.client_id}
                      onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                      required
                    >
                      <option value="">Select Client</option>
                      {clients.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name} - {client.company}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      required
                    >
                      {projectStatuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Sandton, Johannesburg"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Estimated Value (R)</label>
                    <input
                      type="number"
                      value={formData.estimated_value}
                      onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })}
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Project description and notes"
                  />
                </div>

                <div className="form-group">
                  <label>Brands Involved</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {brands.map((brand) => (
                      <label
                        key={brand.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0.5rem 1rem',
                          background: formData.brands.includes(brand.id) ? 'var(--primary)' : 'var(--gray-100)',
                          color: formData.brands.includes(brand.id) ? 'white' : 'var(--gray-700)',
                          borderRadius: 'var(--radius-full)',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          fontSize: '0.9rem',
                          fontWeight: '600'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.brands.includes(brand.id)}
                          onChange={() => toggleBrand(brand.id)}
                          style={{ marginRight: '0.5rem' }}
                        />
                        {brand.name}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingProject ? 'Update Project' : 'Create Project'}
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

export default ProjectsManager;
