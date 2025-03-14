import { CheckIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function InvoiceStatus({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-1 text-xs',
        {
          'bg-red-500 text-white': status === 'blocked',
          'bg-green-500 text-white': status === 'available',
        },
      )}
    >
      {status === 'blocked' ? (
        <>
          Occupied
          <UserIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
      {status === 'available' ? (
        <>
          Available
          <CheckIcon className="ml-1 w-4 text-white" />
        </>
      ) : null}
    </span>
  );
}
