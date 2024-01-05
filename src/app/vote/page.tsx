import StickyBackground from "@/components/displays/StickyBackground";
import TopBand from "@/components/displays/TopBand";
import About from "@/components/displays/TextDisplay";
import Leaderboard from "@/components/displays/Leaderboard";
import Vote from "@/components/displays/Vote";

export default function VotePage() {
  return (
    <main>
      <StickyBackground image={"/images/background.png"} text={""} type={"other"}/>
      <div className={"sticky top-[20vh] w-full h-full bg-baseGray"}>
        <TopBand/>

        <div className={"flex justify-center mt-10 mb-10"}>
          <About title={"Voter"} text={"Voter, c'est bien. Si vous votez pas, on vous casse la gueule."}/>
        </div>

        <div className={"flex justify-center mt-10 mb-10"}>
          <Vote/>
        </div>

        <Leaderboard/>
      </div>
    </main>
  )
}