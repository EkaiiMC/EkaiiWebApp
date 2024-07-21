import {auth} from "@/auth";
import {redirect} from "next/navigation";
import Image from "next/image";

export default async function Profile() {
  const session = await auth();

  if(!session || !session.user) {
    return redirect("/");
  }

  // @ts-ignore -
  const user : {name: string, role: string, createdAt: string, image: string} = session.user;
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


  return (
    <div className={''}>
      <div className={"w-2/3 shadow-underline m-auto"}>
        <h1 className={'text-4xl font-monocraft'}>Profil : {user.name}</h1>
        <div className={"flex justify-between w-full mt-7 pb-7 items-start pr-3"}>
          <Image src={user.image} width={128} height={128} alt={`Photo de profil d'${user.name}`} className={"border-bgDarkGray border-[3px] shadow-xl bg-bgLightGray"}/>
          <div className={"w-full pl-10"}>
            <h3 className={'text-xl'}>Inscrit depuis le : <span className={'font-medium'}>{date}</span></h3>
            <h3 className={'text-xl'}>Grade : <span className={'font-medium'}>{role}</span></h3>

            <h3 className={'text-xl mt-6'}>Classement des votes : <span className={'font-medium'}>Coming soon...</span></h3>
            <h3 className={'text-xl'}>Nombre de votes : <span className={'font-medium'}>Coming soon...</span></h3>
          </div>
          <Image src={roleImage} alt={role} width={128} height={128} className={""}/>
        </div>
      </div>
      <div className={"w-2/3 shadow-underline m-auto"}>
        <h2 className={'text-4xl font-monocraft mt-10'}>Cosmétiques</h2>
        <p className={'text-lg mt-3'}>Coming soon...</p>
      </div>
    </div>

  )
}