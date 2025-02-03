// import { Bars3Icon } from '@heroicons/react/24/outline';
import { Bars3BottomLeftIcon } from '@heroicons/react/24/outline';

import { lusitana } from '@/app/ui/fonts';

export default function AerosLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
    >
      <Bars3BottomLeftIcon className="h-12 w-12 stroke-[2]" />
      <p className="text-[44px] stroke[3]" >aerOS</p>
    </div>
  );
}
