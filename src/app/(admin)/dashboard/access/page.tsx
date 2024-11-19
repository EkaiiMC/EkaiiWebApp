import { isMaintainer, isWhitelisterOrMore } from "@/api-auth";
import { User } from "@auth/core/types";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Whitelist from "@/components/whitelist";
import Roles from "@/components/roles";
import APIKeys from "@/components/api-keys";

export default async function AccessPage({ searchParams }: { searchParams: { manage?: string } }) {
  const session = await auth();

  if (!session || !session.user || !isWhitelisterOrMore((session.user as User & { role: string }).role)) {
    return redirect('/dashboard');
  }

  const selectedFeature = searchParams.manage || 'whitelist';

  return (
    <div className={'m-4 flex flex-col h-[95vh]'}>
      <h1 className="text-7xl font-bold">Gestion des accès</h1>
      <div className="flex text-lg mt-5">
        <a href="?manage=whitelist" className={`px-4 py-2 hover:bg-pinkText transition-all duration-500 ${selectedFeature === 'whitelist' ? 'bg-selectedPink text-white' : 'bg-bgDarkGray'}`}>Whitelist</a>
        {isMaintainer((session.user as User & { role: string }).role) && (
          <>
            <a href="?manage=roles" className={`px-4 py-2 hover:bg-pinkText transition-all duration-500 ${selectedFeature === 'roles' ? 'bg-selectedPink text-white' : 'bg-bgDarkGray'}`}>Grades</a>
            <a href="?manage=apiKeys" className={`px-4 py-2 hover:bg-pinkText transition-all duration-500 ${selectedFeature === 'apiKeys' ? 'bg-selectedPink text-white' : 'bg-bgDarkGray'}`}>Clés API</a>
          </>
        )}
      </div>
      <div className="flex-grow flex flex-col">
        {selectedFeature === 'whitelist' && <Whitelist isMaintainer={isMaintainer((session.user as User & { role: string }).role)}/>}
        {selectedFeature === 'roles' && isMaintainer((session.user as User & { role: string }).role) && <Roles />}
        {selectedFeature === 'apiKeys' && isMaintainer((session.user as User & { role: string }).role) && <APIKeys />}
      </div>
    </div>
  );
}