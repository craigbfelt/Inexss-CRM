import { useState } from 'react';
import { Plus, Search, Target, Edit2, Trash2, DollarSign, Calendar, Mail, Phone, ChevronDown } from 'lucide-react';
import { Card, Button, Input, Modal, Table, Loading } from '../components';
import { useLeads, useCreateLead, useUpdateLead, useConvertLead, useDeleteLead } from '../hooks/useLeads';
import { useContacts } from '../hooks/useContacts';
import { useAuth } from '../hooks/useAuth';

const CONVERT_STATUSES = ['Quoted', 'In Progress'];

export default function Leads() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [convertingLeadId, setConvertingLeadId] = useState(null);

  const { data: leads = [], isLoading, error } = useLeads();
  const { data: contacts = [] } = useContacts();
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const convertLead = useConvertLead();
  const deleteLead = useDeleteLead();

  const [formData, setFormData] = useState({
    name: '',
    client_id: '',
    project_number: '',
    description: '',
    location_street: '',
    location_city: '',
    location_province: '',
    estimated_value: '',
    notes: '',
  });

  const handleOpenModal = (lead = null) => {
    if (lead) {
      setEditingLead(lead);
      setFormData({
        name: lead.name || '',
        client_id: lead.client_id || '',
        project_number: lead.project_number || '',
        description: lead.description || '',
        location_street: lead.location_street || '',
        location_city: lead.location_city || '',
        location_province: lead.location_province || '',
        estimated_value: lead.estimated_value || '',
        notes: lead.notes || '',
      });
    } else {
      setEditingLead(null);
      setFormData({
        name: '',
        client_id: '',
        project_number: '',
        description: '',
        location_street: '',
        location_city: '',
        location_province: '',
        estimated_value: '',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLead(null);
    setFormData({
      name: '',
      client_id: '',
      project_number: '',
      description: '',
      location_street: '',
      location_city: '',
      location_province: '',
      estimated_value: '',
      notes: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        estimated_value: formData.estimated_value ? parseFloat(formData.estimated_value) : null,
      };

      if (editingLead) {
        await updateLead.mutateAsync({ id: editingLead.id, ...submitData });
      } else {
        await createLead.mutateAsync({
          ...submitData,
          created_by: user?.id,
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await deleteLead.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  const handleConvertLead = async (leadId, newStatus) => {
    try {
      await convertLead.mutateAsync({ id: leadId, newStatus });
      setConvertingLeadId(null);
    } catch (error) {
      console.error('Error converting lead:', error);
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return 'N/A';
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getClientInfo = (clientId) => {
    const client = contacts.find(c => c.id === clientId);
    return client || null;
  };

  const filteredAndSortedLeads = leads
    .filter((lead) => {
      const client = getClientInfo(lead.client_id);
      const matchesSearch =
        lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.project_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client?.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.location_city?.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    })
    .sort((a, b) => {
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];

      if (sortColumn === 'client_id') {
        const clientA = getClientInfo(a.client_id);
        const clientB = getClientInfo(b.client_id);
        aValue = clientA?.name || '';
        bValue = clientB?.name || '';
      }

      aValue = aValue || '';
      bValue = bValue || '';

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

  const columns = [
    {
      key: 'name',
      label: 'Lead Name',
      sortable: true,
      render: (lead) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white font-semibold shadow-apple-sm">
              <Target className="h-5 w-5" />
            </div>
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{lead.name || 'N/A'}</div>
            {lead.project_number && (
              <div className="text-gray-500 text-xs">#{lead.project_number}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'client_id',
      label: 'Client',
      sortable: true,
      render: (lead) => {
        const client = getClientInfo(lead.client_id);
        return (
          <div>
            <div className="font-medium text-gray-900">{client?.name || 'N/A'}</div>
            {client && (
              <div className="text-xs text-gray-500 space-y-1 mt-1">
                {client.email && (
                  <div className="flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    {client.email}
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    {client.phone}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: 'estimated_value',
      label: 'Estimated Value',
      sortable: true,
      render: (lead) => (
        <div className="flex items-center text-gray-900">
          <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
          {formatCurrency(lead.estimated_value)}
        </div>
      ),
    },
    {
      key: 'created_at',
      label: 'Created Date',
      sortable: true,
      render: (lead) => (
        <div className="flex items-center text-gray-900">
          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
          {formatDate(lead.created_at)}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (lead) => (
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setConvertingLeadId(convertingLeadId === lead.id ? null : lead.id)}
              className="px-3 py-1.5 text-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg transition-all flex items-center gap-1 shadow-apple-sm"
            >
              Convert
              <ChevronDown className="h-3 w-3" />
            </button>
            {convertingLeadId === lead.id && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-apple-lg border border-gray-200 py-1 z-10">
                {CONVERT_STATUSES.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleConvertLead(lead.id, status)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => handleOpenModal(lead)}
            className="p-2 text-apple-blue hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(lead.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <Loading fullScreen />;
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Leads
          </h1>
          <p className="mt-2 text-gray-600">Track and manage your sales leads</p>
        </div>
        <Card className="text-center py-12">
          <div className="text-red-600">
            <p className="font-semibold mb-2">Error loading leads</p>
            <p className="text-sm">{error.message}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Leads
          </h1>
          <p className="mt-2 text-gray-600">Track and manage your sales leads</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-5 w-5 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-300 rounded-xl focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredAndSortedLeads}
        onSort={handleSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingLead ? 'Edit Lead' : 'Add New Lead'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Lead Name"
            placeholder="New Office Building"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.client_id}
              onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 focus:outline-none transition-all"
              required
            >
              <option value="">Select a client</option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.name} {contact.company ? `(${contact.company})` : ''}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Project Number"
            placeholder="PRJ-2024-001"
            value={formData.project_number}
            onChange={(e) => setFormData({ ...formData, project_number: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows="3"
              placeholder="Project description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 focus:outline-none transition-all resize-none"
            />
          </div>

          <Input
            label="Street Address"
            placeholder="123 Main Street"
            value={formData.location_street}
            onChange={(e) => setFormData({ ...formData, location_street: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              placeholder="Johannesburg"
              value={formData.location_city}
              onChange={(e) => setFormData({ ...formData, location_city: e.target.value })}
            />
            <Input
              label="Province"
              placeholder="Gauteng"
              value={formData.location_province}
              onChange={(e) => setFormData({ ...formData, location_province: e.target.value })}
            />
          </div>

          <Input
            label="Estimated Value"
            type="number"
            placeholder="150000"
            value={formData.estimated_value}
            onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })}
            step="0.01"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              rows="3"
              placeholder="Additional notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 focus:outline-none transition-all resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button type="submit" disabled={createLead.isPending || updateLead.isPending}>
              {editingLead ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
