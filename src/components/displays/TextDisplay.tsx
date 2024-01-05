export default function TextDisplay({title, text}: { title: string, text: string }) {
  return (
    <div className={"flex flex-col justify-center w-1/2 p-3 pb-10 shadow-underline"}>
      <h2 className={"font-monocraft text-2xl text-left"}>{title}</h2>
      <p className={"leading-5 mt-3"}>
        {text}
      </p>
    </div>
  )
}