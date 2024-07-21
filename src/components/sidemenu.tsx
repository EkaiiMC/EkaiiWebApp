import Image from "next/image";
import {auth, signOut} from "@/auth";
import {DASHBOARD_VERSION} from "@/global-params";
import Link from "next/link";
import {DashboardButton} from "@/components/dashboard-menu-buttons";
import {isDesignerOrMore, isMaintainer, isWhitelisterOrMore} from "@/api-auth";
import {User} from "@auth/core/types";

export default async function SideMenu() {
  const session = await auth();

  if (!session || !session.user) {
    return null;
  }

  const user : User & {role: string} = session.user as User & {role: string};

  return (
    <aside className="flex flex-col max-h-full min-h-[100vh] bg-bgGray text-white min-w-[300px] overflow-hidden">
      <Link href={'/dashboard'} className="flex items-center justify-center bg-bgDarkGray p-1 hover:text-pinkText transition-all duration-500 ease-out">
        <Image src={'../images/logo-no-text.svg'} alt={'Logo Ekaii'} width={64} height={64} className={'relative -top-[2px]'}/>
        <h1 className={'font-monocraft text-3xl'}>Dashboard</h1>
      </Link>
      <div className="flex flex-col items-center justify-start h-full">
        {isWhitelisterOrMore(user.role) && <DashboardButton href="/dashboard/server" imageUrl={'../images/server.svg'}
                          imageAlt={'Serveur'}>Serveur</DashboardButton>}
        {isWhitelisterOrMore(user.role) && <DashboardButton href="/dashboard/players" imageUrl={'../images/player.svg'}
                          imageAlt={'Serveur'}>Joueurs</DashboardButton>}
        {isDesignerOrMore(user.role) && <DashboardButton href="/dashboard/projects" imageUrl={'../images/roles/designer.svg'}
                          imageAlt={'Serveur'}>Projets</DashboardButton>}
        {isWhitelisterOrMore(user.role) && <DashboardButton href="/dashboard/access" imageUrl={'../images/key.svg'} imageAlt={'Gestion Accès'}>Gestion des
          accès</DashboardButton>}
        {isMaintainer(user.role) && <DashboardButton href="/dashboard/votes" imageUrl={'../images/first.svg'}
                          imageAlt={'Votes'}>Votes</DashboardButton>}
        <div className={'bg-bgLightGray h-1 w-2/3'} />
        <DashboardButton href="/" imageUrl={'../images/logo-no-text.svg'} imageAlt={'Serveur'}>Retour au site</DashboardButton>
      </div>
      <div className="flex items-center justify-start bg-bgDarkGray p-1 w-full">
        <Image src={session.user.image!} alt={session.user.name!} width={32} height={32} className={'m-2'}/>
        <h2 className={'text-lg'}>{session.user.name}</h2>
        <form className={'flex items-center ml-auto mr-1'} action={async () => {
          "use server"
          await signOut()
        }
        }>
          <button type={'submit'} className={'mt-auto mb-auto h-[32px] w-[32px] bg-no-repeat bg-[length:32px_32px] bg-logout hover:bg-logoutHover transition-all ease-out duration-500'} />
        </form>
      </div>
      <div className={'text-bgGray bg-bgDarkGray text-center'}>Ekaii Dashboard v{DASHBOARD_VERSION}</div>
    </aside>
  );
}