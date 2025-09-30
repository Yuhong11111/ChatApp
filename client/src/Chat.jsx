import { use, useEffect } from "react"
import { useState, useContext, useRef } from "react"
import Avatar from "./avatar";
import Logo from "./Logo";
import { UserContext } from "./UserContext";
import { uniqBy } from "lodash";
import axios from "axios";
import Contact from "./Contact";
// import { set } from "mongoose";

export default function Chat() {
    const [ws, setWs] = useState(null);
    const [onlinePeople, setOnlinePeople] = useState({});
    const [offlinePeople, setOfflinePeople] = useState({});
    const [selectedUserId, setSelectedUserId] = useState(null);
    const { username, id } = useContext(UserContext);
    const [newMessageText, setNewMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const onlinePeopleExculedMyself = { ...onlinePeople };
    delete onlinePeopleExculedMyself[id];
    const messagesWithoutDupes = uniqBy(messages, '_id');
    const divUnderMessages = useRef(null);

    useEffect(() => {
        connectToWS();
    }, [])

    function connectToWS() {
        const ws = new WebSocket('ws://localhost:3000');
        setWs(ws);
        ws.addEventListener('message', handleMessage);
        ws.addEventListener('close', () =>
            setTimeout(() => {
                console.log('Disconnected. Trying to reconnect.');
                connectToWS();
            }, 1000)
        );
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
        setMessages(prev => [...prev, {
            text: newMessageText,
            sender: id,
            recipient: selectedUserId,
            _id: Date.now(),
        }]);
    }

    useEffect(() => {
        if (divUnderMessages.current) {
            divUnderMessages.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [messagesWithoutDupes]);

    useEffect(() => {
        if (selectedUserId) {
            axios.get('/messages/' + selectedUserId).then(res => {
                setMessages(res.data);
            });
        }
    }, [selectedUserId]);

    useEffect(() => {
        axios.get('/people').then(res => {
            const offlinePeopleArr = res.data
                .filter(p => p._id !== id)
                .filter(p => !Object.keys(onlinePeople).includes(p._id))

            const offlinePeople = {};
            offlinePeopleArr.forEach(p => {
                offlinePeople[p._id] = p;
            })
            setOfflinePeople(offlinePeople);
        })
    }, [onlinePeople]);
    console.log("chat username:", username);

    return (
        <div className="flex h-screen">
            <div className="bg-white w-1/3">
                <Logo />
                {Object.keys(onlinePeopleExculedMyself).map(userId => (
                    <Contact
                        key={userId}
                        id={userId}
                        username={onlinePeopleExculedMyself[userId]}
                        onClick={() => setSelectedUserId(userId)}
                        selected={userId === selectedUserId}
                        online={true} />
                ))}
                {Object.keys(offlinePeople).map(userId => (
                    <Contact
                        key={userId}
                        id={userId}
                        username={offlinePeople[userId].username}
                        onClick={() => setSelectedUserId(userId)}
                        selected={userId === selectedUserId}
                        online={false} />
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
                        <div className="relative h-full">
                            <div className="overflow-y-scroll absolute top-0 left-0 right-0 bottom-2">
                                {messagesWithoutDupes.map(message => (
                                    <div key={message._id} className={(message.sender === id ? 'text-right' : 'text-left')}>
                                        <div className={"text-left inline-block p-2 m-2 rounded-md text-sm " + (message.sender === id ? 'bg-blue-500 text-white' : 'bg-white text-gray-500')} key={message.id}>
                                            {message.text}
                                        </div>
                                    </div>
                                ))}
                                <div ref={divUnderMessages}></div>
                            </div>
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