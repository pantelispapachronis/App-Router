"use client";

import { useState, useEffect } from "react";
import { ComputerDesktopIcon } from "@heroicons/react/24/outline";
import { Button } from "@/app/ui/button";

export default function DeskSelectionForm() {
  const [desks, setDesks] = useState<{ id: string }[]>([]);

  // Fetch recommended desk IDs from API
  useEffect(() => {
    const fetchRecommendedDesks = async () => {
      try {
        const response = await fetch("/api/recommendation");
        const data = await response.json();
        if (response.ok) {
          setDesks([{ id: data.object }]);
        }
      } catch (error) {
        console.error("Error fetching recommended desks:", error);
      }
    };
    
    fetchRecommendedDesks();
  }, []);

  return (
    <form className="rounded-md bg-gray-50 p-4 md:p-6">
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Desk ID</th>
            <th className="border p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {desks.map((desk) => (
            <tr key={desk.id} className="border">
              <td className="border p-2">{desk.id}</td>
              <td className="border p-2">
                <Button className="flex items-center gap-2">
                  Book this Desk
                  <ComputerDesktopIcon className="w-5 h-5" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </form>
  );
}
