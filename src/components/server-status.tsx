"use server";

import {getServerStatus} from "@/utils";

export async function ServerStatusSkeleton(props : {statusColor?: string, statusText?: string, players?: number}) {
  return (
    <div className={'hidden sm:block h-[70px] shadow-underline overflow-clip resize-none w-[210px]'}>
      <p className={'text-lg relative top-1/2 -translate-y-1/2 text-nowrap leading-6'}>
        Serveur : <span className={props.statusColor}>{props.statusText}</span><br />
        Joueurs connectés : <span className={'font-bold'}>{props.players}</span>
      </p>
    </div>
  )
}

export async function ServerStatus() {
  const res = await getServerStatus();
  const online = res.isOnline;
  const players = res.onlinePlayers;
  const statusColor = online ? "text-greenText" : "text-redText";
  const statusText = online ? "ON" : "OFF";
  return <ServerStatusSkeleton statusColor={statusColor} statusText={statusText} players={players} />;
}