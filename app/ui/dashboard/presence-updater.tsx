'use client';

import { useEffect } from 'react';

export default function PresenceUpdater() {
  useEffect(() => {
    const updatePresence = async () => {
      try {
        await fetch('/api/presence-true', { method: 'POST' });
      } catch (error) {
        console.error('Failed to update presence', error);
      }
    };

    updatePresence();
  }, []);

  return null; 
}