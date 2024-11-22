import prisma from "@/db";
import Image from "next/image";
import React from "react";
import {Metadata} from "next";

export const metadata : Metadata = {
  title: 'Galerie'
}

export default async function Gallery() {
  let images = await prisma.galleryItem.findMany({orderBy: {rank: 'asc'}});
  let res : React.ReactNode;
  if (images.length === 0) {
    res = <p className={'text-2xl text-center w-4/5 md:w-1/2 p-3 pb-5 ml-auto mr-auto relative -top-10 italic text-redText mt-5'}>Aucune image à afficher</p>
  } else {
    res = images.map((image) => {
      return (
        <div key={image.id}
             className={'text-lg flex flex-col items-center gallery-image m-2 relative shadow max-h-[360px] w-auto'}>
          <div className={'gallery-data-top bg-galleryGradientBottom h-1/2 w-full absolute bottom-0'}>
            <p className={'absolute text-xl font-medium top-0 text-center mt-3 w-full'}>
              {image.title}
            </p>
          </div>
          <Image src={image.imagePath} alt={image.title} key={image.id} width={1920} height={1080}
                 className={'max-h-[360px] w-auto border-4 border-bgDarkGray bg-bgLightGray'}/>
          <div className={'gallery-data-bottom bg-galleryGradientTop h-1/2 w-full'}>
            <p className={'absolute bottom-0 text-center mb-3 w-full'}>
              {image.description}
              <br/>
              <span className={'italic'}>par {image.author}</span>
            </p>
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