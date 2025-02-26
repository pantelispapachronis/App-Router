import { NextResponse } from 'next/server';
import { preferences, users } from '@/app/lib/placeholder-data';
import fs from 'fs';
import path from 'path';
import { db } from '@vercel/postgres';


const client = await db.connect();


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
  });
  return NextResponse.json(userPreferences);
}

// POST request handler
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const preferenceIndex = preferences.findIndex(p => p.user_id === data.user_id);

    if (preferenceIndex !== -1) {
      preferences[preferenceIndex] = {
        ...preferences[preferenceIndex],
        desk1: data.desk1 || preferences[preferenceIndex].desk1,
        desk2: data.desk2 || preferences[preferenceIndex].desk2,
        desk3: data.desk3 || preferences[preferenceIndex].desk3,
      };

      // Save to file placeholder-data.ts
      savePreferencesToFile();

      return NextResponse.json({ message: 'Preferences updated', data: preferences[preferenceIndex] });
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ message: 'Error updating preferences', error }, { status: 500 });
  }
}

// Function to save preferences to file
function savePreferencesToFile() {
  const filePath = path.join(process.cwd(), 'app/lib/placeholder-data.ts');
  
  // Read the file as a string
  let fileContent = fs.readFileSync(filePath, 'utf8');

  // Update the preferences array
  const preferencesString = `const preferences = ${JSON.stringify(preferences, null, 2)};`;

  fileContent = fileContent.replace(/const preferences = \[.*?\];/s, preferencesString);

  // write the updated content back to the file
  fs.writeFileSync(filePath, fileContent, 'utf8');
}

async function updateUserPreferences(userId: string, newPreferences: { desk1?: string; desk2?: string; desk3?: string }) {
  try {
    const updatedPreference = await client.sql`
      UPDATE preferences
      SET desk1 = ${newPreferences.desk1}, 
          desk2 = ${newPreferences.desk2}, 
          desk3 = ${newPreferences.desk3}
      WHERE user_id = ${userId}
      RETURNING *;
    `;
    
    return updatedPreference;
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
}
