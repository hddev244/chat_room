'use client'

import { createContext, useContext, useState } from "react"

export type User = {
    id?: string;
    username?: string;
    email?: string;
    avatar?: string;
}

const AppContext = createContext({
    token: '',
    setToken: (token: string) => {},
    userLogedIn: {} as User | null,
    setUserLogedIn: (user: User| null) => {}
});

const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}

const AppProvider = ({ 
    children,
    inititalToken = '',
    inititalUserLogined = {} as User | null 
}: {
    children: React.ReactNode;
    inititalToken?: string;
    inititalUserLogined?: User | null;
}) => {
    const [token, setToken] = useState(inititalToken);
    const [userLogedIn, setUserLogedIn] = useState<User | null>(inititalUserLogined); // Updated type and added default value
    return (
        <AppContext.Provider value={{token,setToken,userLogedIn,setUserLogedIn}}>
            {children }
        </AppContext.Provider>
        )
}

export { useAppContext };
export default AppProvider;