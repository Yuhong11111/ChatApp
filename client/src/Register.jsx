import { useState } from "react"

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    return (
        <div className="bg-blue-50 h-screen flex items-center">
            <form className="w-64 mx-auto mb-12">
                <label>Username</label>
                <input value={username}
                    onChange={ev => setUsername(ev.target.value)}
                    type="text" placeholder="Enter your username..." className="block w-full rounded-sm p-2 mb-2 border" />
                <label>Password</label>
                <input value={password}
                    onChange={ev => setPassword(ev.target.value)}
                    type="password" placeholder="Enter your password..." className="block w-full rounded-sm p-2 mb-2 border" />
                <button className="bg-blue-500 text-white block w-full rounded-sm p-2 mb-2 border">Register</button>
            </form>
        </div>
    )
}