const Project = require('../models/Project');

exports.createProject = async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      createdBy: req.userId
    });
    await project.save();
    
    const populatedProject = await Project.findById(project._id)
      .populate('client', 'name company')
      .populate('brandsInvolved', 'name')
      .populate('createdBy', 'name');
    
    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project', details: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const { status, client, brand } = req.query;
    const filter = {};
    
    if (status) {
      filter.status = status;
    }
    
    if (client) {
      filter.client = client;
    }

    if (brand) {
      filter.brandsInvolved = brand;
    }

    // Contractors can only see projects they created
    if (req.user.role === 'contractor') {
      filter.createdBy = req.userId;
    }

    let projects = await Project.find(filter)
      .populate('client', 'name company')
      .populate('brandsInvolved', 'name')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    // Filter by brand for brand representatives and suppliers
    if (req.brandFilter) {
      projects = projects.filter(project => 
        project.brandsInvolved.some(brand => 
          req.brandFilter.some(bf => bf.toString() === brand._id.toString())
        )
      );
    }
    
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects', details: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name company email phone')
      .populate('brandsInvolved', 'name category')
      .populate('createdBy', 'name location');
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check brand access for brand representatives
    if (req.brandFilter) {
      const hasBrandAccess = project.brandsInvolved.some(brand => 
        req.brandFilter.some(bf => bf.toString() === brand._id.toString())
      );
      
      if (!hasBrandAccess) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch project', details: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    )
      .populate('client', 'name company')
      .populate('brandsInvolved', 'name')
      .populate('createdBy', 'name');
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update project', details: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete project', details: error.message });
  }
};
