import prisma from "@/db";
import Image from "next/image";
import React from "react";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Galerie',
  description: 'La galerie d\'images d\'Ekaii. Découvrez les créations de notre communauté !',
  openGraph: {
    title: 'Galerie',
    description: 'La galerie d\'images d\'Ekaii. Découvrez les créations de notre communauté !',
    url: 'https://www.ekaii.fr/gallery',
    images: [
      {
        url: "https://sharex.ekaii.fr/u/E4Gmen.png"
      },
    ],
    locale: 'fr_FR',
    type: 'website',
    siteName: 'Ekaii',
  }
}

export const dynamic = 'force-dynamic';

export default async function Gallery() {
  let images = await prisma.galleryItem.findMany({orderBy: {rank: 'asc'}});
  let res: React.ReactNode;
  if (images.length === 0) {
    res = <p className={'text-2xl text-center w-4/5 md:w-1/2 p-3 pb-5 ml-auto mr-auto relative -top-10 italic text-redText mt-5'}>Aucune image à afficher</p>
  } else {
    res = images.map((image) => {
      return (
        <div key={image.id}
             className={'text-lg flex flex-col items-center gallery-image m-2 relative shadow'}>
          <div className={'relative w-full'}>
            <Image src={image.imagePath} alt={image.title} key={image.id} layout="responsive" width={640} height={360}
                   className={'border-4 border-bgDarkGray bg-bgLightGray max-w-[640px]'}/>
            <div className={'gallery-data-top bg-galleryGradientBottom h-1/2 w-full absolute bottom-0'}>
              <p className={'absolute text-xl font-medium top-0 text-center mt-3 w-full'}>
                {image.title}
              </p>
            </div>
            <div className={'gallery-data-bottom bg-galleryGradientTop h-1/2 w-full absolute bottom-0'}>
              <p className={'absolute bottom-0 text-center mb-3 w-full'}>
                {image.description}
                <br/>
                <span className={'italic'}>par {image.author}</span>
              </p>
            </div>
          </div>
        </div>
      )
    })
  }

  return (
    <>
      <h1
        className={"font-monocraft text-4xl text-left shadow-underline w-4/5 md:w-1/2 p-3 pb-5 ml-auto mr-auto relative -top-10"}>Galerie</h1>
      <div className={'flex flex-wrap ml-auto mr-auto justify-center content-start'}>
        {res}
      </div>
    </>
  )
}