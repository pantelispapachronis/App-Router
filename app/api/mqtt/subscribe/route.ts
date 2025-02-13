import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function GET() {
  return new Promise((resolve) => {

    console.log("API /api/mqtt called at", new Date().toISOString());
    // Find the path of the Python script
    const scriptPath = path.join(process.cwd(), "scripts", "subscribe_to_mqtt.py");

    // Εκτελεί το Python script
    //const childProcess = exec(`python "${scriptPath}"`, { encoding: "utf8" });

    // Test timeout
    const childProcess = exec(`python "${scriptPath}"`, { encoding: "utf8", timeout: 10000 }); // 10 δευτερόλεπτα


    let outputData = "";
    let errorData = "";

    // Check if stdout exists before using it
    if (childProcess.stdout) {
      childProcess.stdout.on("data", (data) => {
        outputData += data;
      });
    }

    // Check if stderr exists before using it
    if (childProcess.stderr) {
      childProcess.stderr.on("data", (data) => {
        errorData += data;
      });
    }

    childProcess.on("close", (code) => {
      if (code === 0) {
        resolve(NextResponse.json({ success: true, output: outputData.trim() }));
      } else {
        resolve(NextResponse.json({ success: false, error: errorData.trim() || "Unknown error" }, { status: 500 }));
      }
    });
  });
}
