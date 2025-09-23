export default function Avatar({ username, userID }) {
    const colors = ['bg-red-200', 'bg-green-200', 'bg-blue-200', 'bg-yellow-200', 'bg-purple-200', 'bg-pink-200', 'bg-indigo-200'];
    const colorIndex = userID ? parseInt(userID, 16) % colors.length : 0;
    const bgColorClass = colors[colorIndex];
    return (
        <div className={"w-8 h-8 rounded-full text-sm flex items-center justify-center" + " " + bgColorClass}>
            {username[0]}
        </div>
    );
}