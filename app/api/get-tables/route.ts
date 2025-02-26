import { db } from "@vercel/postgres";

export async function GET() {
  const client = await db.connect();

  try {
    const result = await client.sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;
    
    return Response.json(result.rows);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  } finally {
    client.release();
  }
}
