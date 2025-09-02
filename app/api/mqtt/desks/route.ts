import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { desk_id } = await req.json();
    if (!desk_id) {
      return NextResponse.json({ error: 'Desk ID is required' }, { status: 400 });
    }

    const scriptPath = path.join(process.cwd(), "scripts", "mqtt_desk_availability.py");
    const command = `python "${scriptPath}" "${desk_id}" "true"`; // notice: true

    return await new Promise((resolve) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ MQTT Error: ${stderr}`);
          resolve(NextResponse.json({ error: 'Failed to send MQTT message' }, { status: 500 }));
        } else {
          // console.log(`✅ MQTT Desk Available: ${stdout}`);
          resolve(NextResponse.json({ message: 'MQTT desk availability sent (true)' }, { status: 200 }));
        }
      });
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
