const Client = require('../models/Client');

exports.createClient = async (req, res) => {
  try {
    const client = new Client({
      ...req.body,
      createdBy: req.userId
    });
    await client.save();
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create client', details: error.message });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const { isActive, type } = req.query;
    const filter = {};
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    if (type) {
      filter.type = type;
    }

    const clients = await Client.find(filter)
      .populate('createdBy', 'name')
      .sort({ name: 1 });
    
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clients', details: error.message });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id)
      .populate('createdBy', 'name');
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch client', details: error.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update client', details: error.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete client', details: error.message });
  }
};
