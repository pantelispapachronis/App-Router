'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { lusitana } from '@/app/ui/fonts';

export default function PreferencesPage() {
  const router = useRouter();

  async function handlePresenceClick() {
  const confirmResult = confirm("Are you sure you want to leave the room?");
  if (!confirmResult) return;

  try {
    // 1. Get the current desk ID
    const deskRes = await fetch('/api/user/desk');
    const deskData = await deskRes.json();
    const deskId = deskData.desk_id;

    // Reset the desk ID in local storage
    const res = await fetch('/api/presence-reset-desk', { method: 'POST' });
    if (!res.ok) {
      const errorData = await res.json();
      console.error('Error resetting presence and desk:', errorData);
      alert('Failed to reset presence and desk.');
      return;
    }

    alert('You left the room successfully.');

    // 3. Set presence to false
    const mqttRes = await fetch('/api/mqtt/send');
    if (!mqttRes.ok) {
      const errorData = await mqttRes.json();
      console.error('Error sending MQTT presence update:', errorData);
      alert('⚠️ Failed to notify MQTT broker (presence).');
    } else {
      console.log('✅ MQTT presence FALSE sent');
    }

    // 4. Send MQTT desk availability
    if (deskId) {
      const availabilityRes = await fetch('/api/mqtt/desks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ desk_id: deskId }),
      });

      console.log("TEST - Availability: ", availabilityRes)
      console.log("TEST - Availability status: ", availabilityRes.status)

      const availabilityData = await availabilityRes.json();
      console.log("✅ MQTT desk availability response:", availabilityData);
    } else {
      console.warn('⚠️ No desk found for user to mark available.');
    }

    console.log('TEST: User has left the room and desk is now available.');

  } catch (err) {
    console.error('Request failed:', err);
    alert('Error contacting server.');
  }
}


  return (
    <div className="p-4">
      <h1 className={`${lusitana.className} mb-4 text-2xl`}>Settings</h1>
      <div className="flex flex-row gap-4">
        <Link
          href="/dashboard/preferences/set"
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Set Desk Preference
        </Link>
        <button
          onClick={handlePresenceClick}
          className="inline-flex items-center rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
}
