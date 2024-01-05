'use client';

import ConnectedBullet from "@/components/props/ConnectedBullet";
import {signOut} from "next-auth/react";

export default function ConnectedMenu({name}: {name: string}) {
  return (
    <div className={"relative p-[5px_12px] bg-baseGray inline-flex border-lighterGray border-[2px] justify-center align-middle cursor-pointer hover:border-darkerGray dropdown"}>
      <ConnectedBullet />
      <div className={"inline-block relative top-1/2 -translate-y-1/2"}>{name}</div>
      <div className={"dropdown-content relative top-full right-0"}>
        <div className={"relative bg-baseGray border-darkerGray border-2"}>
          <a className={"block pl-2 pt-1 pr-2 hover:text-textColorSecondary"} href={"/profile"}>Voir le profil</a>
          <a className={"block pl-2 pb-1 pr-2 hover:text-textColorSecondary"} onClick={() => {signOut()}}>Se déconnecter</a>
        </div>
      </div>
    </div>
  )
}