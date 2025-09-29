import { useEffect } from "react"
import { useState, useContext } from "react"
import Avatar from "./avatar";
import Logo from "./Logo";
import { UserContext } from "./UserContext";
import { uniqBy } from "lodash";
// import { set } from "mongoose";

export default function Chat() {
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const { username, id } = useContext(UserContext);
    const [newMessageText, setNewMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const onlinePeopleExculedMyself = { ...onlinePeople };
    delete onlinePeopleExculedMyself[id];
    const messagesWithoutDupes = uniqBy(messages, 'id');

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3000');
        setWs(ws);
        ws.addEventListener('message', handleMessage);
        // return () => {
        //     ws.close();
        // }
    }, [])

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

    function handleMessage(ev) {
        const messageData = JSON.parse(ev.data);
        console.log({ ev, messageData });
        if ('online' in messageData) {
            showOnlinePeople(messageData.online);
        } else if ('text' in messageData) {
            setMessages(prev => ([...prev, { ...messageData }]));
        }
    }

    function sendMessage(ev) {
        ev.preventDefault();
        ws.send(JSON.stringify({
            recipient: selectedUserId,
            text: newMessageText,
        }))
        setNewMessageText('');
        setMessages(prev => [...prev, { text: newMessageText, sender: id, recipient: selectedUserId }]);
    }

    return (
        <div className="flex h-screen">
            <div className="bg-white w-1/3">
                <Logo />
                {Object.keys(onlinePeopleExculedMyself).map(userId => (
                    <div key={userId} onClick={() => setSelectedUserId(userId)} className={"border-b border-gray-100 flex items-center gap-2 cursor-pointer "
                        + (userId === selectedUserId ? 'bg-blue-50' : '')}>
                        {userId === selectedUserId && (
                            <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>
                        )}
                        <div className="flex gap-2 py-2  p-2 items-center">
                            <Avatar username={onlinePeople[userId]} userID={userId} ></Avatar>
                            <span className="text-grey-800">{onlinePeople[userId]}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex flex-col bg-blue-50 w-2/3 p-2">
                <div className="flex-grow">
                    {!selectedUserId && (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-gray-300">&larr; Select a person to chat with</div>
                        </div>
                    )}
                    {!!selectedUserId && (
                        <div>
                            {messagesWithoutDupes.map(message => (
                                <div className={"p-2 " + (message.sender === id ? 'bg-blue-500 text-white text-right' : 'bg-white text-gray-500 text-left')} key={message.id}>
                                    {message.sender === id ? 'ME:' : ''}{message.text}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {!!selectedUserId && (
                    <form className="flex gap-2 mx-2" onSubmit={sendMessage}>
                        <input type="text"
                            value={newMessageText}
                            onChange={ev => setNewMessageText(ev.target.value)}
                            placeholder="type your message here"
                            className="w-bg-white flex-grow border round p-2" />
                        <button type="submit" className="bg-blue-500 p-2 text-white rounded-md ml-2">
                            <svg xmls="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                            </svg>
                        </button>
                    </form>
                )}
            </div>
        </div >
    )
}