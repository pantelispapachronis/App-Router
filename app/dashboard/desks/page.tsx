import Pagination from '@/app/ui/desks/pagination';
import Search from '@/app/ui/search';
// import Table from '@/app/ui/invoices/table';
import { DeskRecommendation } from '@/app/ui/desks/buttons';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
// import { fetchInvoicesPages } from '@/app/lib/data';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Desks',
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
  // const totalPages = await fetchInvoicesPages(query);


  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Desks</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <DeskRecommendation />
      </div>
       {/* <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense> 
        <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div> */}
    </div>
  );
}
