import {MouseEventHandler, ReactNode} from "react";
import Link from "next/link";
import {auth, signIn, signOut} from "@/auth";
import {hasDashboardAccess} from "@/utils";

export type IButtonProps = {
  text: string;
  textClass?: string;
  href: string;
  onClick?: MouseEventHandler;
  bgColor: string;
  borderColor?: string;
  borderHoverColor?: string;
  textColor?: string;
}

export function Button(props: IButtonProps) {
  const hoverColor = 'hover:' + (props.borderHoverColor ?? 'border-transparent');
  return (
    <Link href={props.href} onClick={props.onClick}
          className={`p-[5px_12px] ${props.bgColor} ${props.textColor ?? 'text-baseText'} border-[3px] border-solid ${props.borderColor ?? 'border-transparent'} hover:border-solid hover:z-10 ${hoverColor} ${props.textClass} text-nowrap text-center ease-out duration-500 transition-all`}>
      {props.text}
    </Link>
  )
}

export function Separator() {
  return (
    <div className={"relative mt-auto mb-auto w-[3px] h-[70%] bg-bgLightGray"}/>
  )
}


export async function LoginButton() {
  const session : any = await auth();

  let elmt: ReactNode;

  if (!session || !session.user) {
    elmt = (
      <form
        action={async () => {
          "use server"
          await signIn("microsoft-entra-id")
        }}
        className={'mt-auto mb-auto'}
      >
        <button type={'submit'}>Se connecter</button>
      </form>
    )
  } else { // session is not null, we are logged in
    elmt = (
      <>
        <div
          className={'border-[0.13rem] border-[#178903] bg-[#67DB29] mr-2 ml-0 w-3 h-3 min-w-3 min-h-3 mt-auto mb-auto'}/>
        <p className={'mt-auto mb-auto'}>Connecté : <span className={'font-medium'}>{session.user.name}</span></p>
        <ul className={'dropdown-menu bg-bgGray border-bgDarkGray border-[3px] w-2/3 min-w-36 -right-[3px] text-left pl-2 leading-7 pt-1 pb-1'}>
          {hasDashboardAccess(session.user.role) && <li className={'hover:text-hoverText'}><Link href={'/dashboard'}>Dashboard</Link></li>}
          <li className={'hover:text-hoverText'}><Link href={'/profile'}>Voir le profil</Link></li>
          <li className={'hover:text-hoverText'}><form action={
            async () => {
              "use server"
              await signOut()
            }
          }><button>Se déconnecter</button></form></li>
        </ul>
      </>
    )
  }

  return (
    <div
      className={'p-[5px_12px] ml-1 bg-bgGray text-baseText border-[3px] border-bgLightGray hover:border-solid hover:border-bgDarkGray text-nowrap text-center cursor-default flex dropdown ease-out duration-500 transition-all h-[40px]'}>
      {elmt}
    </div>
  )
}

export async function DropdownLoginButton() {
  const session = await auth();

  let elmt: ReactNode;

  if (!session || !session.user) {
    elmt = (
      <form
        action={async () => {
          "use server"
          await signIn("microsoft-entra-id")
        }}
        className={'mt-auto mb-auto'}
      >
        <button type={'submit'}>Se connecter</button>
      </form>
    )
  } else { // session is not null, we are logged in
    elmt = (
      <>
        <Link href={'/profile'} className={'flex items-center'}>
          <div
            className={'border-[0.13rem] border-[#178903] bg-[#67DB29] mr-2 w-3 h-3 min-w-3 min-h-3 mt-auto mb-auto'}/>
          <p className={'relative top-[0.05rem]'}>{session.user.name}</p>
        </Link>
        <form action={
          async () => {
            "use server"
            await signOut()
          }
        } className={''}>
          <button type={'submit'}
                  className={'relative top-[0.170rem] my-auto h-[16px] w-[16px] bg-no-repeat bg-[length:16px_16px] bg-logout hover:bg-logoutHover transition-all ease-out duration-500'}/>
        </form>
      </>
    )
  }

  return (
    <div
      className={'flex justify-between px-4 pt-1.5 pb-2.5 text-sm border-x-bgLightGray login:border-b-bgLightGray border-b-bgLightGray border-[3px] border-t-transparent hover:border-bgDarkGray ease-out duration-500 transition-all h-[42px]'}>
      {elmt}
    </div>
  )
}