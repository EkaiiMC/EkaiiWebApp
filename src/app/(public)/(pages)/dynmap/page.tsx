import {Metadata} from "next";

export const dynamic = 'force-dynamic';

export const metadata : Metadata = {
  title: 'Dynmap',
  description: 'La carte interactive d\'Ekaii, pour vous permettre de vous repérer facilement.',
  openGraph: {
    title: 'Dynmap',
    description: 'La carte interactive d\'Ekaii, pour vous permettre de vous repérer facilement.',
    url: 'https://www.ekaii.fr/dynmap',
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

export default function DynMap() {
  return (
    <>
      <h1 className={"font-monocraft text-4xl text-left shadow-underline w-1/2 p-3 pb-5 ml-auto mr-auto relative -top-10 mb-5"}>Dynmap</h1>
      <embed type={'text/html'} src={'https://map.ekaii.fr'} className={'relative -top-10 w-full h-[80vh]'}/>
    </>
  )
}