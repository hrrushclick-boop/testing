'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ContactRound, 
  Users, 
  TrendingUp, 
  Building2,
  UserPlus,
  Target,
  DollarSign,
  Clock
} from 'lucide-react';

const stats = [
  {
    title: 'Total Leads',
    value: '1,234',
    change: '+12.3%',
    icon: ContactRound,
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    title: 'Active Users',
    value: '56',
    change: '+5.4%',
    icon: Users,
    color: 'text-green-600 dark:text-green-400'
  },
  {
    title: 'Conversion Rate',
    value: '23.4%',
    change: '+2.1%',
    icon: TrendingUp,
    color: 'text-purple-600 dark:text-purple-400'
  },
  {
    title: 'Revenue',
    value: '$45,678',
    change: '+8.9%',
    icon: DollarSign,
    color: 'text-emerald-600 dark:text-emerald-400'
  }
];

const recentActivity = [
  {
    action: 'New lead created',
    user: 'John Smith',
    time: '2 minutes ago',
    type: 'lead'
  },
  {
    action: 'User registered',
    user: 'Sarah Johnson',
    time: '15 minutes ago',
    type: 'user'
  },
  {
    action: 'Lead qualified',
    user: 'Mike Wilson',
    time: '1 hour ago',
    type: 'qualified'
  },
  {
    action: 'Meeting scheduled',
    user: 'Emily Davis',
    time: '2 hours ago',
    type: 'meeting'
  }
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user as any;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Here's what's happening with your CRM today.
          </p>
        </div>
        <div className="text-right">
          <Badge variant="secondary" className="capitalize">
            {user?.role?.replace('_', ' ')}
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </div>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="mr-2 h-5 w-5 text-blue-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3">
              <button className="flex items-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors text-left">
                <UserPlus className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Add New Lead</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Create a new lead entry</div>
                </div>
              </button>
              
              <button className="flex items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg hover:bg-green-100 dark:hover:bg-green-900 transition-colors text-left">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Manage Users</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Add or edit team members</div>
                </div>
              </button>
              
              <button className="flex items-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors text-left">
                <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-3" />
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">Organization Settings</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Configure your workspace</div>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-indigo-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest updates from your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      by {activity.user}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}