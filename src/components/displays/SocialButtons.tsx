export default function SocialButtons() {
    return (
        <div className={"inline-block shadow-underline h-full p-1 pb-10 mt-2 mr-1"}>
            <a href="https://discord.gg/jn8jrvsMyK"
               className={`relative inline-block w-[64px] h-[64px] text-socialBaseColor hover:text-socialHoverColor text-center bg-discord bg-[position:top_center] bg-no-repeat bg-[length:48px_48px] hover:bg-discordHover`}>
                <p className={"relative top-[68%]"}>Discord</p>
            </a>
            <a href="https://github.com/EkaiiMC"
               className={`relative inline-block w-[64px] h-[64px] text-socialBaseColor hover:text-socialHoverColor text-center bg-github bg-[position:top_center] bg-no-repeat bg-[length:48px_48px] hover:bg-githubHover`}>
                <p className={"relative top-[68%]"}>Github</p>
            </a>
        </div>
    )
}