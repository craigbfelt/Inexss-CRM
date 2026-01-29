const mongoose = require('mongoose');

const brandDiscussionSchema = new mongoose.Schema({
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    required: true
  },
  isRequired: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String
  },
  estimatedValue: {
    type: Number
  }
});

const meetingSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  meetingDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    trim: true
  },
  attendees: [{
    type: String,
    trim: true
  }],
  brandsDiscussed: [brandDiscussionSchema],
  summary: {
    type: String
  },
  actionItems: [{
    description: String,
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    dueDate: Date,
    completed: {
      type: Boolean,
      default: false
    }
  }],
  followUpDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

meetingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Meeting', meetingSchema);
