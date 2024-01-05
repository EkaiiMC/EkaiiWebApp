import ServerStatus from "@/components/displays/ServerStatus";
import Image from "next/image";
import SocialButtons from "@/components/displays/SocialButtons";

export default function TopBand() {
  return (
    <div className={"flex justify-between h-[75px]"}>
      <ServerStatus/>
      <div className={"relative inline-block w-[180px] h-[200px] -top-[95px] left-1/2 -translate-x-1/2"}>
        <Image
          src={"/images/logo.svg"}
          alt={"logo"}
          layout={"fill"}
          objectFit={"contain"}
        />
      </div>
      <SocialButtons/>
    </div>
  )
}