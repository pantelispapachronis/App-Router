import { NextResponse } from 'next/server';
import { db } from '@vercel/postgres';
import { auth } from '@/auth';

export async function POST() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
  }

  const client = await db.connect();

  try {
    await client.sql`
      UPDATE EMPLOYEES_PREFERENCES
      SET "Presence" = true
      WHERE "Id" = ${userId};
    `;

    return NextResponse.json({ message: 'Presence updated to true' });
  } catch (error) {
    console.error('Error updating presence:', error);
    return NextResponse.json({ error: 'Failed to update presence' }, { status: 500 });
  }
}
