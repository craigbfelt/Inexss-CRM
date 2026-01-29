import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Edit2, Trash2, Search, Filter, X, Mail, Phone, MapPin, Building } from 'lucide-react';
import { api } from '../utils/api';
import './ClientsManager.css';

const ClientsManager = ({ user }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    type: 'Architect',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      province: '',
      postalCode: ''
    },
    notes: ''
  });

  const canEdit = !['contractor', 'supplier'].includes(user?.role);

  useEffect(() => {
    fetchClients();
  }, [filterType]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const params = filterType !== 'all' ? { type: filterType } : {};
      const response = await api.getClients(params);
      setClients(response.data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await api.updateClient(editingClient._id, formData);
      } else {
        await api.createClient(formData);
      }
      setShowModal(false);
      setEditingClient(null);
      resetForm();
      fetchClients();
    } catch (error) {
      console.error('Failed to save client:', error);
      alert(error.response?.data?.error || 'Failed to save client');
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      company: client.company || '',
      type: client.type,
      email: client.email || '',
      phone: client.phone || '',
      address: client.address || {
        street: '',
        city: '',
        province: '',
        postalCode: ''
      },
      notes: client.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        await api.deleteClient(id);
        fetchClients();
      } catch (error) {
        console.error('Failed to delete client:', error);
        alert(error.response?.data?.error || 'Failed to delete client');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      company: '',
      type: 'Architect',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        province: '',
        postalCode: ''
      },
      notes: ''
    });
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clientTypes = ['Architect', 'Developer', 'Contractor', 'Other'];
  const clientTypeColors = {
    'Architect': 'linear-gradient(135deg, #667eea, #764ba2)',
    'Developer': 'linear-gradient(135deg, #f093fb, #f5576c)',
    'Contractor': 'linear-gradient(135deg, #4facfe, #00f2fe)',
    'Other': 'linear-gradient(135deg, #43e97b, #38f9d7)'
  };

  return (
    <div className="clients-manager">
      {/* Header */}
      <div className="manager-header">
        <div className="header-left">
          <div className="header-icon">
            <Users size={32} />
          </div>
          <div>
            <h1>Clients & Architects</h1>
            <p>{filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        
        {canEdit && (
          <motion.button
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingClient(null);
              resetForm();
              setShowModal(true);
            }}
          >
            <Plus size={20} />
            Add Client
          </motion.button>
        )}
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All
          </button>
          {clientTypes.map(type => (
            <button
              key={type}
              className={`filter-btn ${filterType === type ? 'active' : ''}`}
              onClick={() => setFilterType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Grid */}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="clients-grid">
          <AnimatePresence>
            {filteredClients.map((client, index) => (
              <motion.div
                key={client._id}
                className="client-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <div className="client-card-header">
                  <div 
                    className="client-type-badge"
                    style={{ background: clientTypeColors[client.type] }}
                  >
                    {client.type}
                  </div>
                  {canEdit && (
                    <div className="client-actions">
                      <button 
                        className="action-btn edit"
                        onClick={() => handleEdit(client)}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDelete(client._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="client-info">
                  <h3>{client.name}</h3>
                  {client.company && (
                    <div className="info-row">
                      <Building size={16} />
                      <span>{client.company}</span>
                    </div>
                  )}
                  {client.email && (
                    <div className="info-row">
                      <Mail size={16} />
                      <span>{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="info-row">
                      <Phone size={16} />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.address?.city && (
                    <div className="info-row">
                      <MapPin size={16} />
                      <span>{client.address.city}</span>
                    </div>
                  )}
                </div>

                {client.notes && (
                  <div className="client-notes">
                    {client.notes.length > 100 
                      ? client.notes.substring(0, 100) + '...' 
                      : client.notes}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

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
                <h2>{editingClient ? 'Edit Client' : 'Add New Client'}</h2>
                <button 
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Company</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Type *</label>
                    <select
                      className="input"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      {clientTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      className="input"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    className="input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    className="input"
                    value={formData.address.street}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, street: e.target.value }
                    })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.address.city}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        address: { ...formData.address, city: e.target.value }
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Province</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.address.province}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        address: { ...formData.address, province: e.target.value }
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      className="input"
                      value={formData.address.postalCode}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        address: { ...formData.address, postalCode: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    className="input"
                    rows="4"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editingClient ? 'Update Client' : 'Add Client'}
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

export default ClientsManager;
