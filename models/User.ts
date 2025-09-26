import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Permission } from '@/types';

const permissionSchema = new mongoose.Schema({
  resource: { type: String, required: true },
  actions: [{ type: String, required: true }]
});

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['administrator', 'super_admin', 'sub_admin', 'user'],
    required: true 
  },
  organizationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Organization',
    required: function() {
      return this.role !== 'administrator';
    }
  },
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  permissions: [permissionSchema],
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.models.User || mongoose.model('User', userSchema);