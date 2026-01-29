const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  projectNumber: {
    type: String,
    trim: true
  },
  description: {
    type: String
  },
  location: {
    street: String,
    city: String,
    province: String
  },
  status: {
    type: String,
    enum: ['Lead', 'Quoted', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
    default: 'Lead'
  },
  startDate: {
    type: Date
  },
  expectedCompletionDate: {
    type: Date
  },
  estimatedValue: {
    type: Number
  },
  brandsInvolved: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand'
  }],
  notes: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Project', projectSchema);
