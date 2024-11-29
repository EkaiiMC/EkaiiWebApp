import prisma from "@/db";
import React from "react";
import {Metadata} from "next";
import GalleryList from "@/components/gallery-item";

export const metadata: Metadata = {
  title: 'Galerie',
  description: 'La galerie d\'images d\'Ekaii. Découvrez les créations de notre communauté !',
  openGraph: {
    title: 'Galerie',
    description: 'La galerie d\'images d\'Ekaii. Découvrez les créations de notre communauté !',
    url: 'https://www.ekaii.fr/gallery',
    locale: 'fr_FR',
    type: 'website',
    siteName: 'Ekaii',
  }
}

export const dynamic = 'force-dynamic';

export default async function Gallery() {
  let images = await prisma.galleryItem.findMany({orderBy: {rank: 'asc'}});

  return (
    <>
      <div className={'w-4/5 md:w-1/2 mx-auto relative -top-10'}>
        <h1
          className={"font-monocraft text-4xl text-left shadow-underline p-3 pb-5 mb-5"}>Galerie</h1>
        <p className={'text-lg'}>Découvre le monde merveilleux et plein de surprises qu&apos;est celui d&apos;Ekaii au travers des
          yeux de nos joueurs. Des plus belles créations à la plus grande destruction, leur génie ne cessera
          de vous surprendre. Chacun peut partager sa vision, montre nous la tienne. Clique sur les images pour avoir plus de détails.</p>
      </div>
      <div className={'flex flex-wrap ml-auto mr-auto justify-center content-start'}>
        <GalleryList images={images}/>
      </div>
    </>
  )
}