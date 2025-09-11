import RegisterAndLoginForm from "./RegisterAndLoginForm";
import { useContext } from "react";
import { UserContext } from "./UserContext";

export default function Routes() {
    const { username, id } = useContext(UserContext);

    if (username) {
        return (
            <div>Logged in as {username} (ID: {id})</div>
        )
    }
    return (
        <RegisterAndLoginForm />
    )
}