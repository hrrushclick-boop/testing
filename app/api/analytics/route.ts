import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Lead } from '@/models/Lead';
import { User } from '@/models/User';
import { hasPermission } from '@/lib/permissions';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user as any;
    if (!hasPermission(user, 'leads', 'view')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await connectToDatabase();

    const query: any = {};
    if (user.role !== 'administrator') {
      query.organizationId = user.organizationId;
    }
    
    if (user.role === 'user') {
      query.assignedTo = user.id;
    }

    // Get all leads for analytics
    const leads = await Lead.find(query);
    const totalLeads = leads.length;
    const wonLeads = leads.filter(lead => lead.status === 'won').length;
    const conversionRate = totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0;

    // Calculate total value
    const totalValue = leads.reduce((sum, lead) => sum + (lead.value || 0), 0);
    const avgDealSize = totalLeads > 0 ? Math.round(totalValue / totalLeads) : 0;

    // Group by status
    const leadsByStatus = leads.reduce((acc: any, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});

    // Group by source
    const leadsBySources = leads.reduce((acc: any, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {});

    // Find best performing source
    const bestSource = Object.keys(leadsBySources).reduce((a, b) => 
      leadsBySources[a] > leadsBySources[b] ? a : b, 'Website'
    );

    // Weekly leads (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyLeads = leads.filter(lead => 
      new Date(lead.createdAt) >= weekAgo
    ).length;

    // Active users count
    let activeUsers = 0;
    if (user.role === 'administrator') {
      activeUsers = await User.countDocuments({ isActive: true });
    } else {
      activeUsers = await User.countDocuments({ 
        organizationId: user.organizationId, 
        isActive: true 
      });
    }

    const analytics = {
      totalLeads,
      conversionRate,
      totalValue,
      avgDealSize,
      leadsByStatus,
      leadsBySources,
      bestSource,
      weeklyLeads,
      activeUsers
    };

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}