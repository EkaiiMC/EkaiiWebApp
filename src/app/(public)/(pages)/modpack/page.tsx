import {Pack, PackSkeleton} from "@/components/modpack";
import {Suspense} from "react";

export default function Modpack() {
  return (
    <div className={'h-full'}>
      <h1 className={"font-monocraft text-4xl text-left shadow-underline w-1/2 p-3 pb-5 ml-auto mr-auto relative -top-10"}>Modpack</h1>
      <p className={'text-lg mb-7 w-1/2 ml-auto mr-auto pb-5'}>
        Afin de compléter l&apos;expérience du serveur, nous proposons un modpack customisé pour notre serveur. Il contient essentiellement des mods
        d&apos;optimisation, de décoration, et de qualité de vie. Deux versions sont disponibles : EkaiiLite, focalisé sur la performance, et EkaiiPlus,
        pour ceux qui veulent une expérience plus complète. Bien sûr, tu es libre de jouer sans le modpack, mais nous te recommandons de l&apos;essayer !
      </p>
      <Suspense fallback={<PackSkeleton type={"ekaii-lite"} />}>
        <Pack className={'bg-bgLightGray border-bgDarkGray border-2 ml-auto mr-auto flex flex-row justify-center w-[900px] mb-3'} type={'ekaii-lite'}/>
      </Suspense>
      <Suspense fallback={<PackSkeleton type={"ekaii-plus"} />}>
        <Pack className={'bg-bgLightGray border-bgDarkGray border-2 ml-auto mr-auto flex flex-row justify-center w-[900px]'} type={'ekaii-plus'}/>
      </Suspense>
    </div>
  )
}