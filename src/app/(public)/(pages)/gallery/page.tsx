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
      <h1
        className={"font-monocraft text-4xl text-left shadow-underline w-4/5 md:w-1/2 p-3 pb-5 ml-auto mr-auto relative -top-10"}>Galerie</h1>
      <div className={'flex flex-wrap ml-auto mr-auto justify-center content-start'}>
        <GalleryList images={images}/>
      </div>
    </>
  )
}