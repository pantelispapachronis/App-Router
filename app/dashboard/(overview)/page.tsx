import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';


export default function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-3xl text-center`}>
      ENERGY EFFICIENT, <br/>HEALTH SAFE<br/> &<br/> SUSTAINABLE <br/>SMART BUILDINGS
      </h1>
      <div className="flex items-center justify-center p-6  md:px-28 md:py-12">
                <Image
                  src="/smart_building.png"
                  width={300}
                  height={300}
                  className="hidden md:block"
                  alt="Smart Building Image showing desktop version"
                />
                <Image
                  src="/smart_building.png"
                  width={300}
                  height={300}
                  className="block md:hidden"
                  alt="Smart Building Image showing mobile version"
                  />
              </div>
    </main>
  );
}
