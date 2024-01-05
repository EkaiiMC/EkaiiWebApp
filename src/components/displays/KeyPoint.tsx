import Image from 'next/image'

export default function KeyPoint({icon, name, content, link} : {icon: string, name: string, content: string, link: {href: string, text: string}}) {
    return (
        <div className={"relative flex flex-col m-[0px_30px] p-7 bg-lighterGray shadow-[0px_0px_10px] shadow-darkerGray"}>
            <div className={"absolute inline-block w-[64px] h-[64px] -top-[35px] left-1/2 -translate-x-1/2"}>
                <Image
                    src={icon}
                    alt={"icon"}
                    width={160} height={160}
                    className={"object-contain"}
                />
            </div>
            <h3 className={"text-xl text-center font-bold uppercase"}>{name}</h3>
            <p className={"leading-5 mt-3 text-left"}>{content}</p>
            <a href={link.href} className={"text-right mt-3 text-textColorSecondary"}>{link.text} {' >'}</a>
        </div>
    )
}