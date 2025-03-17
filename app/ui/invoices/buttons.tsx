import { PlusIcon, TrashIcon, ComputerDesktopIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInvoice } from '@/app/lib/actions';


export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Get Desk Recommendation</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="flex flex-col items-center rounded-md border p-2 hover:bg-gray-100"
    >
      Book this Desk <br/> <ComputerDesktopIcon className="w-5" />
    </Link>
  );
}

export function UpdateInvoiceError({ id }: { id: string }) {
  return (
    <div
      className="flex flex-col items-center rounded-md border p-2 bg-gray-200 cursor-not-allowed"
    >
      &nbsp;&nbsp;Unavailable&nbsp;&nbsp;&nbsp; <br/> <XCircleIcon className="w-5" />
    </div>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);

  return (
    <form action={deleteInvoiceWithId}>
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
