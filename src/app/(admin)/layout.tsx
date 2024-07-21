import SideMenu from "@/components/sidemenu";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {hasDashboardAccess} from "@/utils";
import {User} from "@auth/core/types";

export default async function DashboardLayout( {children}: Readonly<{children: React.ReactNode}> ) {
  const session = await auth();

  if(!session || !session.user || !hasDashboardAccess((session.user as User & {role: string}).role)) {
    return redirect("/");
  }

  return (
    <div className={'flex flex-row h-full'}>
      <SideMenu />
      <main className={'bg-bgLightGray w-full max-h-full min-h-[100vh]'}>
        {children}
      </main>
    </div>
  );
}