'use client';

import { useEffect, useState } from 'react';
import { BookDesk, BookDeskError } from './buttons';
import DeskStatus from './status';

export default function DeskRecTable() {
  const [desks, setDesks] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // 1. Fetch the user_id from the user API
        const userRes = await fetch('/api/user');
        const userData = await userRes.json();
        if (!userRes.ok || !userData.user_id) {
          throw new Error('User not authenticated');
        }

        // 2. fetch the recommendations from the recommendation API
        const recRes = await fetch(`/api/recommendation?user=${userData.user_id}`);
        const recData = await recRes.json();
        if (!recRes.ok) {
          throw new Error(recData.error || 'Failed to fetch recommendations');
        }

        // 3. build the desks array from the recommendations
        const desksMapped = recData.recommendations.map((rec: { desk: number; object: string }) => ({
          id: `${rec.object}`,
          status: 'available',
          name: rec.object,
        }));

        setDesks(desksMapped);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        console.error(err);
      }
    };

    fetchRecommendations();
  }, []);

  if (error) {
    return <div className="p-4 text-red-500">⚠️ {error}</div>;
  }

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th className="px-4 py-5 font-medium sm:pl-6">Desk ID</th>
                <th className="px-3 py-5 font-medium">Status</th>
                <th className="py-3 pl-6 pr-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {desks.map((desk: any) => (
                <tr key={desk.id} className="w-full border-b py-3 text-sm">
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">{desk.name}</td>
                  <td className="whitespace-nowrap px-3 py-3">
                    <DeskStatus status={desk.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      {desk.status === 'available' && <BookDesk id={desk.id} />}
                      {desk.status === 'blocked' && <BookDeskError id={desk.id} />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
