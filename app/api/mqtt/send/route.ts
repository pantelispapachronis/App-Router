import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import { fetchPreferences } from "@/app/lib/data";

export async function GET(req: Request) {
  try {
    // Read parameters from GET request
    const url = new URL(req.url);
    const presence = url.searchParams.get("presence");

    if (!presence) {
      return NextResponse.json({ success: false, error: "Missing presence parameter" }, { status: 400 });
    }

    // Call get API preferences
    const user_id="412532b2-4001-4271-9855-fec4b6a6442a";

    const userprefJSON = await fetchPreferences(user_id);
    const userpref = JSON.parse(JSON.stringify(userprefJSON));
    //console.log(userpref[0].user_id);
    //console.log(userpref[0].desk1);

    // Get the data from JSON body
    const employeeId = userpref[0].user_id;
    const deskPrefA = userpref[0].desk1;
    const deskPrefB = userpref[0].desk2;
    const deskPrefC = userpref[0].desk3;

    // Check if any of the required parameters is missing
    if (!employeeId || !deskPrefA || !deskPrefB || !deskPrefC || !presence) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 });
    }

    return new Promise((resolve) => {
      // Find the path of the Python script
      const scriptPath = path.join(process.cwd(), "scripts", "send_to_mqtt.py");

      // Create the command to execute the Python script with the arguments
      const command = `python "${scriptPath}" "${employeeId}" "${deskPrefA}" "${deskPrefB}" "${deskPrefC}" "${presence}"`;

      // Run the Python script
      const childProcess = exec(command, { encoding: "utf8" });

      let outputData = "";
      let errorData = "";

      if (childProcess.stdout) {
        childProcess.stdout.on("data", (data) => {
          outputData += data;
        });
      }

      if (childProcess.stderr) {
        childProcess.stderr.on("data", (data) => {
          errorData += data;
        });
      }

      childProcess.on("close", (code) => {
        if (code === 0) {
          resolve(NextResponse.json({ success: true, output: outputData.trim() }));
        } else {
          resolve(NextResponse.json({ success: false, error: errorData.trim() }, { status: 500 }));
        }
      });
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}



