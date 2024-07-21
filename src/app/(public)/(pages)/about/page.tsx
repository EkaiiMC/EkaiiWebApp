import JoinDisplay from "@/components/join-display";

export default function About() {
  return (
    <div className={'h-full'}>
      <h1 className={"font-monocraft text-4xl text-left shadow-underline w-1/2 p-3 pb-5 ml-auto mr-auto relative -top-10"}>À propos</h1>
      <div className={'ml-20 mr-20'}>
        <h2 className={"font-monocraft text-2xl text-left w-1/2 pb-5 relative ml-auto mr-auto"}>Notre processus de recrutement :</h2>
        <p className={'text-lg mb-7 w-1/2 ml-auto mr-auto pb-5'}>
          Ekaii est un serveur basé sur la confiance envers les membres de la communauté. Pour assurer cette confiance, nous choisissons
          nos membres avec le plus grand soin. C&apos;est pourquoi nous avons mis en place notre processus de recrutement.
          Tout le monde est bienvenu à déposer une candidature, la seule condition est d&apos;avoir au moins 18 ans.
        </p>
        <div className={"relative w-full ml-auto mr-auto text-justify flex justify-evenly "}>
          <JoinDisplay text={"Tout commence par une candidature écrite sur notre Discord. Vous ne savez pas quoi écrire ? Pas de panique, d'autres y sont passés avant vous ! Mais appliquez vous, votre candidature sera le prologue de votre aventure sur Ekaii."} title={"Candidature écrite"} index={1} image={'/images/player.svg'}/>
          <JoinDisplay text={"Si votre candidature est acceptée, il vous sera proposé un entretien en vocal avec l'un de nos whitelisteurs, qui en profitera pour vous faire une présentation du serveur."} title={"Entretien vocal"} index={2} image={'/images/discord.svg'}/>
          <JoinDisplay text={"Tout s'est bien déroulé ? Parfait ! Vous êtes accepté sur le serveur, et vous pouvez rejoindre les nombreux joueurs de la communauté d'Ekaii ! Il ne vous restera plus qu'à démarrer votre jeu et vous connecter au serveur afin de débuter votre aventure !"} title={"Bienvenue !"} index={3} image={'/images/logo-no-text.svg'}/>
        </div>
        <div className={'shadow-underline w-1/2 h-1 mt-10 ml-auto mr-auto'} />
      </div>
    </div>
  )
}