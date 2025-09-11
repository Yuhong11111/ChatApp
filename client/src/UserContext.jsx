import axios from "axios";
import { createContext, useEffect, useMemo } from "react";
import { useState } from "react"

// export const UserContext = createContext({});

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [username, setUsername] = useState(null);
    const [id, setId] = useState(null);

    useEffect(() => {
        axios.get('/profile', { withCredentials: true }).then(({ data }) => {
            // setUsername(response.data.username);
            // setId(response.data.userId);
            setUsername(data.username);
            setId(data.userId);
        })
    }, [])


    return (
        <UserContext.Provider value={{ username, setUsername, id, setId }}>
            {children}
        </UserContext.Provider>
    )
}