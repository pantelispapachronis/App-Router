import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import AerosLogo from "@/app/ui/aeros-logo";
import { PowerIcon } from "@heroicons/react/24/outline";
import { signOut, auth } from "@/auth"; // Import getSession to retrieve user session

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <AerosLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form
  action={async () => {
    "use server";

    const ts = () =>
      new Date().toLocaleString("el-GR", { timeZone: "Europe/Athens" });

    const session = await auth();
    const userId = session?.user?.id;

    const response2 = await fetch(
      `http://localhost:3000/api/mqtt/sendserver?presence=FALSE&userid=${userId}`
    );
    const data2 = await response2.json();

    console.log("\n────────────── User signed out ───────────────\n");
    console.log(`[${ts()}]\n`);
    console.log(`User ID: ${userId}`);
    console.log("\n──────────────────────────────────────────────");

    await signOut({ redirectTo: "/" });
  }}
>

          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
