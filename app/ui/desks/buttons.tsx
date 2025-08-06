"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  PlusIcon,
  ComputerDesktopIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

// Desk Recommendation Button
export function DeskRecommendation() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        setUserId(data.user_id);
      } catch (error) {
        console.error("Failed to fetch user ID", error);
      }
    };
    fetchUserId();
  }, []);

  const handleRecommendation = async () => {
    if (!userId) {
      alert("User not authenticated");
      return;
    }

    setLoading(true);
    try {

      // 1. Presence Update
      await fetch("/api/presence-true", { method: "POST" });

      // 2. MQTT Send
      const sendRes = await fetch("/api/mqtt/send");
      if (!sendRes.ok) throw new Error("MQTT send failed");

      // 3. MQTT Subscribe - wait for OK
      const subRes = await fetch(`/api/mqtt/subscribe?employee_id=${userId}`, {
        cache: "no-store",
      });
      const subData = await subRes.json();

      console.log("subData", subData);

      if (!subRes.ok) throw new Error("MQTT subscribe failed");
      // if (subData.employee_id !== userId || subData.status !== "OK") {
      //   throw new Error("Invalid MQTT confirmation");
      // }

      // 4. Recommendation
      const recRes = await fetch(`/api/recommendation?user=${userId}`);
      if (!recRes.ok) throw new Error("Recommendation failed");

      // 5. Redirect
      router.push("/dashboard/desks/recommendation");
    } catch (error: any) {
      console.error("Recommendation flow error:", error);
      alert("❌ " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRecommendation}
      disabled={loading}
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-500"
    >
      {loading ? "Processing..." : "Get Desk Recommendation"}
      <PlusIcon className="h-5 ml-2" />
    </button>
  );
}

// 🔹 Book Desk (available)
export function BookDesk({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBooking = async () => {
  setLoading(true);
  try {
    // 1. call API to book the desk
    const response = await fetch("/api/desks/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ desk_id: id }),
    });

    const data = await response.json();
    if (!response.ok) {
      alert(`Error: ${data.error}`);
      return;
    }

    // 2. send MQTT message to update desk status
    await fetch("/api/mqtt/desk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ desk_id: id }),
    });

    alert("Desk booked successfully!");
    router.push("/dashboard");
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
      <br />
      <ComputerDesktopIcon className="w-5" />
    </button>
  );
}

// 🔹 Book Desk (unavailable)
export function BookDeskError({ id }: { id: string }) {
  return (
    <div className="flex flex-col items-center rounded-md border p-2 bg-gray-200 cursor-not-allowed">
      &nbsp;&nbsp;Unavailable&nbsp;&nbsp;&nbsp;
      <br />
      <XCircleIcon className="w-5" />
    </div>
  );
}
