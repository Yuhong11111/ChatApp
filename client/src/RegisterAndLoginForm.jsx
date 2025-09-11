import axios from "axios";
import { useContext, useState } from "react"
import { UserContext } from "./UserContext";

export default function RegisterAndLoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedInOrRegistered, setIsLoggedInOrRegistered] = useState('register');
    const { setUsername: setLoggedInUserName, setId } = useContext(UserContext)

    async function handleSubmit(ev) {
        ev.preventDefault();
        const url = isLoggedInOrRegistered === 'register' ? '/register' : '/login';
        const { data } = await axios.post(url, {
            username,
            password
        })
        setLoggedInUserName(username);
        setId(data.id);
    }
    return (
        <div className="bg-blue-50 h-screen flex items-center" onSubmit={handleSubmit}>
            <form className="w-64 mx-auto mb-12">
                <label>Username</label>
                <input value={username}
                    onChange={ev => setUsername(ev.target.value)}
                    type="text" placeholder="Enter your username..." className="block w-full rounded-sm p-2 mb-2 border" />
                <label>Password</label>
                <input value={password}
                    onChange={ev => setPassword(ev.target.value)}
                    type="password" placeholder="Enter your password..." className="block w-full rounded-sm p-2 mb-2 border" />
                <button className="bg-blue-500 text-white block w-full rounded-sm p-2 mb-2 border">
                    {isLoggedInOrRegistered === 'register' ? 'Register' : 'Login'}
                </button>
                <div className="text-center text-sm text-gray-500">
                    {/* <a href="/login" className="underline text-blue-500" onClick={() => setIsLoggedInOrRegistered('login')}>
                        Login
                    </a> */}
                    {isLoggedInOrRegistered === 'register' && (
                        <div>Already a member?
                            <button className="underline text-blue-500" onClick={() => setIsLoggedInOrRegistered('login')}>
                                Login
                            </button>
                        </div>
                    )}
                    {isLoggedInOrRegistered === 'login' && (
                        <div>Not a member?
                            <button className="underline text-blue-500" onClick={() => setIsLoggedInOrRegistered('register')}>
                                Register Here
                            </button>
                        </div>
                    )}
                </div>
            </form>
        </div>
    )
}