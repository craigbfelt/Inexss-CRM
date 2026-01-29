const Brand = require('../models/Brand');

exports.createBrand = async (req, res) => {
  try {
    const brand = new Brand({
      ...req.body,
      createdBy: req.userId
    });
    await brand.save();
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create brand', details: error.message });
  }
};

exports.getAllBrands = async (req, res) => {
  try {
    const { isActive } = req.query;
    const filter = {};
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    // Filter by brand access for brand representatives
    if (req.brandFilter) {
      filter._id = { $in: req.brandFilter };
    }

    const brands = await Brand.find(filter)
      .populate('createdBy', 'name')
      .sort({ name: 1 });
    
    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch brands', details: error.message });
  }
};

exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id)
      .populate('createdBy', 'name');
    
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    // Check brand access for brand representatives
    if (req.brandFilter && !req.brandFilter.includes(brand._id)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch brand', details: error.message });
  }
};

exports.updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update brand', details: error.message });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }

    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete brand', details: error.message });
  }
};
