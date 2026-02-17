import { useState } from 'react';
import { Plus, Search, Briefcase, Edit2, Trash2, Calendar, DollarSign } from 'lucide-react';
import { Card, Button, Input, Modal, Table, Loading } from '../components';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '../hooks/useProjects';
import { useContacts } from '../hooks/useContacts';
import { useAuth } from '../hooks/useAuth';

const PROJECT_STATUSES = ['Lead', 'Quoted', 'In Progress', 'Completed', 'On Hold', 'Cancelled'];

const STATUS_COLORS = {
  'Lead': 'bg-yellow-100 text-yellow-800',
  'Quoted': 'bg-blue-100 text-blue-800',
  'In Progress': 'bg-green-100 text-green-800',
  'Completed': 'bg-purple-100 text-purple-800',
  'On Hold': 'bg-orange-100 text-orange-800',
  'Cancelled': 'bg-red-100 text-red-800',
};

export default function Projects() {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  const { data: projects = [], isLoading } = useProjects();
  const { data: contacts = [] } = useContacts();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [formData, setFormData] = useState({
    name: '',
    client_id: '',
    project_number: '',
    description: '',
    location_street: '',
    location_city: '',
    location_province: '',
    status: 'Lead',
    start_date: '',
    expected_completion_date: '',
    estimated_value: '',
    notes: '',
  });

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name || '',
        client_id: project.client_id || '',
        project_number: project.project_number || '',
        description: project.description || '',
        location_street: project.location_street || '',
        location_city: project.location_city || '',
        location_province: project.location_province || '',
        status: project.status || 'Lead',
        start_date: project.start_date || '',
        expected_completion_date: project.expected_completion_date || '',
        estimated_value: project.estimated_value || '',
        notes: project.notes || '',
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        client_id: '',
        project_number: '',
        description: '',
        location_street: '',
        location_city: '',
        location_province: '',
        status: 'Lead',
        start_date: '',
        expected_completion_date: '',
        estimated_value: '',
        notes: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({
      name: '',
      client_id: '',
      project_number: '',
      description: '',
      location_street: '',
      location_city: '',
      location_province: '',
      status: 'Lead',
      start_date: '',
      expected_completion_date: '',
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

      if (editingProject) {
        await updateProject.mutateAsync({ id: editingProject.id, ...submitData });
      } else {
        await createProject.mutateAsync({
          ...submitData,
          created_by: user?.id,
        });
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject.mutateAsync(id);
      } catch (error) {
        console.error('Error deleting project:', error);
      }
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

  const getClientName = (clientId) => {
    const client = contacts.find(c => c.id === clientId);
    return client?.name || 'N/A';
  };

  const filteredAndSortedProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.project_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getClientName(project.client_id)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.location_city?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || project.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];

      if (sortColumn === 'client_id') {
        aValue = getClientName(a.client_id);
        bValue = getClientName(b.client_id);
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
      label: 'Project Name',
      sortable: true,
      render: (project) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-apple-sm">
              <Briefcase className="h-5 w-5" />
            </div>
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{project.name || 'N/A'}</div>
            {project.project_number && (
              <div className="text-gray-500 text-xs">#{project.project_number}</div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'client_id',
      label: 'Client',
      sortable: true,
      render: (project) => (
        <div className="text-gray-900">{getClientName(project.client_id)}</div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (project) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[project.status] || 'bg-gray-100 text-gray-800'}`}>
          {project.status || 'N/A'}
        </span>
      ),
    },
    {
      key: 'estimated_value',
      label: 'Estimated Value',
      sortable: true,
      render: (project) => (
        <div className="flex items-center text-gray-900">
          <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
          {formatCurrency(project.estimated_value)}
        </div>
      ),
    },
    {
      key: 'start_date',
      label: 'Start Date',
      sortable: true,
      render: (project) => (
        <div className="flex items-center text-gray-900">
          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
          {formatDate(project.start_date)}
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      sortable: false,
      render: (project) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenModal(project)}
            className="p-2 text-apple-blue hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(project.id)}
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Projects
          </h1>
          <p className="mt-2 text-gray-600">Manage your projects and deliverables</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="h-5 w-5 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Search and Filter */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-300 rounded-xl focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 focus:outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-xl focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 focus:outline-none transition-all"
            >
              <option value="All">All Statuses</option>
              {PROJECT_STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredAndSortedProjects}
        onSort={handleSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Project Name"
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

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Project Number"
              placeholder="PRJ-2024-001"
              value={formData.project_number}
              onChange={(e) => setFormData({ ...formData, project_number: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/20 focus:outline-none transition-all"
              >
                {PROJECT_STATUSES.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

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

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
            <Input
              label="Expected Completion Date"
              type="date"
              value={formData.expected_completion_date}
              onChange={(e) => setFormData({ ...formData, expected_completion_date: e.target.value })}
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
            <Button type="submit" disabled={createProject.isPending || updateProject.isPending}>
              {editingProject ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
