'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Building2, 
  Users, 
  Settings, 
  Crown, 
  Shield,
  Globe,
  Mail,
  Calendar,
  Activity
} from 'lucide-react';

interface OrganizationData {
  name: string;
  domain: string;
  superAdmin: any;
  settings: {
    allowUserRegistration: boolean;
    maxUsers: number;
    features: string[];
  };
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalLeads: number;
    monthlyLeads: number;
  };
  createdAt: Date;
}

export default function OrganizationPage() {
  const { data: session } = useSession();
  const [orgData, setOrgData] = useState<OrganizationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const user = session?.user as any;

  useEffect(() => {
    fetchOrganizationData();
  }, []);

  const fetchOrganizationData = async () => {
    try {
      const response = await fetch('/api/organization');
      if (response.ok) {
        const data = await response.json();
        setOrgData(data);
      }
    } catch (error) {
      console.error('Error fetching organization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (setting: string, value: any) => {
    setSaving(true);
    try {
      const response = await fetch('/api/organization/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [setting]: value })
      });

      if (response.ok) {
        setOrgData(prev => prev ? {
          ...prev,
          settings: { ...prev.settings, [setting]: value }
        } : null);
      }
    } catch (error) {
      console.error('Error updating setting:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Loading organization...</p>
        </div>
      </div>
    );
  }

  if (!orgData) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Organization Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Unable to load organization information.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Organization</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your organization settings and information
          </p>
        </div>
        <Badge variant="secondary" className="capitalize">
          {user?.role?.replace('_', ' ')}
        </Badge>
      </div>

      {/* Organization Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="mr-2 h-5 w-5 text-blue-600" />
              Organization Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Organization Name
              </Label>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {orgData.name}
              </p>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Domain
              </Label>
              <div className="flex items-center mt-1">
                <Globe className="h-4 w-4 text-gray-500 mr-2" />
                <p className="text-gray-900 dark:text-white">{orgData.domain}</p>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Created Date
              </Label>
              <div className="flex items-center mt-1">
                <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                <p className="text-gray-900 dark:text-white">
                  {new Date(orgData.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="mr-2 h-5 w-5 text-yellow-600" />
              Super Administrator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold">
                {orgData.superAdmin?.name?.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {orgData.superAdmin?.name}
                </p>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="h-3 w-3 mr-1" />
                  {orgData.superAdmin?.email}
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                <Crown className="h-3 w-3 mr-1" />
                Super Administrator
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {orgData.stats.totalUsers}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Activity className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-2xl font-bold text-green-600">
                {orgData.stats.activeUsers}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {orgData.stats.totalLeads}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
              <span className="text-2xl font-bold text-indigo-600">
                {orgData.stats.monthlyLeads}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Organization Settings */}
      {(user?.role === 'administrator' || user?.role === 'super_admin') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-gray-600" />
              Organization Settings
            </CardTitle>
            <CardDescription>
              Configure organization preferences and limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Allow User Registration</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Allow new users to register for your organization
                </p>
              </div>
              <Switch
                checked={orgData.settings.allowUserRegistration}
                onCheckedChange={(checked) => handleSettingChange('allowUserRegistration', checked)}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxUsers">Maximum Users</Label>
              <Input
                id="maxUsers"
                type="number"
                min="1"
                max="1000"
                value={orgData.settings.maxUsers}
                onChange={(e) => handleSettingChange('maxUsers', parseInt(e.target.value))}
                className="max-w-xs"
                disabled={saving}
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Maximum number of users allowed in your organization
              </p>
            </div>

            <div className="space-y-2">
              <Label>Active Features</Label>
              <div className="flex flex-wrap gap-2">
                {orgData.settings.features.map((feature, index) => (
                  <Badge key={index} variant="secondary">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}