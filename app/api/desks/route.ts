import { createClient  } from "@vercel/postgres";

export async function GET() {
  const client = createClient();
  await client.connect();

  try {
    const result = await client.sql`
    SELECT * FROM desks;
    `; 

    return Response.json(result.rows);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
