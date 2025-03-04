import Pagination from '@/app/ui/invoices/pagination';
import { DeskPreference } from '@/app/ui/preferences/buttons'; //Changed!
import { lusitana } from '@/app/ui/fonts';
//import { InvoicesTableSkeleton } from '@/app/ui/skeletons'; export the table skeleton of preferences
//import { Suspense } from 'react'; 
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Set preferences',
};
 
export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = 1


  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Desk Preferences</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        {/* Need to be checked - changed */}
        <DeskPreference /> 
      </div>
      {/* Creates the table with preferences - i don' t want it here 
       <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>*/}
    </div>
  );
}
