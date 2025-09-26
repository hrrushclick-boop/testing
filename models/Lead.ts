import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: true 
  },
  lastName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true,
    lowercase: true 
  },
  phone: String,
  company: String,
  status: { 
    type: String, 
    enum: ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'],
    default: 'new' 
  },
  source: { 
    type: String, 
    required: true 
  },
  value: { 
    type: Number, 
    default: 0 
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  organizationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organization',
    required: true 
  },
  notes: String,
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  }
}, {
  timestamps: true
});

leadSchema.index({ organizationId: 1, status: 1 });
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ email: 1 });

export const Lead = mongoose.models.Lead || mongoose.model('Lead', leadSchema);