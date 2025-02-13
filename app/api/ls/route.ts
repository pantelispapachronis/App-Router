import { NextResponse } from "next/server";
import { exec } from "child_process";
import os from "os";

// GET request handler for listing directory contents (Windows only)
export async function GET() {
  if (os.platform() !== "win32") {
    return NextResponse.json(
      { error: "This API endpoint is only available on Windows." },
      { status: 403 }
    );
  }

  return new Promise((resolve) => {
    exec("chcp 65001 >NUL && dir", { encoding: "utf8" }, (error, stdout, stderr) => {
      if (error) {
        resolve(NextResponse.json({ error: error.message }, { status: 500 }));
        return;
      }
      if (stderr) {
        resolve(NextResponse.json({ error: stderr }, { status: 500 }));
        return;
      }

      // Format output and remove "Active code page" line
      const formattedOutput = stdout
        .replace(/\r/g, "") // Remove carriage returns
        .split("\n") // Split into lines
        .map((line) => line.trim()) // Trim spaces
        .filter((line) => line !== "" && !line.startsWith("Active code page")); // Remove unwanted lines

      resolve(NextResponse.json({ output: formattedOutput }));
    });
  });
}
