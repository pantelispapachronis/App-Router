import { NextResponse } from 'next/server';
import { preferences, users } from '@/app/lib/placeholder-data';

// GET request handler
export async function GET() {
  const userPreferences = preferences.map(preference => {
    const user = users.find(u => u.id === preference.user_id);
    return {
        user_id: preference.user_id,
        name: user?.name,
        preferences: {
            desk1: preference.desk1,
            desk2: preference.desk2,
            desk3: preference.desk3,
        }
    }
  })
  return NextResponse.json(userPreferences);
}

// POST request handler
export async function POST(request: Request) {
  const data = await request.json();
  const preference = preferences.find(p => p.user_id === data.user_id);

  if (preference) {
    preference.desk1 = data.desk1|| preference.desk1;
    preference.desk2 = data.desk2 || preference.desk2;
    preference.desk3 = data.desk3 || preference.desk3;
    
    return NextResponse.json({ message: 'Preferences updated', data: preference });
  } else {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }
}
