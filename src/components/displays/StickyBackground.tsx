import Image from "next/image";

export default function StickyBackground({image, text, type}: { image: string, text: string, type: "home" | "other" }) {
  switch (type) {
    case "home":
      return (
        <div className={"sticky top-0 w-full h-[90vh] inline-block bg-mainBackground bg-cover"}>
          <h2
            className={"font-monocraft text-center w-3/4 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-2xl lg:text-4xl [text-shadow:4px_4px_4px_rgba(0,0,0,0.5)]"}>{text}</h2>
        </div>
      )
    case "other":
      return (
        <div className={"sticky top-0 max-h-[30vh] w-full"}>
          <Image
            src={image}
            alt={"background"}
            width={1920} height={1080}
          />
          <h2
            className={"font-monocraft text-center w-3/4 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-2xl [text-shadow:4px_4px_4px_rgba(0,0,0,0.5)]"}>{text}</h2>
        </div>
      )
  }

}