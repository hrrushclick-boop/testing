import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Organization } from '@/models/Organization';
import { User } from '@/models/User';
import { Lead } from '@/models/Lead';
import { hasPermission } from '@/lib/permissions';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user as any;
    if (!hasPermission(user, 'organization', 'view')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();

    let organizationId = user.organizationId;
    if (user.role === 'administrator') {
      // For administrators, we might need to handle differently
      // For now, return mock data or first organization
      const firstOrg = await Organization.findOne().populate('superAdminId', 'name email');
      if (!firstOrg) {
        return NextResponse.json({ error: 'No organization found' }, { status: 404 });
      }
      organizationId = firstOrg._id;
    }

    const organization = await Organization.findById(organizationId)
      .populate('superAdminId', 'name email');

    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Get organization stats
    const [totalUsers, activeUsers, totalLeads, monthlyLeads] = await Promise.all([
      User.countDocuments({ organizationId: organizationId }),
      User.countDocuments({ organizationId: organizationId, isActive: true }),
      Lead.countDocuments({ organizationId: organizationId }),
      Lead.countDocuments({ 
        organizationId: organizationId,
        createdAt: { 
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
        }
      })
    ]);

    const response = {
      name: organization.name,
      domain: organization.domain,
      superAdmin: organization.superAdminId,
      settings: organization.settings,
      stats: {
        totalUsers,
        activeUsers,
        totalLeads,
        monthlyLeads
      },
      createdAt: organization.createdAt
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching organization:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}