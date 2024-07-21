import {Button, Separator} from "@/components/buttons";
import {BrowserView, MobileView} from "react-device-detect";

export function ButtonArray() {
    return (
      <>
        <BrowserView>
          <div className={"relative bg-bgGray inline-flex flex-row shadow-md justify-center h-full mr-1"}>
            <div className={"absolute top-0 left-0 w-full h-[3px] bg-bgLightGray"} />
            <Button text={"Accueil"} href={"/"} bgColor={'bg-bgGray'} borderColor={'border-t-bgLightGray border-b-bgLightGray border-l-bgLightGray border-transparent'} borderHoverColor={'border-bgDarkGray'} />
            <Separator />
            <Button text={"Voter"} href={"/vote"} bgColor={'bg-pinkText'} borderColor={'border-basePink z-10'} borderHoverColor={'border-darkPink'}/>
            <Separator />
            <Button text={"Dynmap"} href={"/dynmap"} bgColor={'bg-bgGray'} borderColor={'border-t-bgLightGray border-b-bgLightGray border-transparent'} borderHoverColor={'border-bgDarkGray'}/>
            <Separator />
            <Button text={"Nous rejoindre"} href={"/join"} bgColor={'bg-bgGray'} borderColor={'border-t-bgLightGray border-b-bgLightGray border-transparent'} borderHoverColor={'border-bgDarkGray'}/>
            <Separator />
            <Button text={"À propos"} href={"/about"} bgColor={'bg-bgGray'} borderColor={'border-t-bgLightGray border-b-bgLightGray border-transparent'} borderHoverColor={'border-bgDarkGray'}/>
            <Separator />
            <Button text={"Galerie"} href={"/gallery"} bgColor={'bg-bgGray'} borderColor={'border-t-bgLightGray border-b-bgLightGray border-transparent'} borderHoverColor={'border-bgDarkGray'}/>
            <Separator />
            <Button text={"Modpack"} href={"/modpack"} bgColor={'bg-bgGray'} borderColor={'border-t-bgLightGray border-b-bgLightGray border-r-bgLightGray border-transparent'} borderHoverColor={'border-bgDarkGray'}/>
            <div className={"absolute bottom-0 left-0 w-full h-[3px] bg-bgLightGray"} />
          </div>
        </BrowserView>
        <MobileView>
          <div>

          </div>
        </MobileView>
      </>

    )
}