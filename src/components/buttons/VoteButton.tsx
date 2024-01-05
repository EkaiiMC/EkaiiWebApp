export default function VoteButton({href, text}: { href: string, text: string}) {
  return (
    <a href={href}
       className={`max-h-7 p-[1px_12px] overflow-scroll m-1 bg-socialHoverColor font-bold text-textColor border-[3px] text-sm border-solid border-voteButtonBorder hover:border-voteButtonBorderHover`}>
      {text}
    </a>
  )
}