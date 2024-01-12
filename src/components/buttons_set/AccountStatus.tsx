import {getServerSession, Session} from "next-auth";
import LoginButton from "@/components/buttons/LoginButton";
import ConnectedMenu from "@/components/buttons/ConnectedMenu";
import {getToken} from "next-auth/jwt";

export default function AccountStatus() {
    return (getServerSession().then((session) => {
        if (session==null) {
            return <LoginButton />
        } else {
            return <ConnectedMenu name={session.user!.name!} />
        }
    }));
}