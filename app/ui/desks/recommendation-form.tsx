"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ComputerDesktopIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";

export default function Form() {
  const [selectedDesks, setSelectedDesks] = useState<string[]>([]);
  const desk1Ref = useRef<HTMLSelectElement>(null);
  const desk2Ref = useRef<HTMLSelectElement>(null);
  const desk3Ref = useRef<HTMLSelectElement>(null);

  // Mock user ID (Replace with actual user ID from auth/context)
  const user_id = "410544b2-4001-4271-9855-fec4b6a6442a";

  // List of available desks
  const desks = [
    { id: "R105_01", is_available: true },
    { id: "R105_02", is_available: true },
    { id: "R105_06", is_available: true },
    { id: "R106_01", is_available: true },
    { id: "R108_07", is_available: true },
    { id: "R204_02", is_available: true },
    { id: "R209_01", is_available: true },
    { id: "R303_12", is_available: true },
    { id: "R512_05", is_available: true },
  ];

  // Function to check if a desk option should be disabled
  const isDeskDisabled = (desk: string) => selectedDesks.includes(desk);

  // Handle desk selection change
  const handleDeskChange = () => {
    if (desk1Ref.current && desk2Ref.current && desk3Ref.current) {
      setSelectedDesks([
        desk1Ref.current.value,
        desk2Ref.current.value,
        desk3Ref.current.value,
      ]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure all fields are filled
    if (!desk1Ref.current || !desk2Ref.current || !desk3Ref.current) return;

    const payload = {
      user_id,
      desk1: desk1Ref.current.value,
      desk2: desk2Ref.current.value,
      desk3: desk3Ref.current.value,
    };

    try {
      const response = await fetch("/api/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Preferences updated successfully!");

        const response2 = await fetch("/api/mqtt/send?presence=TRUE", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data2 = await response2.json();
        if (response2.ok) {
          alert("Preferences and presence updated successfully!");
        } else {
          alert(`Error2: ${data2.message}`);
        }
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
      alert("Failed to update preferences.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Generate 3 Desk Selection Dropdowns */}
        {["desk1", "desk2", "desk3"].map((deskKey, index) => (
          <div key={deskKey} className="mb-4">
            <label htmlFor={deskKey} className="mb-2 block text-sm font-medium">
              Option {index + 1}
            </label>
            <div className="relative">
              <select
                id={deskKey}
                name={deskKey}
                ref={index === 0 ? desk1Ref : index === 1 ? desk2Ref : desk3Ref}
                className="peer block w-full cursor-pointer rounded-md border border-gray-300 py-2 pl-10 text-sm outline-2"
                onChange={handleDeskChange}
              >
                <option value="">Select a desk</option>
                {desks.map((desk) => (
                  <option
                    key={desk.id}
                    value={desk.id}
                    disabled={isDeskDisabled(desk.id)}
                  >
                    {desk.id}
                  </option>
                ))}
              </select>
              <ComputerDesktopIcon className="pointer-events-none absolute left-3 top-1/4 h-[18px] w-[18px] text-gray-500" />
            </div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/desks"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
