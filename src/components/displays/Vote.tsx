import {getServerSession} from "next-auth";
import VoteButton from "@/components/buttons/VoteButton";

export default function Vote() {
  return (getServerSession().then((session) => {
    if (session == null) {
      return (
        <div className={"flex flex-col justify-center w-1/2 p-3 pb-3 shadow-underline"}>
          <p className={"leading-5 mt-3 text-redStatus text-center"}>
            Vous devez être connecté pour voter !
          </p>
        </div>
      ) //TODO: Add links
    } else {
      return (
        <div className={"relative inline-flex flex-col justify-between w-full p-3 pb-3"}>
          <div className={"relative inline-flex flex-row justify-center"}>
            <VoteButton href={"/"} text={"serveur-minecraft.org"}/>
            <VoteButton href={"/"} text={"serveur-minecraft.com"}/>
            <VoteButton href={"/"} text={"serveur-prive.net"}/>
          </div>
          <div className={"relative inline-flex flex-row justify-center"}>
            <VoteButton href={"/"} text={"top-serveur.net"}/>
            <VoteButton href={"/"} text={"liste-serveurs-minecraft.org"}/>
          </div>
          <div className={"relative inline-flex m-auto h-1 w-1/2 shadow-underline mt-2"}/>
        </div>
      )
    }
  }))
}