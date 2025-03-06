'use client'

import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import { ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createInvoice, State } from '@/app/lib/actions';
import { useActionState } from 'react';
import { useState } from 'react';
import React, { useRef } from 'react';

export default function Form() {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction] = useActionState(createInvoice, initialState);
  var [selectedDesks, setSelectedDesks] = useState<string[]>([]);


  const desk1Ref = useRef<HTMLSelectElement>(null);
  const desk2Ref = useRef<HTMLSelectElement>(null);
  const desk3Ref = useRef<HTMLSelectElement>(null);


  
  const desk1fromdb = 'desk1';
  //selectedDesks.push(desk1fromdb);

  const desk2fromdb = 'desk2';
  //selectedDesks.push(desk2fromdb);

  const desk3fromdb = 'desk5';
  //selectedDesks.push(desk3fromdb);


  var isDeskDisabled = (desk: string) => selectedDesks.includes(desk);


  const handleDeskChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;


    console.log(desk1Ref.current?.value);
    
    
    setSelectedDesks([]);
    console.log(selectedDesks);

    if (desk1Ref.current && desk2Ref.current && desk3Ref.current) {
      setSelectedDesks([desk1Ref.current.value,desk2Ref.current.value,desk3Ref.current.value]);
      console.log("mpike mesa");
    }
    

    console.log(selectedDesks);


    isDeskDisabled = (desk: string) => selectedDesks.includes(desk)


/*
    setSelectedDesks((prev) => {
      if (prev.includes(value)) {
        return prev.filter((desk) => desk !== value);
      } else {
        return [...prev, value];
      }
    });
*/


};
 


  isDeskDisabled = (desk: string) => selectedDesks.includes(desk)

  



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
              ref= {desk1Ref}
              className="peer block w-full cursor-pointer rounded-md border border-gray-300 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue= {desk2fromdb}
              aria-describedby="desk1-error"
              onChange={handleDeskChange}
            >
              <option value="">
                Select a desk
              </option>
              <option value="desk1" disabled={isDeskDisabled('desk1')}>Desk 1</option>
              <option value="desk2" disabled={isDeskDisabled('desk2')}>Desk 2</option>
              <option value="desk3" disabled={isDeskDisabled('desk3')}>Desk 3</option>
              <option value="desk4" disabled={isDeskDisabled('desk4')}>Desk 4</option>
              <option value="desk5" disabled={isDeskDisabled('desk5')}>Desk 5</option>
            </select>
            <ComputerDesktopIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
           
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
              ref= {desk2Ref}
              className="peer block w-full cursor-pointer rounded-md border border-gray-300 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue= {desk1fromdb}
              aria-describedby="desk2-error"
              onChange={handleDeskChange}
            >
              <option value="">
                Select a desk
              </option>
              <option value="desk1" disabled={isDeskDisabled('desk1')}>Desk 1</option>
              <option value="desk2" disabled={isDeskDisabled('desk2')}>Desk 2</option>
              <option value="desk3" disabled={isDeskDisabled('desk3')}>Desk 3</option>
              <option value="desk4" disabled={isDeskDisabled('desk4')}>Desk 4</option>
              <option value="desk5" disabled={isDeskDisabled('desk5')}>Desk 5</option>
            </select>
            <ComputerDesktopIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            
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
              ref= {desk3Ref}
              className="peer block w-full cursor-pointer rounded-md border border-gray-300 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue= {desk3fromdb}
              aria-describedby="desk3-error"
              onChange={handleDeskChange}
            >
              <option value="">
                Select a desk
              </option>
              <option value="desk1" disabled={isDeskDisabled('desk1')}>Desk 1</option>
              <option value="desk2" disabled={isDeskDisabled('desk2')}>Desk 2</option>
              <option value="desk3" disabled={isDeskDisabled('desk3')}>Desk 3</option>
              <option value="desk4" disabled={isDeskDisabled('desk4')}>Desk 4</option>
              <option value="desk5" disabled={isDeskDisabled('desk5')}>Desk 5</option>
            </select>
            <ComputerDesktopIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
           
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
