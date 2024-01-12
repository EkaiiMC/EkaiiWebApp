import {MouseEventHandler} from "react";

export function Button({text, href, onClick, isLeftEdge, isRightEdge} : {text: string, href?: string, onClick?: MouseEventHandler, isLeftEdge?: boolean, isRightEdge?: boolean, }) {
    let borderR = isRightEdge ? "border-r-[#2F2B2B]" : "border-r-transparent";
    let borderL = isLeftEdge ? "border-l-[#2F2B2B]" : "border-l-transparent";
    return (
        <a href={href} onClick={onClick}
           className={`p-[5px_12px] bg-baseGray text-textColor border-[3px] border-solid border-transparent hover:border-solid hover:border-darkerGray overflow-hidden`}>
            {text}
        </a>
    )

}

export function VoteButton({text, href} : {text: string, href: string}) {
    return (
        <a href={href}
           className={`inline-flex p-[5px_12px] bg-socialHoverColor font-bold text-textColor border-[3px] border-solid border-voteButtonBorder hover:border-voteButtonBorderHover`}>
            {text}
        </a>
    )

}

export function ButtonSeparator() {
    return (
        <div className={"relative mt-auto mb-auto w-[3px] h-[70%] bg-lighterGray"}/>
    )
}