'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Users, Eye, CreditCard as Edit, Trash2, Plus, Settings, Crown, UserPlus } from 'lucide-react';
import { PERMISSIONS } from '@/lib/permissions';

const permissionIcons = {
  view: Eye,
  create: Plus,
  update: Edit,
  delete: Trash2,
  assign: UserPlus,
  manage_permissions: Crown,
  settings: Settings
};

const resourceNames = {
  leads: 'Lead Management',
  users: 'User Management', 
  organization: 'Organization'
};

export default function PermissionsPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const currentUser = session?.user as any;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.filter((user: any) => user.role !== 'administrator'));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (resource: string, action: string, checked: boolean) => {
    if (!selectedUser) return;

    setSelectedUser((prev: any) => {
      const updatedPermissions = [...prev.permissions];
      const resourceIndex = updatedPermissions.findIndex(p => p.resource === resource);

      if (resourceIndex >= 0) {
        const permission = updatedPermissions[resourceIndex];
        if (checked) {
          if (!permission.actions.includes(action)) {
            permission.actions.push(action);
          }
        } else {
          permission.actions = permission.actions.filter(a => a !== action);
        }
        
        // Remove empty permissions
        if (permission.actions.length === 0) {
          updatedPermissions.splice(resourceIndex, 1);
        }
      } else if (checked) {
        updatedPermissions.push({
          resource,
          actions: [action]
        });
      }

      return {
        ...prev,
        permissions: updatedPermissions
      };
    });
  };

  const savePermissions = async () => {
    if (!selectedUser) return;

    setSaving(true);
    setMessage('');

    try {
      const response = await fetch(`/api/users/${selectedUser._id}/permissions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: selectedUser.permissions })
      });

      if (response.ok) {
        setMessage('Permissions updated successfully!');
        fetchUsers(); // Refresh the users list
      } else {
        setMessage('Failed to update permissions');
      }
    } catch (error) {
      setMessage('An error occurred while updating permissions');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Permissions</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage user permissions and access control
          </p>
        </div>
        <Badge variant="secondary">
          <Crown className="h-3 w-3 mr-1" />
          Admin Access Required
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Users
            </CardTitle>
            <CardDescription>
              Select a user to manage their permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {users.map((user: any) => (
                <div
                  key={user._id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedUser?._id === user._id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm opacity-75">{user.email}</div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={selectedUser?._id === user._id ? 'bg-primary-foreground text-primary' : ''}
                    >
                      {user.role.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Permission Matrix */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                {selectedUser ? `Permissions for ${selectedUser.name}` : 'Select User'}
              </CardTitle>
              <CardDescription>
                {selectedUser 
                  ? 'Configure specific permissions for this user'
                  : 'Choose a user from the left to manage their permissions'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedUser ? (
                <div className="space-y-6">
                  {Object.entries(resourceNames).map(([resource, name]) => {
                    const userPermission = selectedUser.permissions.find((p: any) => p.resource === resource);
                    const userActions = userPermission?.actions || [];

                    return (
                      <div key={resource} className="space-y-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {name}
                        </h3>
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                          {Object.entries(PERMISSIONS[resource.toUpperCase() as keyof typeof PERMISSIONS] || {}).map(([actionKey, permission]) => {
                            const action = permission.split(':')[1];
                            const Icon = permissionIcons[action as keyof typeof permissionIcons] || Eye;
                            const isChecked = userActions.includes(action);

                            return (
                              <div key={action} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <Checkbox
                                  id={`${resource}-${action}`}
                                  checked={isChecked}
                                  onCheckedChange={(checked) => 
                                    handlePermissionChange(resource, action, checked as boolean)
                                  }
                                />
                                <div className="flex items-center space-x-2 flex-1">
                                  <Icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                                  <label 
                                    htmlFor={`${resource}-${action}`}
                                    className="text-sm font-medium capitalize cursor-pointer"
                                  >
                                    {action.replace('_', ' ')}
                                  </label>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {message && (
                    <Alert className={message.includes('success') ? 'border-green-200' : 'border-red-200'}>
                      <AlertDescription>{message}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex justify-end pt-6 border-t">
                    <Button onClick={savePermissions} disabled={saving}>
                      {saving ? 'Saving...' : 'Save Permissions'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Shield className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Select a user to view and edit their permissions</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}