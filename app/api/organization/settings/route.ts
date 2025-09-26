import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { Organization } from '@/models/Organization';
import { hasPermission } from '@/lib/permissions';

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = session.user as any;
    if (!hasPermission(user, 'organization', 'settings')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updates = await request.json();
    await connectToDatabase();

    const organization = await Organization.findById(user.organizationId);
    if (!organization) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
    }

    // Update settings
    Object.keys(updates).forEach(key => {
      if (organization.settings[key] !== undefined) {
        organization.settings[key] = updates[key];
      }
    });

    await organization.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating organization settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}