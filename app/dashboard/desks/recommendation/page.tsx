// import Form from '@/app/ui/desks/recommendation-form';
import Breadcrumbs from '@/app/ui/desks/breadcrumbs';
import { Metadata } from 'next';

import Table from '@/app/ui/desks/table';
import { DeskTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import Pagination from '@/app/ui/desks/pagination';





export const metadata: Metadata = {
  title: 'Desk Recommendations',
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

  
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Desks', href: '/dashboard/desks' },
          {
            label: 'Recommendations',
            href: '/dashboard/desks/recommendation',
            active: true,
          },
        ]}
      />
      
      
      <Suspense key={query + currentPage} fallback={<DeskTableSkeleton />}>
              <Table query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
              <Pagination totalPages={1} />
            </div>



    </main>
  );
}