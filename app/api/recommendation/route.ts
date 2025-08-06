import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // console.log("TEST: GET /API/RECOMMENDATION REST CALL");

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user");
  


  if (!userId) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  const baseUrl = "http://172.16.0.65:13646/ngsi-ld/v1/entities";
  const slots = [1, 2, 3];
  const employeeId = `urn:Pilot5:Employee:${userId}:RankedRecommendation:Slot`;
  const ts = () => new Date().toLocaleString('en-EN', { timeZone: 'Europe/Athens' });
  console.log("\n────────────────────Fetching recommendations─────────────────────────\n");
  console.log(`[${ts()}]\n`);
  try {
    const fetchPromises = slots.map(async (desk) => {
      const url = `${baseUrl}/${employeeId}:${desk}`;
      
      
      console.log(`➡️ Fetching: ${url}`);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });
      // console.log('────────────────────────────────────────────────\n');

      console.log(`⬅️ Response for desk ${desk}: ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} for desk ${desk}`);
      }

      const data = await response.json();

      // Show JSON data in a readable format
      // console.log(`📦 Data for slot ${desk}:`, JSON.stringify(data, null, 2));

      const objectValue = data["http://www.w3.org/ns/org#item"].object;
      const extractedString = objectValue.split(":").pop();

      return { desk, object: extractedString };
    });

    const results = await Promise.all(fetchPromises);

    console.log("✅ Final recommendations:", results);

    return NextResponse.json({ recommendations: results });
  } catch (error) {
    console.error("❌ Error fetching recommendations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recommendations" },
      { status: 500 }
    );
  }
}
