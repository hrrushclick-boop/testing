import { AuthUser, Permission } from '@/types';

export const PERMISSIONS = {
  LEADS: {
    VIEW: 'leads:view',
    CREATE: 'leads:create',
    UPDATE: 'leads:update',
    DELETE: 'leads:delete',
    ASSIGN: 'leads:assign'
  },
  USERS: {
    VIEW: 'users:view',
    CREATE: 'users:create',
    UPDATE: 'users:update',
    DELETE: 'users:delete',
    MANAGE_PERMISSIONS: 'users:manage_permissions'
  },
  ORGANIZATION: {
    VIEW: 'organization:view',
    UPDATE: 'organization:update',
    SETTINGS: 'organization:settings'
  }
};

export const DEFAULT_PERMISSIONS = {
  administrator: [
    { resource: 'users', actions: ['view', 'create', 'update', 'delete', 'manage_permissions'] },
    { resource: 'organization', actions: ['view', 'update', 'settings'] },
    { resource: 'leads', actions: ['view', 'create', 'update', 'delete', 'assign'] }
  ],
  super_admin: [
    { resource: 'users', actions: ['view', 'create', 'update'] },
    { resource: 'organization', actions: ['view', 'update'] },
    { resource: 'leads', actions: ['view', 'create', 'update', 'delete', 'assign'] }
  ],
  sub_admin: [
    { resource: 'users', actions: ['view', 'create'] },
    { resource: 'leads', actions: ['view', 'create', 'update', 'assign'] }
  ],
  user: [
    { resource: 'leads', actions: ['view', 'create', 'update'] }
  ]
};

export function hasPermission(
  user: AuthUser | null, 
  resource: string, 
  action: string
): boolean {
  if (!user) return false;
  
  if (user.role === 'administrator') return true;
  
  const permission = user.permissions.find(p => p.resource === resource);
  return permission ? permission.actions.includes(action) : false;
}

export function canAccessRole(currentRole: string, targetRole: string): boolean {
  const hierarchy = ['administrator', 'super_admin', 'sub_admin', 'user'];
  const currentIndex = hierarchy.indexOf(currentRole);
  const targetIndex = hierarchy.indexOf(targetRole);
  
  return currentIndex < targetIndex;
}