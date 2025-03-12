export async function GET() {
    const baseUrl = "http://172.16.0.243:30676/ngsi-ld/v1/entities";
    const slots = [1, 2, 3];
    const employeeId = "urn:Pilot5:Employee:A1020001:RankedRecommendation:Slot";

    try {
        const fetchPromises = slots.map(async (desk) => {
            const url = `${baseUrl}/${employeeId}:${desk}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const objectValue = data["http://purl.org/ontology/olo/core#item"].object;
            const extractedString = objectValue.split(":").pop();

            return { desk, object: extractedString };
        });

        const results = await Promise.all(fetchPromises);

        return Response.json({ recommendations: results });
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        return Response.json({ error: "Failed to fetch recommendations" }, { status: 500 });
    }
}
