"use server";
import {ReactNode, Suspense} from "react";
import Link from "next/link";
import Image from "next/image";
import {logger} from "@/logger";
import Footer from "@/components/footer";
import {getServerStatus} from "@/utils";

function StickyBackground({ text, type }: {text: string, type: "home" | "other" }) {
  const currHour = new Date().getHours();
  const bgClass = type === "home" ? (currHour < 17 && currHour > 6 ? "bg-homeBackgroundDay" : "bg-homeBackgroundNight") : "bg-defaultBackground";
  const height = type === "home" ? "h-[100vh]" : "h-[25vh]";
  return (
    <div>
      <div className={`sticky z-0 top-0 w-full ${height} inline-block ${bgClass} bg-cover bg-fixed bg-center bg-no-repeat`}/>
      {type === 'home' && <div className={"absolute top-0 left-0 w-full h-full bg-black bg-opacity-30"} />}
      <h1
        className={"fixed font-monocraft text-center w-full top-1/2 left-1/2 translate-x-[-50%] translate-y-[-100%] text-2xl max-lg:px-3 lg:text-4xl 2xl:text-5xl [text-shadow:4px_4px_4px_rgba(0,0,0,0.5)]"}>{text}</h1>
    </div>
  )
}

function ServerStatusSkeleton(props : {statusColor?: string, statusText?: string, players?: number}) {
  return (
    <div className={'hidden sm:block h-[70px] shadow-underline overflow-clip resize-none w-[210px]'}>
      <p className={'text-lg relative top-1/2 -translate-y-1/2 text-nowrap leading-6'}>
        Serveur : <span className={props.statusColor}>{props.statusText}</span><br />
        Joueurs connectés : <span className={'font-bold'}>{props.players}</span>
      </p>
    </div>
  )
}

async function ServerStatus() {
  const res = await getServerStatus();
  const online = res.isOnline;
  const players = res.onlinePlayers;
  const statusColor = online ? "text-greenText" : "text-redText";
  const statusText = online ? "ON" : "OFF";
  return <ServerStatusSkeleton statusColor={statusColor} statusText={statusText} players={players} />;
}

function SocialButtons() {
  return (
    <div className={"w-[210px] text-right hidden sm:block"}>
      <div className={"inline-block shadow-underline h-[70px] overflow-hidden resize-none self-end text-nowrap"}>
        <Link key="discord" href="https://discord.gg/jn8jrvsMyK"
              className={`relative inline-block w-[64px] h-[50px] text-baseText hover:text-pinkText text-center bg-discord bg-[position:top_center] bg-no-repeat bg-[length:48px_48px] hover:bg-discordHover ease-out duration-500 transition-all`}>
          <p className={"relative top-[85%] text-lg text-nowrap"}>Discord</p>
        </Link>
        <a key="github" href="https://github.com/EkaiiMC"
           className={`relative inline-block w-[64px] h-[50px] text-baseText hover:text-pinkText text-center bg-github bg-[position:top_center] bg-no-repeat bg-[length:48px_48px] hover:bg-githubHover ease-out duration-500 transition-all ml-2`}>
          <p className={"relative top-[85%] text-lg text-nowrap"}>Github</p>
        </a>
      </div>
    </div>
  )
}

function InfoDisplay(props : {type: "home" | "other"}) {
  const size = props.type === "home" ? "h-[150px] sm:h-[90px] -top-[150px] sm:-top-[90px]" : "h-[90px] -top-[90px]";

  return (
    <div className={`relative flex align-baseline bottom-0 bg-bgGray p-[10px_10px] justify-between border-t-[3px] border-t-topBorder ${size}`} >
      <Suspense fallback={<ServerStatusSkeleton />}>
        <ServerStatus />
      </Suspense>
      <div className={'relative w-[300px] h-[200px] min-w-[230px] -top-[130px] resize-none justify-self-center mr-2 ml-2 max-md:mx-auto'}>
        <Image
          src={"/images/logo.svg"}
          alt={"logo"}
          className={"object-contain"}
          fill={true}
          priority={true}
        />
      </div>
      <SocialButtons />
    </div>
  )
}

export default async function Layout(props : {type: "home" | "other", children: ReactNode}) {
  return (
    <main className={'min-h-screen flex flex-col overflow-x-hidden z-10'}>
      <StickyBackground text={(props.type === "home") ? "Une aventure Minecraft libre et vanilla" : ""}
                        type={props.type}/>
      <div className="relative bg-bgGray pb-[40px] flex-grow z-10">
        <InfoDisplay type={props.type}/>
        {props.children}
      </div>
      <Footer/>
    </main>
  )
}
