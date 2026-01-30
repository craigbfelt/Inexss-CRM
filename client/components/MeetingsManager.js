'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, Edit2, Trash2, Search, X, MapPin, Users, Building2, Package, CheckCircle, Circle } from 'lucide-react';
import { format } from 'date-fns';
import * as meetingService from '../services/meetingService';
import * as clientService from '../services/clientService';
import * as brandService from '../services/brandService';
import * as projectService from '../services/projectService';
import './ClientsManager.css';

const MeetingsManager = ({ user }) => {
  const [meetings, setMeetings] = useState([]);
  const [clients, setClients] = useState([]);
  const [brands, setBrands] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    client_id: '',
    project_id: '',
    meeting_date: '',
    location: '',
    summary: '',
    brand_discussions: [],
    action_items: []
  });

  const canEdit = !['contractor', 'supplier'].includes(user?.role);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [meetingsData, clientsData, brandsData, projectsData] = await Promise.all([
        meetingService.getMeetings(),
        clientService.getClients(),
        brandService.getBrands(),
        projectService.getProjects()
      ]);
      setMeetings(meetingsData);
      setClients(clientsData);
      setBrands(brandsData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert('Failed to load meetings. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const meetingData = {
        ...formData,
        created_by: user?.id
      };

      if (editingMeeting) {
        await meetingService.updateMeeting(editingMeeting.id, meetingData);
      } else {
        await meetingService.createMeeting(meetingData);
      }
      setShowModal(false);
      setEditingMeeting(null);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Failed to save meeting:', error);
      alert(error.message || 'Failed to save meeting');
    }
  };

  const handleEdit = (meeting) => {
    setEditingMeeting(meeting);
    setFormData({
      client_id: meeting.client_id || '',
      project_id: meeting.project_id || '',
      meeting_date: meeting.meeting_date ? meeting.meeting_date.split('T')[0] : '',
      location: meeting.location || '',
      summary: meeting.summary || '',
      brand_discussions: meeting.brand_discussions?.map(bd => ({
        brand_id: bd.brand?.id,
        is_required: bd.is_required,
        notes: bd.notes || '',
        estimated_value: bd.estimated_value || ''
      })) || [],
      action_items: meeting.action_items?.map(ai => ({
        description: ai.description,
        assigned_to: ai.assigned_to,
        due_date: ai.due_date ? ai.due_date.split('T')[0] : '',
        completed: ai.completed
      })) || []
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        await meetingService.deleteMeeting(id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete meeting:', error);
        alert(error.message || 'Failed to delete meeting');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      client_id: '',
      project_id: '',
      meeting_date: '',
      location: '',
      summary: '',
      brand_discussions: [],
      action_items: []
    });
  };

  const addBrandDiscussion = () => {
    setFormData({
      ...formData,
      brand_discussions: [
        ...formData.brand_discussions,
        { brand_id: '', is_required: false, notes: '', estimated_value: '' }
      ]
    });
  };

  const removeBrandDiscussion = (index) => {
    setFormData({
      ...formData,
      brand_discussions: formData.brand_discussions.filter((_, i) => i !== index)
    });
  };

  const updateBrandDiscussion = (index, field, value) => {
    const updated = [...formData.brand_discussions];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, brand_discussions: updated });
  };

  const addActionItem = () => {
    setFormData({
      ...formData,
      action_items: [
        ...formData.action_items,
        { description: '', assigned_to: user?.id, due_date: '', completed: false }
      ]
    });
  };

  const removeActionItem = (index) => {
    setFormData({
      ...formData,
      action_items: formData.action_items.filter((_, i) => i !== index)
    });
  };

  const updateActionItem = (index, field, value) => {
    const updated = [...formData.action_items];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, action_items: updated });
  };

  const filteredMeetings = meetings.filter(meeting => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      meeting.client?.name?.toLowerCase().includes(searchLower) ||
      meeting.client?.company?.toLowerCase().includes(searchLower) ||
      meeting.location?.toLowerCase().includes(searchLower) ||
      meeting.summary?.toLowerCase().includes(searchLower)
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
    <div className="meetings-manager">
      {/* Header */}
      <div className="manager-header">
        <div className="header-left">
          <div className="header-icon">
            <Calendar size={32} />
          </div>
          <div>
            <h1>Meetings</h1>
            <p>Track client meetings and discussions</p>
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
            <span>New Meeting</span>
          </motion.button>
        )}
      </div>

      {/* Search */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search meetings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Meetings List */}
      <div className="meetings-list">
        {filteredMeetings.length === 0 ? (
          <div className="placeholder-content">
            <p>No meetings found. {canEdit && 'Click "New Meeting" to create one.'}</p>
          </div>
        ) : (
          filteredMeetings.map((meeting, index) => (
            <motion.div
              key={meeting.id}
              className="meeting-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="meeting-header">
                <div className="meeting-date">
                  <span className="day">{format(new Date(meeting.meeting_date), 'd')}</span>
                  <span className="month">{format(new Date(meeting.meeting_date), 'MMM')}</span>
                  <span className="year">{format(new Date(meeting.meeting_date), 'yyyy')}</span>
                </div>
                <div className="meeting-details">
                  <h3>{meeting.client?.name || 'Unknown Client'}</h3>
                  <div className="info-row">
                    <Building2 size={16} />
                    <span>{meeting.client?.company || 'No company'}</span>
                  </div>
                  {meeting.location && (
                    <div className="info-row">
                      <MapPin size={16} />
                      <span>{meeting.location}</span>
                    </div>
                  )}
                  {meeting.project && (
                    <div className="info-row">
                      <Building2 size={16} />
                      <span>Project: {meeting.project.name}</span>
                    </div>
                  )}
                  {meeting.summary && (
                    <p style={{ marginTop: '0.75rem', color: 'var(--gray-700)' }}>
                      {meeting.summary}
                    </p>
                  )}
                  {meeting.brand_discussions && meeting.brand_discussions.length > 0 && (
                    <div className="brands-discussed">
                      {meeting.brand_discussions.map((discussion) => (
                        <span
                          key={discussion.id}
                          className={`brand-tag ${discussion.is_required ? 'required' : ''}`}
                        >
                          <Package size={14} style={{ display: 'inline', marginRight: '4px' }} />
                          {discussion.brand?.name}
                          {discussion.is_required && ' ✓'}
                        </span>
                      ))}
                    </div>
                  )}
                  {meeting.action_items && meeting.action_items.length > 0 && (
                    <div style={{ marginTop: '1rem' }}>
                      <strong>Action Items:</strong>
                      <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                        {meeting.action_items.map((item) => (
                          <li key={item.id} style={{ color: item.completed ? 'var(--success)' : 'var(--gray-700)' }}>
                            {item.completed ? <CheckCircle size={14} style={{ display: 'inline', marginRight: '4px' }} /> : <Circle size={14} style={{ display: 'inline', marginRight: '4px' }} />}
                            {item.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {canEdit && (
                  <div className="meeting-actions">
                    <button className="action-btn edit" onClick={() => handleEdit(meeting)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDelete(meeting.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>
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
                <h2>{editingMeeting ? 'Edit Meeting' : 'New Meeting'}</h2>
                <button className="close-btn" onClick={() => setShowModal(false)}>
                  <X size={20} />
                </button>
              </div>

              <form className="modal-form" onSubmit={handleSubmit}>
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
                    <label>Project (Optional)</label>
                    <select
                      value={formData.project_id}
                      onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                    >
                      <option value="">Select Project</option>
                      {projects
                        .filter(p => !formData.client_id || p.client_id === formData.client_id)
                        .map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Meeting Date *</label>
                    <input
                      type="date"
                      value={formData.meeting_date}
                      onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Meeting location"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Summary</label>
                  <textarea
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="Meeting summary and notes"
                  />
                </div>

                {/* Brand Discussions */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>Brands Discussed</label>
                    <button type="button" className="btn btn-secondary" onClick={addBrandDiscussion}>
                      <Plus size={16} /> Add Brand
                    </button>
                  </div>
                  {formData.brand_discussions.map((discussion, index) => (
                    <div key={index} style={{ padding: '1rem', background: 'var(--gray-50)', borderRadius: '8px', marginTop: '0.5rem' }}>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Brand</label>
                          <select
                            value={discussion.brand_id}
                            onChange={(e) => updateBrandDiscussion(index, 'brand_id', e.target.value)}
                          >
                            <option value="">Select Brand</option>
                            {brands.map((brand) => (
                              <option key={brand.id} value={brand.id}>
                                {brand.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Estimated Value</label>
                          <input
                            type="number"
                            value={discussion.estimated_value}
                            onChange={(e) => updateBrandDiscussion(index, 'estimated_value', e.target.value)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={discussion.is_required}
                            onChange={(e) => updateBrandDiscussion(index, 'is_required', e.target.checked)}
                            style={{ marginRight: '0.5rem' }}
                          />
                          Product Required
                        </label>
                      </div>
                      <div className="form-group">
                        <label>Notes</label>
                        <textarea
                          value={discussion.notes}
                          onChange={(e) => updateBrandDiscussion(index, 'notes', e.target.value)}
                          placeholder="Discussion notes"
                          style={{ minHeight: '60px' }}
                        />
                      </div>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removeBrandDiscussion(index)}
                        style={{ marginTop: '0.5rem' }}
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Action Items */}
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>Action Items</label>
                    <button type="button" className="btn btn-secondary" onClick={addActionItem}>
                      <Plus size={16} /> Add Action Item
                    </button>
                  </div>
                  {formData.action_items.map((item, index) => (
                    <div key={index} style={{ padding: '1rem', background: 'var(--gray-50)', borderRadius: '8px', marginTop: '0.5rem' }}>
                      <div className="form-group">
                        <label>Description</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateActionItem(index, 'description', e.target.value)}
                          placeholder="Action item description"
                        />
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Due Date</label>
                          <input
                            type="date"
                            value={item.due_date}
                            onChange={(e) => updateActionItem(index, 'due_date', e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={(e) => updateActionItem(index, 'completed', e.target.checked)}
                              style={{ marginRight: '0.5rem' }}
                            />
                            Completed
                          </label>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() => removeActionItem(index)}
                        style={{ marginTop: '0.5rem' }}
                      >
                        <Trash2 size={16} /> Remove
                      </button>
                    </div>
                  ))}
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingMeeting ? 'Update Meeting' : 'Create Meeting'}
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

export default MeetingsManager;
