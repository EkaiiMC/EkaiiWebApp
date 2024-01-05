import Image from 'next/image'
import ServerStatus from "@/components/displays/ServerStatus";
import SocialButtons from "@/components/displays/SocialButtons";
import About from "@/components/displays/TextDisplay";
import KeyPoint from "@/components/displays/KeyPoint";
import TopBand from "@/components/displays/TopBand";
import StickyBackground from "@/components/displays/StickyBackground";

export default function Home() {
  return (
        <main>
            <StickyBackground text={"Une aventure Minecraft libre et vanilla"} image={"/images/background-main.webp"} type={"home"}/>
            <div className={"sticky top-[88vh] w-full bg-baseGray"}>
                <TopBand />

                <div className={"flex justify-center mt-10"}>
                    <About title={"À Propos"} text={"Ekaii est la continuité d’un serveur créé pour proposer la survie Minecraft vanilla parfaite : Une communauté agréable, adulte pour une ambiance conviviale. Le tout sur un serveur performant sans lags et sans plugins inutiles. Une recette plutôt bien huilé en 3 ingrédients."}/>
                </div>

                <div className={"flex justify-between m-[70px_30px_0] p-4 pb-10"}>
                    <KeyPoint icon={"/images/key.svg"} name={"Privé"} content={"Ekaii n’est pas un serveur ouvert à tous. Nos membres sont sélectionnés avec le plus grand soin par notre staff afin d’éviter un maximum de problèmes une fois en jeu et sur discord."} link={{href:"/join", text:"Comment rejoindre ?"}}/>
                    <KeyPoint icon={"/images/vanilla.svg"} name={"Vanilla"} content={"Pas de claims ni plugins inutiles. La simplicité d’une survie vanilla avec les copains sur un serveur multijoueur. Rien de tel que les basiques pour une aventure Minecraft inoubliable."} link={{href:"/gallery", text:"Voir la Galerie"}}/>
                    <KeyPoint icon={"/images/server.svg"} name={"Performant"} content={"Un serveur puissant et optimisé, comme vous n’en avez jamais vu. Vos fermes les plus imposantes ne le mettrons pas à genou. Il n’en revient qu’à vous de venir essayer !"} link={{href:"/about", text:"En savoir +"}}/>
                </div>
            </div>
        </main>
  )
}
