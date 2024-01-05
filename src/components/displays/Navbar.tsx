import ButtonArray from "@/components/buttons_set/ButtonArray";
import AccountStatus from "@/components/buttons_set/AccountStatus";

export default function Navbar() {
    return (
        <nav className={"flex justify-between mt-3 ml-5 mr-5"}>
            <ButtonArray />
            <AccountStatus />
        </nav>
    )
}