import {auth} from "@/auth";
import {redirect} from "next/navigation";
import Image from "next/image";
import prisma from "@/db";
import {Metadata} from "next";

export const metadata : Metadata = {
  title: 'Profil'
}

export const dynamic = 'force-dynamic';

export default async function Profile() {
  const session = await auth();

  if(!session || !session.user) {
    return redirect("/");
  }

  // @ts-ignore -
  const user : {name: string, role: string, createdAt: string, image: string, id: string} = session.user;
  const role = (() => {
    switch (user.role) {
      case "MAINTAINER":
        return "Mainteneur";
      case "DEVELOPER":
        return "Développeur";
      case "DESIGNER":
        return "Designer";
      case "WHITELISTER":
        return "Whitelisteur";
      case "MEMBER":
        return "Membre";
      default:
        return "Aucun";
    }
  })();
  const date = (() => {
    const date = new Date(user.createdAt);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return (day < 10 ? "0" + day : day) + "." + (month < 10 ? "0" + month : month) + "." + year;
  })();
  const roleImage = (() => {
    switch (user.role) {
      case "MAINTAINER":
        return "/images/roles/maintainer.svg";
      case "DEVELOPER":
        return "/images/roles/developer.svg";
      case "DESIGNER":
        return "/images/roles/designer.svg";
      case "WHITELISTER":
        return "/images/roles/whitelister.svg";
      case "MEMBER":
        return "/images/roles/member.svg";
      default:
        return "/images/roles/member.svg";
    }
  })();
  const votes = await prisma.monthlyLeaderboard.findFirst({
    where: {
      userId: user.id
    }
  });
  const voteCount = votes ? votes.voteCount : 0;
  const rank = votes ? ('# ' + votes.rank) : 'Pas de rang';


  return (
    <div className={''}>
      <div className={"w-2/3 shadow-underline m-auto"}>
        <h1 className={'text-2xl md:text-4xl font-monocraft'}>Profil : {user.name}</h1>
        <div className={"flex flex-col md:flex-row justify-between w-full mt-7 pb-7 items-start pr-3 flex-grow-[2]"}>
          <Image src={user.image} width={128} height={128} alt={`Photo de profil d'${user.name}`} className={"mx-auto border-bgDarkGray border-[3px] shadow-xl bg-bgLightGray"}/>
          <div className={"w-full mt-4 md:mt-0 md:pl-10 text-left"}>
            <h3 className={'text-xl'}>Inscrit depuis le : <span className={'font-medium'}>{date}</span></h3>
            <h3 className={'text-xl'}>Grade : <span className={'font-medium'}>{role}</span></h3>

            <h3 className={'text-xl mt-6'}>Classement des votes (mois) : <span className={'font-medium'}>{rank}</span></h3>
            <h3 className={'text-xl'}>Nombre de votes (mois) : <span className={'font-medium'}>{voteCount} votes</span></h3>
          </div>
          <Image src={roleImage} alt={role} width={128} height={128} className={"hidden navbar:block"}/>
        </div>
      </div>
      <div className={"w-2/3 shadow-underline m-auto"}>
        <h2 className={'text-2xl sm:text-4xl font-monocraft mt-10'}>Cosmétiques</h2>
        <p className={'text-xl mt-3 italic'}>Coming soon...</p>
      </div>
    </div>

  )
}