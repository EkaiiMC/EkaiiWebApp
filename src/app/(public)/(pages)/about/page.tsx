import {getDiscordMembersCount} from "@/utils";
import Counter from "@/components/counter";
import PinkHoverDisplay from "@/components/pink-hover-display";

export default async function About() {
  const memberCount = await getDiscordMembersCount();


  return (
    <div className="h-full flex flex-col content-center">
      <h1
        className="font-monocraft text-4xl text-left shadow-underline w-4/5 md:w-1/2 p-3 pb-5 ml-auto mr-auto relative -top-10">
        À propos
      </h1>
      <PinkHoverDisplay className={'lg:w-1/2 mx-auto max-lg:mx-4'} title={"Une véritable expérience vanilla"} text={"Ekaii a pour projet de reproduire au mieux ce qu'un joueur en solo pourrait vivre au cours de son aventure Minecraft. C'est à dire le jeu tel qu'il a été développé, avec ses mécaniques et ses bugs, le tout en assurant des performances de jeu optimales, et en compagnie d'une communauté chaleureuse et accueillante. Ekaii est éternel : aucune crainte de perdre sa progression à chaque nouvelle version, c'est les versions qui s'adaptent au serveur."}/>
      <div
        className={'flex flex-col min-[780px]:flex-row content-center flex-wrap min-[780px]:flex-nowrap justify-between mx-auto w-4/5 min-[1800px]:w-[60vw] min-[1900px]-w-[55vw] min-[2200px]:w-1/2'}>
        <Counter lowerBound={0} upperBound={memberCount} content={"Joueurs"}/>
        <Counter lowerBound={200} upperBound={0} content={'Resets'}/>
        <Counter lowerBound={300} upperBound={0} content={'Plugins inutiles'}/>
      </div>
      <PinkHoverDisplay className={'lg:w-1/2 mx-auto max-lg:mx-4'} title={"Un serveur surpuissant"} text={"Hébergé sur une machine disposant des meilleurs composants disponibles sur le marché, basé sur Folia, les performances proposées par Ekaii sont considérables. Cela nous permet de proposer à nos joueurs des distances de rendu et de simulation identiques à ce que l'on peut retrouver par défaut en solo, tout en permettant aux machines redstone les plus gourmandes de fonctionner sans le moindre pépin, et surtout sans impacter l'expérience des autres joueurs."}/>
      <div className={'shadow-underline w-4/5 md:w-1/2 h-1 mx-auto'} />
    </div>
  );
}