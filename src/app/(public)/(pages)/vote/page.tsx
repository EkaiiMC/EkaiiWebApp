import {auth} from "@/auth";
import VoteLinks from "@/components/votelinks";
import prisma from "@/db";

export default async function Vote() {

  const session = await auth();
  const voteSites = await prisma.voteSite.findMany();

  return (
    <div className={"relative -top-8 w-1/2 p-3 pb-5 shadow-underline ml-auto mr-auto text-justify"}>
      <h1 className={"font-monocraft text-2xl text-left"}>Voter</h1>
      <p className={"leading-5 mt-3 text-lg"}>
        Voter permet de faire connaître le serveur et de le faire monter dans les classements, permettant ainsi d&amp;apos;agrandir notre communauté. Et comme on dit, plus on est de fous, plus on rit !<br/> Cela permet également de gagner des récompenses cosmétiques. Pour voter, il suffit de cliquer sur les liens ci-dessous :
      </p>
      <VoteLinks isConnected={session !== null} voteSites={voteSites}/>
    </div>
  )
}