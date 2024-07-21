import Image from "next/image";

export default function JoinDisplay({index, title, text, image} : {index: number, title: string, text: string, image: string}) {
  return (
    <div className={"relative flex flex-col m-[0px_30px] p-7 bg-bgLightGray shadow-[0px_0px_10px] w-1/3 border-4 border-bgDarkGray shadow-bgDarkGray text-lg text-justify transition-all ease-in-out hover:border-darkPink hover:bg-pinkText duration-500"}>
      <h3 className={"text-xl text-left font-bold uppercase"}>{index}. {title}</h3>
      <p className={"mt-3 leading-7"}>{text}</p>
    </div>
  )
}