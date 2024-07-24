import prisma from "@/db";
import Image from "next/image";

export default async function Gallery() {
  let images = await prisma.galleryItem.findMany();
  let res = images.map((image) => {
    return (
      <div key={image.id} className={'text-lg flex flex-col items-center gallery-image m-2 relative shadow'}>
        <div className={'gallery-data-top bg-galleryGradientBottom h-1/2 w-full absolute bottom-0'}>
          <p className={'absolute text-xl font-medium top-0 text-center mt-3 w-full'}>
            {image.title}
          </p>
        </div>
        <Image src={image.imagePath} alt={image.title} key={image.id} width={1920} height={1080} className={'h-[360px] w-auto border-4 border-bgDarkGray bg-bgLightGray'}/>
        <div className={'gallery-data-bottom bg-galleryGradientTop h-1/2 w-full'}>
          <p className={'absolute bottom-0 text-center mb-3 w-full'}>
            {image.description}
            <br />
            <span className={'italic'}>par {image.author}</span>
          </p>
        </div>
      </div>
    )
  })

  return (
    <div className={'flex flex-wrap ml-auto mr-auto justify-center min-h-[75vh]'}>
      {res}
    </div>
  )
}