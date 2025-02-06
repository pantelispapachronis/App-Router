'use client'

import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import {
  ComputerDesktopIcon,
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createInvoice, State } from '@/app/lib/actions';
import { useActionState } from 'react';
import { useState } from 'react';

export default function Form() {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createInvoice, initialState);
  const [selectedDesks, setSelectedDesks] = useState<string[]>([]);

  const handleDeskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setSelectedDesks((prev) => {
      if (prev.includes(value)) {
        return prev.filter((desk) => desk !== value);
      } else {
        return [...prev, value];
      }
    });
  };
  // const handleDeskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const { name, value } = e.target;
  //   setSelectedDesks((prev) => {
  //     const newSelectedDesks = { ...prev, [name]: value };
  //     return Object.values(newSelectedDesks);
  //   });
  // };

  const isDeskDisabled = (desk: string) => selectedDesks.includes(desk);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="desk1" className="mb-2 block text-sm font-medium">
            Option 1
          </label>
          <div className="relative">
            <select
              id="desk1"
              name="desk1"
              className="peer block w-full cursor-pointer rounded-md border border-gray-300 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="desk1-error"
              onChange={handleDeskChange}
            >
              <option value="" disabled>
                Select a desk
              </option>
              <option value="desk1" disabled={isDeskDisabled('desk1')}>Desk 1</option>
              <option value="desk2" disabled={isDeskDisabled('desk2')}>Desk 2</option>
              <option value="desk3" disabled={isDeskDisabled('desk3')}>Desk 3</option>
              <option value="desk4" disabled={isDeskDisabled('desk4')}>Desk 4</option>
              <option value="desk5" disabled={isDeskDisabled('desk5')}>Desk 5</option>
            </select>
            <ComputerDesktopIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            <div id="desk1-error" aria-live="polite" aria-atomic="true">
              {state.errors?.desk1 &&
                state.errors.desk1.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="desk2" className="mb-2 block text-sm font-medium">
            Option 2
          </label>
          <div className="relative">
            <select
              id="desk2"
              name="desk2"
              className="peer block w-full cursor-pointer rounded-md border border-gray-300 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="desk2-error"
              onChange={handleDeskChange}
            >
              <option value="" disabled>
                Select a desk
              </option>
              <option value="desk1" disabled={isDeskDisabled('desk1')}>Desk 1</option>
              <option value="desk2" disabled={isDeskDisabled('desk2')}>Desk 2</option>
              <option value="desk3" disabled={isDeskDisabled('desk3')}>Desk 3</option>
              <option value="desk4" disabled={isDeskDisabled('desk4')}>Desk 4</option>
              <option value="desk5" disabled={isDeskDisabled('desk5')}>Desk 5</option>
            </select>
            <ComputerDesktopIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            <div id="desk2-error" aria-live="polite" aria-atomic="true">
              {state.errors?.desk2 &&
                state.errors.desk2.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="desk3" className="mb-2 block text-sm font-medium">
            Option 3
          </label>
          <div className="relative">
            <select
              id="desk3"
              name="desk3"
              className="peer block w-full cursor-pointer rounded-md border border-gray-300 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              aria-describedby="desk3-error"
              onChange={handleDeskChange}
            >
              <option value="" disabled>
                Select a desk
              </option>
              <option value="desk1" disabled={isDeskDisabled('desk1')}>Desk 1</option>
              <option value="desk2" disabled={isDeskDisabled('desk2')}>Desk 2</option>
              <option value="desk3" disabled={isDeskDisabled('desk3')}>Desk 3</option>
              <option value="desk4" disabled={isDeskDisabled('desk4')}>Desk 4</option>
              <option value="desk5" disabled={isDeskDisabled('desk5')}>Desk 5</option>
            </select>
            <ComputerDesktopIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            <div id="desk3-error" aria-live="polite" aria-atomic="true">
              {state.errors?.desk3 &&
                state.errors.desk3.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/invoices"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}
