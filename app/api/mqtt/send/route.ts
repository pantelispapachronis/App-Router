import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import { fetchPreferences } from "@/app/lib/data";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    // Get the authenticated session
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json({ success: false, error: "User not authenticated" }, { status: 401 });
    }

    const user_id = session.user.id; // Dynamic user ID from session

    // Read parameters from GET request
    const url = new URL(req.url);
    const presence = url.searchParams.get("presence");

    if (!presence) {
      return NextResponse.json({ success: false, error: "Missing presence parameter" }, { status: 400 });
    }

    // Fetch user preferences dynamically
    const userprefJSON = await fetchPreferences(user_id);
    const userpref = JSON.parse(JSON.stringify(userprefJSON));

    if (!userpref.length) {
      return NextResponse.json({ success: false, error: "No preferences found for user" }, { status: 404 });
    }

    const employeeId = userpref[0].user_id;
    const deskPrefA = userpref[0].desk1;
    const deskPrefB = userpref[0].desk2;
    const deskPrefC = userpref[0].desk3;

    if (!employeeId || !deskPrefA || !deskPrefB || !deskPrefC || !presence) {
      return NextResponse.json({ success: false, error: "Missing required parameters" }, { status: 400 });
    }

    return new Promise((resolve) => {
      const scriptPath = path.join(process.cwd(), "scripts", "send_to_mqtt.py");
      const command = `python "${scriptPath}" "${employeeId}" "${deskPrefA}" "${deskPrefB}" "${deskPrefC}" "${presence}"`;

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
