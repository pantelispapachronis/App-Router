
import { DeskRecommendation } from '@/app/ui/desks/buttons';
import { lusitana } from '@/app/ui/fonts';

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


  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Desks</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <DeskRecommendation />
      </div>
      
       
    </div>
  );
}
