import {Button, Separator} from "@/components/buttons";
import Dropdown from "@/components/dropdown";

export function ButtonArray() {
  return (
    <div className={"relative inline-flex bg-bgGray flex-row shadow-md justify-center mr-1"}>
      <div className={"absolute top-0 left-0 w-full h-[3px] bg-bgLightGray"}/>
      <Button text={"Accueil"} href={"/"} bgColor={'bg-bgGray'}
              borderColor={'border-t-bgLightGray border-b-bgLightGray border-l-bgLightGray border-transparent'}
              borderHoverColor={'border-bgDarkGray'}/>
      <Separator/>
      <Button text={"Voter"} href={"/vote"} bgColor={'bg-pinkText'} borderColor={'border-basePink z-10'}
              borderHoverColor={'border-darkPink'}/>
      <Separator/>
      <Button text={"Dynmap"} href={"/dynmap"} bgColor={'bg-bgGray'}
              borderColor={'border-t-bgLightGray border-b-bgLightGray border-transparent'}
              borderHoverColor={'border-bgDarkGray'}/>
      <Separator/>
      <Button text={"Nous rejoindre"} href={"/join"} bgColor={'bg-bgGray'}
              borderColor={'border-t-bgLightGray border-b-bgLightGray border-transparent'}
              borderHoverColor={'border-bgDarkGray'}/>
      <Separator/>
      <Button text={"À propos"} href={"/about"} bgColor={'bg-bgGray'}
              borderColor={'border-t-bgLightGray border-b-bgLightGray border-transparent'}
              borderHoverColor={'border-bgDarkGray'}/>
      <Separator/>
      <Button text={"Galerie"} href={"/gallery"} bgColor={'bg-bgGray'}
              borderColor={'border-t-bgLightGray border-b-bgLightGray border-transparent'}
              borderHoverColor={'border-bgDarkGray'}/>
      <Separator/>
      <Button text={"Modpack"} href={"/modpack"} bgColor={'bg-bgGray'}
              borderColor={'border-t-bgLightGray border-b-bgLightGray border-r-bgLightGray border-transparent'}
              borderHoverColor={'border-bgDarkGray'}/>
      <div className={"absolute bottom-0 left-0 w-full h-[3px] bg-bgLightGray"}/>
    </div>
  )
}