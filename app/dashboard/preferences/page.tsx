'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { lusitana } from '@/app/ui/fonts';

export default function PreferencesPage() {
  const router = useRouter();

  async function handlePresenceClick() {
    const confirmResult = confirm('Are you sure you want to set your presence to false?');
    if (!confirmResult) return;

    try {
      const res = await fetch('/api/presence-false', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Error setting presence:', errorData);
        alert('Failed to set presence.');
      } else {
        alert('Presence set to false successfully.');
      }
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
          Set Presence
        </button>
      </div>
    </div>
  );
}
