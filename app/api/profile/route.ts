import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { neon } from '@neondatabase/serverless';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const sql = neon(`${process.env.DATABASE_URL}`);
    const users = await sql`
      SELECT 
        id, 
        email, 
        favorite_team, 
        provider,
        "watchList"
      FROM users
      WHERE id = ${session.user.id}
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[0];
    
    return NextResponse.json({
      id: user.id,
      email: user.email,
      favoriteTeam: user.favorite_team,
      watchList: user.watchList || [],
      provider: user.provider,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}