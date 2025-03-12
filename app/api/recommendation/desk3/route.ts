export async function GET() {
    const url = "http://172.16.0.243:30676/ngsi-ld/v1/entities/urn:Pilot5:Employee:A1020001:RankedRecommendation:Slot:3";
    
    try {
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
        
        // Extract the object value from the response
        const objectValue = data["http://purl.org/ontology/olo/core#item"].object;
        
        // Extract only the last part after the colon
        const extractedString = objectValue.split(":").pop();
        
        return Response.json({ object: extractedString });
    } catch (error) {
        console.error("Error fetching recommendation:", error);
        return Response.json({ error: "Failed to fetch recommendation" }, { status: 500 });
    }
}
