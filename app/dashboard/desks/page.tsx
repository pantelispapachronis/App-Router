
import { DeskRecommendation, LeaveRoomButton} from '@/app/ui/desks/buttons';
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
      <div className="mt-4 flex flex-col items-stretch gap-4 md:mt-8 md:flex-row md:items-center">
  <div className="w-full md:w-auto flex justify-start">
    <DeskRecommendation />
  </div>
  <div className="w-full md:w-auto flex justify-start">
    <LeaveRoomButton />
  </div>
</div>
      
      
       
    </div>
  );
}
