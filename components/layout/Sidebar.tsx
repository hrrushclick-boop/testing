'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { hasPermission } from '@/lib/permissions';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  Building2, 
  ContactRound,
  TrendingUp,
  Settings,
  Shield
} from 'lucide-react';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: { resource: string; action: string };
  roles?: string[];
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Leads',
    href: '/dashboard/leads',
    icon: ContactRound,
    permission: { resource: 'leads', action: 'view' }
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    icon: TrendingUp,
    permission: { resource: 'leads', action: 'view' }
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: Users,
    permission: { resource: 'users', action: 'view' }
  },
  {
    title: 'Add User',
    href: '/dashboard/users/add',
    icon: UserPlus,
    permission: { resource: 'users', action: 'create' }
  },
  {
    title: 'Organization',
    href: '/dashboard/organization',
    icon: Building2,
    permission: { resource: 'organization', action: 'view' }
  },
  {
    title: 'Permissions',
    href: '/dashboard/permissions',
    icon: Shield,
    roles: ['administrator', 'super_admin']
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  }
];

export function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const user = session?.user as any;

  if (!user) return null;

  const filteredItems = sidebarItems.filter(item => {
    if (item.roles && !item.roles.includes(user.role)) {
      return false;
    }
    
    if (item.permission) {
      return hasPermission(user, item.permission.resource, item.permission.action);
    }
    
    return true;
  });

  return (
    <div className="pb-12 w-64 border-r bg-card">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {filteredItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
                    'hover:bg-accent hover:text-accent-foreground',
                    isActive 
                      ? 'bg-primary text-primary-foreground shadow-sm' 
                      : 'text-muted-foreground'
                  )}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.title}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}