import {VoteButton, Button, ButtonSeparator} from "@/components/buttons/Button";

export default function ButtonArray() {
    return (
        <div className={"relative bg-baseGray inline-flex flex-row shadow-md border-lighterGray border-2 justify-center"}>
            <Button text={"Accueil"} href={"/"} isLeftEdge={true} />
            <ButtonSeparator />
            <VoteButton text={"Voter"} href={"/vote"} />
            <ButtonSeparator />
            <Button text={"Dynmap"} href={"/dynmap"} />
            <ButtonSeparator />
            <Button text={"À propos"} href={"/about"} />
            <ButtonSeparator />
            <Button text={"Nous rejoindre"} href={"/join"} />
            <ButtonSeparator />
            <Button text={"Galerie"} href={"/gallery"} isRightEdge={true} />
        </div>
    )
}