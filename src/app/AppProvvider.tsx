'use client'

import { IUser } from "@/server/models/User.model";
import { createContext, useContext, useState } from "react"

const AppContext = createContext({
    token: '',
    setToken: (token: string) => {},
    currentUser: {} as IUser | null,
    setCurrentUser: (user: IUser| null) => {}
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
    inititalCurrentUser = {} as IUser | null 
}: {
    children: React.ReactNode;
    inititalToken?: string;
    inititalCurrentUser?: IUser | null;
}) => {
    const [token, setToken] = useState(inititalToken);
    const [currentUser, setCurrentUser] = useState<IUser | null>(inititalCurrentUser); // Updated type and added default value
    return (
        <AppContext.Provider value={{token,setToken,currentUser,setCurrentUser}}>
            {children }
        </AppContext.Provider>
        )
}

export { useAppContext };
export default AppProvider;