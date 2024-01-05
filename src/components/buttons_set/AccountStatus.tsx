import {getServerSession} from "next-auth";
import LoginButton from "@/components/buttons/LoginButton";
import ConnectedMenu from "@/components/buttons/ConnectedMenu";

export default function AccountStatus() {
    return (getServerSession().then((session) => {
        if (session==null) {
            return <LoginButton />
        } else {
            return <ConnectedMenu name={session.user!.name!} />
        }
    }));
}