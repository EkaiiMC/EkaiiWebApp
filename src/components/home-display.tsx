import Image from "next/image";
import Link from "next/link";

export default function HomeDisplay({icon, name, content, link} : {icon: string, name: string, content: string, link: {href: string, text: string}}) {
  return (
    <div className={"relative flex flex-col m-[0px_30px] p-7 bg-bgLightGray shadow-[0px_0px_10px] shadow-bgDarkGray text-lg justify-between"}>
      <div className={"absolute inline-block w-[64px] h-[64px] -top-[35px] left-1/2 -translate-x-1/2"}>
        <Image
          src={icon}
          alt={"icon"}
          width={160} height={160}
          className={"object-contain"}
        />
      </div>
      <h3 className={"text-xl text-center font-bold uppercase"}>{name}</h3>
      <p className={"leading-5 mt-3 text-left"}>{content}</p>
      <div className={"mt-3 text-right"}>
        <Link href={link.href} className={"text-right text-grayText"}>{link.text} {' >'}</Link>
      </div>
    </div>
  )
}