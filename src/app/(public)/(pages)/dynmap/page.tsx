import {Metadata} from "next";

export const metadata : Metadata = {
  title: 'Dynmap'
}

export default function DynMap() {
  return (
    <>
      <h1 className={"font-monocraft text-4xl text-left shadow-underline w-1/2 p-3 pb-5 ml-auto mr-auto relative -top-10 mb-5"}>Dynmap</h1>
      <embed type={'text/html'} src={'https://map.ekaii.fr'} className={'relative -top-10 w-full h-[80vh]'}/>
    </>
  )
}