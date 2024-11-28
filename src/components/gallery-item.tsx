"use client";
import {GalleryItem} from "@prisma/client";
import {ReactNode, useState} from "react";
import Image from "next/image";

export default function GalleryList({images}: { images: GalleryItem[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<GalleryItem | null>(null);

  let res: ReactNode;

  if (images.length === 0) {
    res = <p className={'text-2xl text-center w-4/5 md:w-1/2 p-3 pb-5 ml-auto mr-auto relative -top-10 italic text-redText mt-5'}>Aucune image à afficher</p>
  } else {
    res = images.map((image) => {
      return (
        <div key={image.id} onClick={() => {setModalImage(image); setIsModalOpen(true)}}
             className={'text-lg flex flex-col items-center gallery-image m-2 relative shadow'}>
          <div className={'relative w-full'}>
            <Image src={image.imagePath} alt={image.title} key={image.id} width={640} height={360}
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
                <span className={'italic'}>screenshot par {image.author}</span>
              </p>
            </div>
          </div>
        </div>
      )
    })
  }
  return <>
    {res}
    {isModalOpen && modalImage && (
      <div className={'fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 z-50'} onClick={() => setIsModalOpen(false)}>
        <div className={'relative m-auto top-1/2 -translate-y-1/2 bg-bgLightGray p-3 w-3/4'}
             onClick={(e) => e.stopPropagation()}>
          <h2 className={'text-3xl font-bold text-center'}>{modalImage.title}</h2>
          <p className={'text-lg italic text-center mb-2'}>Screenshot par {modalImage.author}</p>
          <Image src={modalImage.imagePath} alt={modalImage.title} width={1280} height={720}
                 className={'border-4 border-bgDarkGray bg-bgLightGray h-full w-full object-scale-down'}/>
          <p className={'text-xl mt-3'}>{modalImage.description}</p>
        </div>
      </div>
    )}
  </>
}