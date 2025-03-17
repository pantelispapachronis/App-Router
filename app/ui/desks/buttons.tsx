"use client";

import { PlusIcon, ComputerDesktopIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';

export function DeskRecommendation() {
  return (
    <Link
      href="/dashboard/desks/recommendation"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Get Desk Recommendation</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function BookDesk({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/mqtt/desk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ desk_id: id }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Desk booked successfully!");
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert("Failed to book the desk.");
      console.error("Booking error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBooking}
      disabled={loading}
      className="flex flex-col items-center rounded-md border p-2 hover:bg-gray-100"
    >
      {loading ? "Booking..." : "Book this Desk"}
      <br /> <ComputerDesktopIcon className="w-5" />
    </button>
  );
}


export function BookDeskError({ id }: { id: string }) {
  return (
    <div
      className="flex flex-col items-center rounded-md border p-2 bg-gray-200 cursor-not-allowed"
    >
      &nbsp;&nbsp;Unavailable&nbsp;&nbsp;&nbsp; <br/> <XCircleIcon className="w-5" />
    </div>
  );
}

