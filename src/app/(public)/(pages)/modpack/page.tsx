import {Pack, PackSkeleton} from "@/components/modpack";
import {Suspense} from "react";
import {Metadata} from "next";

export const dynamic = 'force-dynamic';

export const metadata : Metadata = {
  title: 'Modpack',
  description: 'Notre modpack customisé pour Ekaii, pour une expérience de jeu optimale.',
  openGraph: {
    title: 'Modpack',
    description: 'Notre modpack customisé pour Ekaii, pour une expérience de jeu optimale.',
    url: 'https://www.ekaii.fr/modpack',
    images: [
      {
        url: "https://avatars.githubusercontent.com/u/155087037?s=200&v=4"
      },
    ],
    locale: 'fr_FR',
    type: 'website',
    siteName: 'Ekaii',
  }
}

export default function Modpack() {
  return (
    <div className={'h-full'}>
      <h1 className={"font-monocraft text-4xl text-left shadow-underline w-4/5 md:w-2/3 lg:w-1/2 p-3 pb-5 ml-auto mr-auto relative -top-10"}>Modpack</h1>
      <p className={'text-lg mb-7 w-4/5 md:w-2/3 lg:w-1/2 ml-auto mr-auto pb-5'}>
        Afin de compléter l&apos;expérience du serveur, nous proposons un modpack customisé pour notre serveur. Il contient essentiellement des mods
        d&apos;optimisation, de décoration, et de qualité de vie. Deux versions sont disponibles : EkaiiLite, focalisé sur la performance, et EkaiiPlus,
        pour ceux qui veulent une expérience plus complète. Bien sûr, tu es libre de jouer sans le modpack, mais nous te recommandons de l&apos;essayer !
      </p>
      <Suspense fallback={<PackSkeleton type={"ekaii-lite"} />}>
        <Pack className={'bg-bgLightGray border-bgDarkGray border-2 ml-auto mr-auto flex flex-col lg:flex-row justify-center w-3/4 sm:w-1/2 lg:w-[900px] mb-3'} type={'ekaii-lite'}/>
      </Suspense>
      <Suspense fallback={<PackSkeleton type={"ekaii-plus"} />}>
        <Pack className={'bg-bgLightGray border-bgDarkGray border-2 ml-auto mr-auto flex flex-col lg:flex-row justify-center w-3/4 sm:w-1/2 lg:w-[900px]'} type={'ekaii-plus'}/>
      </Suspense>
    </div>
  )
}