import {Status} from "@/utils/status";

export default function ServerStatus() {
    let status : Status = Status.ONLINE; // TODO: Get status from API
    let joueurs = 69; // TODO: Get players from API

    let statusHtml = status == Status.ONLINE ?
        <p className={"text-lg leading-5"}>Serveur : <span className={"text-greenStatus font-bold"}>ON</span><br/>
            Joueurs connectés : <span className={"font-bold"}>{joueurs}</span>
        </p>
        :
        <p className={"text-lg leading-5"}>Serveur : <span className={"text-redStatus font-bold"}>OFF</span>
            Joueurs connectés : <span className={"font-bold"}>0</span>
        </p>
return (
    <div className={"absolute shadow-underline p-1 pb-5 m-4 ml-1 inline-block"}>
            {statusHtml}
        </div>
    )
}