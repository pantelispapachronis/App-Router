import { BookDesk, BookDeskError } from './buttons';
import DeskStatus from './status';

export default async function DeskRecTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  //const invoices = await fetchFilteredInvoices(query, currentPage);
  //console.log(invoices);
  
  // Fetch data from the recommendation API
  const response = await fetch('http://localhost:3000/api/recommendation', { 
    cache: 'no-store' 
  });
  const data = await response.json();

  console.log("GIGA BIG");
  console.log(data);
  // Map the API response to the invoice structure
  
  const desks = data.recommendations.map((rec: {desk: number, object: string}) => ({
    id: `desk-${rec.desk}`,
    status: 'available', // Alternating status for demonstration
    name: rec.object,
  }));

  console.log(desks);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          
          <table className="min-w-full text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Desk ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Status
                </th>
                {/* <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Edit</span>
                </th> */}
              </tr>
            </thead>
            <tbody className="bg-white">
              {desks?.map((desk : any) => (
                <tr
                  key={desk.id}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      
                      <p>{desk.name}</p>
                    </div>
                  </td>
                  
                  <td className="whitespace-nowrap px-3 py-3">
                    <DeskStatus status={desk.status} />
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-3">
                      {desk.status === 'available' && <BookDesk id={desk.id} />}
                      {desk.status === 'blocked' && <BookDeskError id={desk.id} />}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
