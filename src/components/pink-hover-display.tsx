import Image from "next/image";

export default function PinkHoverDisplay({index, title, text, className} : {index?: number, title: string, text: string, className?: string}) {
  return (
    <div className={"relative flex flex-col m-[30px_30px] p-7 bg-bgLightGray shadow-[0px_0px_10px] border-4 border-bgDarkGray shadow-bgDarkGray text-lg text-justify transition-all ease-in-out hover:border-darkPink hover:bg-pinkText duration-500 " + className}>
      <h3 className={"text-xl text-left font-bold uppercase"}>{index ? index + '.' : ''} {title}</h3>
      <p className={"mt-3 leading-7"}>{text}</p>
    </div>
  )
}