export const dynamic = "force-dynamic";
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';
import { auth } from '@/auth';
import { UserIcon } from '@heroicons/react/24/solid';

export default async function Page() {
  const session = await auth();
  const username = session?.user?.name || 'Guest';
  const userId = session?.user?.id || 'Not available';

  return (
    <main className="relative bg-gray-100 min-h-screen flex flex-col items-center justify-between">
      
      {/* Header User Info */}
      <header className="absolute top-4 right-6 flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-md border border-gray-200">
        <div className="bg-blue-100 p-1 rounded-full">
          <UserIcon className="w-5 h-5 text-blue-600" />
        </div>
        <div className="text-gray-800 leading-tight">
          <p className="font-semibold text-sm">{username}</p>
          <p className="text-[10px] text-gray-500">{userId}</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center mt-28">
        <h1 className={`${lusitana.className} text-2xl md:text-4xl text-center font-bold text-gray-800 leading-snug`}>
          <span className="text-blue-600">ENERGY EFFICIENT,</span> <br/> 
          <span className="text-green-600">HEALTH SAFE</span> <br/> 
          <span className="text-gray-700">&</span> <br/> 
          <span className="text-indigo-600">SUSTAINABLE SMART BUILDINGS</span>
        </h1>

        {/* Decorative Line */}
        <div className="w-24 h-1 bg-blue-500 rounded-full mt-4"></div>

        {/* Image */}
        <div className="flex items-center justify-center p-6 md:px-28 md:py-12">
          <Image
            src="/smart_building.png"
            width={320}
            height={320}
            className="hidden md:block"
            alt="Smart Building Illustration"
          />
          <Image
            src="/smart_building.png"
            width={280}
            height={280}
            className="block md:hidden"
            alt="Smart Building Illustration"
          />
        </div>
      </div>

      {/* GDPR Footer */}
      <footer className="w-full text-center text-[10px] sm:text-xs text-gray-500 pb-4 px-4 leading-snug">
        © 2025 Pilot-5 — All personal data collected through this platform are processed solely
        for the research and operational purposes of the <span className="whitespace-nowrap">Pilot-5 of aerOS project</span>,
        in full compliance with the General Data Protection Regulation (EU) 2016/679 (GDPR).
        No data will be shared with third parties without explicit consent.
      </footer>


    </main>
  );
}
