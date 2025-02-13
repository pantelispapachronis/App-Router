import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Getthe data from the request body

    // Get the data from jsaon body
    const employeeId = body.employee_id;
    const deskPrefA = body.preferences?.DeskPref_A;
    const deskPrefB = body.preferences?.DeskPref_B;
    const deskPrefC = body.preferences?.DeskPref_C;
    const presence = body.presence?.toUpperCase(); // Μετατρέπουμε σε κεφαλαία

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
