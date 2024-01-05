'use client';

import {Button} from "@/components/buttons/Button";
import {signIn} from "next-auth/react";


export default function LoginButton() {
    return (
        <div className={"relative bg-baseGray inline-flex flex-row border-lighterGray border-2 justify-center cursor-pointer"}>
            <Button onClick={() => {signIn('azure-ad')}} text={"Se connecter"} />
        </div>
    )
}