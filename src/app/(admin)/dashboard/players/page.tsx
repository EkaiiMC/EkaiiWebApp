import {BannedPlayerList, OnlinePlayerList} from "@/components/playerlists";
import {auth} from "@/auth";
import {isWhitelisterOrMore} from "@/api-auth";
import {User} from "@auth/core/types";
import {redirect} from "next/navigation";

export default async function PlayersPage() {
  const session = await auth();

  if (!session || !session.user || !isWhitelisterOrMore((session.user as User & { role: string }).role)) {
    return redirect('/dashboard');
  }

  return (
    <div className={'flex h-full text-center text-lg'}>
      <OnlinePlayerList />
      <BannedPlayerList />
    </div>
  );
}