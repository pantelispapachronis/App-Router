"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ComputerDesktopIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";

export default function Form() {
  const getTimestamp = () =>
  `[${new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString().replace("T", " ").replace("Z", "")}]`;

  const [selectedDesks, setSelectedDesks] = useState<string[]>(["", "", ""]);
  const desk1Ref = useRef<HTMLSelectElement>(null);
  const desk2Ref = useRef<HTMLSelectElement>(null);
  const desk3Ref = useRef<HTMLSelectElement>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const desks = [
    { id: "R105_01", is_available: true },
    { id: "R105_02", is_available: true },
    { id: "R106_01", is_available: true },
    { id: "R106_02", is_available: true },
    { id: "R208_01", is_available: true },
    { id: "R208_02", is_available: true },
    { id: "R208_03", is_available: true },
    { id: "R208_04", is_available: true },
    { id: "R209_01", is_available: true },
  ];

  const isDeskDisabled = (desk: string) => selectedDesks.includes(desk);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        if (res.ok) {
          setUserId(data.user_id);
        } else {
          console.error("Failed to fetch user ID:", data.error);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchPreferences = async () => {
      try {
        const response = await fetch("/api/employees");
        const data = await response.json();

        if (response.ok) {
          const userPreferences = data.find((user: any) => user.Id === userId);
          if (userPreferences) {
            setSelectedDesks([
              userPreferences.DeskPref_A || "",
              userPreferences.DeskPref_B || "",
              userPreferences.DeskPref_C || "",
            ]);
          }
        } else {
          console.error("Failed to fetch employees preferences:", data);
        }
      } catch (error) {
        console.error("Error fetching employees preferences:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [userId]);

  const handleDeskChange = () => {
    if (desk1Ref.current && desk2Ref.current && desk3Ref.current) {
      setSelectedDesks([
        desk1Ref.current.value,
        desk2Ref.current.value,
        desk3Ref.current.value,
      ]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!desk1Ref.current || !desk2Ref.current || !desk3Ref.current || !userId) return;

    const payload = {
      user_id: userId,
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
        console.log("\n────────────── Preferences Saved ──────────────\n");
        console.log(`[${getTimestamp()}]\n`);
        console.log(payload);
        console.log("\n──────────────────────────────────────────────");

        alert("Preferences updated successfully!");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
      alert("Failed to update preferences.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
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
                defaultValue={selectedDesks[index]}
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
