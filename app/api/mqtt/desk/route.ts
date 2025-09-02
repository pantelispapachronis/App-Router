import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { desk_id } = await req.json();
        if (!desk_id) {
            return NextResponse.json({ error: 'Desk ID is required' }, { status: 400 });
        }

        const scriptPath = path.join(process.cwd(), "scripts", "mqtt_desk_availability.py");
        const command = `python ${scriptPath} ${desk_id} false`;
        const getTimestamp = () =>
            `[${new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString().replace("T", " ").replace("Z", "")}]`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing script: ${stderr}`);
                return NextResponse.json({ error: 'Failed to send MQTT message' }, { status: 500 });
            }
        console.log(`${getTimestamp()} Desk booked: ${desk_id}`);
        });

        return NextResponse.json({ message: 'Desk booking request sent' }, { status: 200 });
    } catch (error) {
        console.error('Error processing request:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}