import {auth} from "@/auth";
import {isMaintainer, isWhitelisterOrMore} from "@/api-auth";
import {User} from "@auth/core/types";
import {redirect} from "next/navigation";
import VoteSitesList from "@/components/vote-sites-list";
import Leaderboard from "@/components/leaderboard";

export default async function VotePage() {
  const session = await auth();

  if (!session || !session.user || !isMaintainer((session.user as User & { role: string }).role)) {
    return redirect('/dashboard');
  }

  return (
    <div className={'flex flex-col h-screen'}>
      <div className={'m-4'}>
        <VoteSitesList />
      </div>

      <div className={'flex flex-grow overflow-hidden'}>
        <div className={'flex-grow overflow-y-auto w-1/2 ml-4 mr-2 mb-4'}>
          <Leaderboard type='monthly' />
        </div>
        <div className={'flex-grow overflow-y-auto w-1/2 mr-4 ml-2 mb-4'}>
          <Leaderboard type='global' />
        </div>
      </div>
    </div>
  );
}