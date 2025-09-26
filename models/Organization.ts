import mongoose from 'mongoose';

const organizationSettingsSchema = new mongoose.Schema({
  allowUserRegistration: { 
    type: Boolean, 
    default: false 
  },
  maxUsers: { 
    type: Number, 
    default: 10 
  },
  features: [{ 
    type: String 
  }]
});

const organizationSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  domain: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true 
  },
  superAdminId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  settings: {
    type: organizationSettingsSchema,
    default: () => ({})
  }
}, {
  timestamps: true
});

export const Organization = mongoose.models.Organization || mongoose.model('Organization', organizationSchema);