import Layout from "@/components/start";
import HomeDisplay from "@/components/home-display";

export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <Layout type={'home'}>
      <div className={"relative -top-8 w-4/5 sm:w-1/2 xl:w-1/3 p-3 pb-5 shadow-underline ml-auto mr-auto text-justify"}>
        <h1 className={"font-monocraft text-2xl text-left"}>Qui sommes nous ?</h1>
        <p className={"leading-5 mt-3 text-lg"}>
          Ekaii est la continuité d’un serveur créé pour proposer la survie Minecraft vanilla parfaite : Une communauté
          agréable, adulte pour une ambiance conviviale. Le tout sur un serveur performant sans lags et sans plugins
          inutiles. Une recette plutôt bien huilée en 3 ingrédients.
        </p>
      </div>
      <div className={'flex justify-between flex-col lg:flex-row m-[40px_10vw]'}>
        <HomeDisplay icon={'/images/key.svg'} name={'Privé'} content={'Ekaii n’est pas un serveur ouvert à tous. Nos membres sont sélectionnés avec le plus grand soin par notre staff afin d’éviter un maximum de problèmes une fois en jeu et sur discord.'} link={{href:"/join", text:"Comment rejoindre ?"}} />
        <HomeDisplay icon={'/images/vanilla.svg'} name={'Vanilla'} content={'Pas de claims ni plugins inutiles. La simplicité d’une survie vanilla avec les copains sur un serveur multijoueur. Rien de tel que les basiques pour une aventure Minecraft inoubliable.'} link={{href:"/gallery", text:"Voir la Galerie"}} />
        <HomeDisplay icon={'/images/server.svg'} name={'Performant'} content={'Un serveur puissant et optimisé, comme vous n’en avez jamais vu. Vos fermes les plus imposantes ne le mettront pas à genou. Il n’en revient qu’à vous de venir essayer !'} link={{href:"/about", text:"En savoir +"}} />
      </div>
    </Layout>
  )
}