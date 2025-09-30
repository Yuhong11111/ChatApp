import Avatar from "./avatar"

export default function Contact({ id, onClick, username, selected, online }) {
    console.log("Contact username:", username);
    return (
        <div key={id} onClick={() => onClick(id)}
            className={"border-b border-gray-100 flex items-center gap-2 cursor-pointer "
                + (selected ? 'bg-blue-50' : '')}>
            {selected && (
                <div className="w-1 bg-blue-500 h-12 rounded-r-md"></div>
            )}
            <div className="flex gap-2 py-2  p-2 items-center">
                <Avatar online={online} username={username} userID={id} ></Avatar>
                <span className="text-grey-800">{username}</span>
            </div>
        </div>
    )
}