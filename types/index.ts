export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'administrator' | 'super_admin' | 'sub_admin' | 'user';
  organizationId?: string;
  parentId?: string;
  permissions: Permission[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Permission {
  resource: string;
  actions: string[];
}

export interface Lead {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  source: string;
  value?: number;
  assignedTo: string;
  organizationId: string;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  _id: string;
  name: string;
  domain: string;
  superAdminId: string;
  settings: OrganizationSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationSettings {
  allowUserRegistration: boolean;
  maxUsers: number;
  features: string[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: User['role'];
  organizationId?: string;
  permissions: Permission[];
}