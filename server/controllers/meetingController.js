const Meeting = require('../models/Meeting');
const Brand = require('../models/Brand');

exports.createMeeting = async (req, res) => {
  try {
    const meeting = new Meeting({
      ...req.body,
      createdBy: req.userId
    });
    await meeting.save();
    
    const populatedMeeting = await Meeting.findById(meeting._id)
      .populate('client', 'name company')
      .populate('project', 'name projectNumber')
      .populate('brandsDiscussed.brand', 'name')
      .populate('createdBy', 'name');
    
    res.status(201).json(populatedMeeting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create meeting', details: error.message });
  }
};

exports.getAllMeetings = async (req, res) => {
  try {
    const { startDate, endDate, client, status, brand } = req.query;
    const filter = {};
    
    if (startDate || endDate) {
      filter.meetingDate = {};
      if (startDate) filter.meetingDate.$gte = new Date(startDate);
      if (endDate) filter.meetingDate.$lte = new Date(endDate);
    }
    
    if (client) {
      filter.client = client;
    }
    
    if (status) {
      filter.status = status;
    }

    // Contractors can only see meetings they created
    if (req.user.role === 'contractor') {
      filter.createdBy = req.userId;
    }

    let meetings = await Meeting.find(filter)
      .populate('client', 'name company')
      .populate('project', 'name projectNumber')
      .populate('brandsDiscussed.brand', 'name')
      .populate('createdBy', 'name')
      .populate('actionItems.assignedTo', 'name')
      .sort({ meetingDate: -1 });

    // Filter by brand for brand representatives and suppliers
    if (req.brandFilter || brand) {
      const brandIds = brand ? [brand] : req.brandFilter;
      meetings = meetings.filter(meeting => 
        meeting.brandsDiscussed.some(bd => 
          brandIds.some(bid => bd.brand._id.toString() === bid.toString())
        )
      );
    }
    
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meetings', details: error.message });
  }
};

exports.getMeetingById = async (req, res) => {
  try {
    const meeting = await Meeting.findById(req.params.id)
      .populate('client', 'name company email phone')
      .populate('project', 'name projectNumber')
      .populate('brandsDiscussed.brand', 'name category')
      .populate('createdBy', 'name location')
      .populate('actionItems.assignedTo', 'name');
    
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    // Check brand access for brand representatives
    if (req.brandFilter) {
      const hasBrandAccess = meeting.brandsDiscussed.some(bd => 
        req.brandFilter.some(bf => bf.toString() === bd.brand._id.toString())
      );
      
      if (!hasBrandAccess) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meeting', details: error.message });
  }
};

exports.updateMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    )
      .populate('client', 'name company')
      .populate('project', 'name projectNumber')
      .populate('brandsDiscussed.brand', 'name')
      .populate('createdBy', 'name');
    
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    res.json(meeting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update meeting', details: error.message });
  }
};

exports.deleteMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndDelete(req.params.id);
    
    if (!meeting) {
      return res.status(404).json({ error: 'Meeting not found' });
    }

    res.json({ message: 'Meeting deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete meeting', details: error.message });
  }
};

// Monthly report generation
exports.getMonthlyReport = async (req, res) => {
  try {
    const { year, month, brand } = req.query;
    
    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month are required' });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const filter = {
      meetingDate: { $gte: startDate, $lte: endDate },
      status: 'Completed'
    };

    let meetings = await Meeting.find(filter)
      .populate('client', 'name company')
      .populate('project', 'name projectNumber')
      .populate('brandsDiscussed.brand', 'name')
      .populate('createdBy', 'name location')
      .sort({ meetingDate: 1 });

    // Filter by brand if specified or for brand representatives
    if (req.brandFilter || brand) {
      const brandIds = brand ? [brand] : req.brandFilter;
      meetings = meetings.filter(meeting => 
        meeting.brandsDiscussed.some(bd => 
          brandIds.some(bid => bd.brand._id.toString() === bid.toString())
        )
      );
    }

    // Generate summary statistics
    const summary = {
      totalMeetings: meetings.length,
      uniqueClients: [...new Set(meetings.map(m => m.client._id.toString()))].length,
      brandsDiscussed: {},
      meetingsByLocation: {},
      hitRate: {}
    };

    meetings.forEach(meeting => {
      // Count by location
      const location = meeting.createdBy?.location || 'Other';
      summary.meetingsByLocation[location] = (summary.meetingsByLocation[location] || 0) + 1;

      // Count brands discussed and required
      meeting.brandsDiscussed.forEach(bd => {
        const brandName = bd.brand.name;
        if (!summary.brandsDiscussed[brandName]) {
          summary.brandsDiscussed[brandName] = { discussed: 0, required: 0 };
        }
        summary.brandsDiscussed[brandName].discussed++;
        if (bd.isRequired) {
          summary.brandsDiscussed[brandName].required++;
        }
      });
    });

    // Calculate hit rate (percentage of meetings where brand was required)
    Object.keys(summary.brandsDiscussed).forEach(brandName => {
      const stats = summary.brandsDiscussed[brandName];
      summary.hitRate[brandName] = stats.discussed > 0 
        ? Math.round((stats.required / stats.discussed) * 100) 
        : 0;
    });

    res.json({
      period: { year: parseInt(year), month: parseInt(month) },
      summary,
      meetings
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report', details: error.message });
  }
};
