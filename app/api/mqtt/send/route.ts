import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";
import { fetchPreferences } from "@/app/lib/data";
import { auth } from "@/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "User not authenticated" }, { status: 401 });
    }

    const user_id = session.user.id;
    const preferences = await fetchPreferences(user_id);
    if (!preferences.length) {
      return NextResponse.json({ success: false, error: "No preferences found" }, { status: 404 });
    }

    const user = preferences[0];
    const message = {
      Id: user.Id,
      DeskPref_A: user.DeskPref_A,
      DeskPref_B: user.DeskPref_B,
      DeskPref_C: user.DeskPref_C,
      Presence: user.Presence,
      Rec_System_Rating: user.Rec_System_Rating,
    };

    const scriptPath = path.join(process.cwd(), "scripts", "send_to_mqtt.py");
    const safeJSONString = JSON.stringify(message).replace(/"/g, '\\"');
    const command = `python "${scriptPath}" "${safeJSONString}"`;

    console.log("MQTT SEND → Running:", command);

    return new Promise((resolve) => {
      const child = exec(command, { encoding: "utf8" });

      let output = "", error = "";

      child.stdout?.on("data", (data) => (output += data));
      child.stderr?.on("data", (data) => (error += data));

      child.on("close", (code) => {
        if (code === 0) {
          console.log("MQTT SEND → Success:\n", output.trim());
          resolve(NextResponse.json({ success: true }));
        } else {
          console.error("MQTT SEND → Failed:\n", error.trim());
          resolve(NextResponse.json({ success: false, error: error.trim() || "Unknown error" }, { status: 500 }));
        }
      });
    });
  } catch (error) {
    console.error("MQTT SEND → Exception:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
