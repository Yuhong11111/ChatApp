import { useEffect } from "react"
import { useState } from "react"
import Avatar from "./avatar";

export default function Chat() {
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3000');
        setWs(ws);
        ws.addEventListener('message', handleMessage);
        // return () => {
        //     ws.close();
        // }
    }, [])

    function handleMessage(ev) {
        const message = JSON.parse(ev.data);
        if ('online' in message) {
            showOnlinePeople(message.online);
        } else if ('text' in message) {
            showMessage(message);
        }
    }

    function showOnlinePeople(peopleArray) {
        const people = {};
        peopleArray.forEach(({ userId, username }) => {
            people[userId] = username;
        })
        setOnlinePeople(people);
    }

    function showMessage(message) {
        console.log(message);
    }
    return (
        <div className="flex h-screen">
            <div className="bg-white w-1/3 p-2 pl-4 pt-4">
                <div className="text-blue-600 font-bold flex gap-2 mb-4">
                    <svg xmls="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 inline-block mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.777 0-1.555-.22-2.121-.659-1.172-.879-1.172-2.303 0-3.182s3.07-.879 4.242 0l.879.659M12 6c-.777 0-1.555-.22-2.121-.659-1.172-.879-1.172-2.303 0-3.182s3.07-.879 4.242 0c1.172.879 1.172 2.303 0 3.182C13.536 5.78 12.768 6 12 6z" />
                    </svg>
                    MERN CHAT</div>
                {Object.keys(onlinePeople).map(userId => (
                    <div key={userId} className="border-b border-gray-100 py-2 flex items-center gap-2">
                        <Avatar username={onlinePeople[userId]} userID={userId} ></Avatar>
                        <span className="text-grey-800">{onlinePeople[userId]}</span>
                    </div>
                ))}
            </div>
            <div className="flex flex-col bg-blue-50 w-2/3 p-2">
                <div className="flex-grow">message with selected person</div>
                <div className="flex gap-2 mx-2">
                    <input type="text"
                        placeholder="type you rmessage here"
                        className="w-bg-white flex-grow border round p-2" />
                    <button className="bg-blue-500 p-2 text-white rounded-md ml-2">
                        <svg xmls="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}