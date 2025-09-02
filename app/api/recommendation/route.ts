import { NextResponse } from "next/server";

const loggedUsers = new Map<string, number>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user");

  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  const baseUrl = "http://172.16.0.65:13646/ngsi-ld/v1/entities";
  const slots = [1, 2, 3];
  const employeeId = `urn:Pilot5:Employee:${userId}:RankedRecommendation:Slot`;

  const getTimestamp = () =>
    `[${new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString().replace("T", " ").replace("Z", "")}]`;

  try {
    const fetchPromises = slots.map(async (slot) => {
      const url = `${baseUrl}/${employeeId}:${slot}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} for slot ${slot}`);
      }

      const data = await response.json();
      const objectValue = data["http://www.w3.org/ns/org#item"].object;
      const extracted = objectValue.split(":").pop();

      return { slot, object: extracted };
    });

    const results = await Promise.all(fetchPromises);

    const formatted = results
      .map((r) => `rec${r.slot}:${r.object}`)
      .join("  ");
    const now = Date.now();
    const lastLoggedAt = loggedUsers.get(userId) ?? 0;
    if (now - lastLoggedAt > 2000) {
      console.log(`${getTimestamp()} Fetching recommendations from Orion-LD: ${formatted}`);
      loggedUsers.set(userId, now);
    }
    return NextResponse.json({ recommendations: results });
  } catch (error) {
    console.error("❌ Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
