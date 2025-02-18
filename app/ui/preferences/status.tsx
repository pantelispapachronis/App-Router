import { CheckIcon, UserIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function DeskStatus({ status }: { status: string }) {
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2 py-1 text-xs')}>
        Available
        <CheckIcon className="ml-1 w-4 text-white" />
    </span>
  );
}
