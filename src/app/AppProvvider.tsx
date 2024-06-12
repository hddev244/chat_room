'use client'

import { IUser } from "@/server/models/User.model";
import { currentUserStore, tokenStore } from "@/store/user";
import { createContext, useContext, useState } from "react"
import { create } from "zustand";

// const AppContext = createContext({
//     token: '',
//     setToken: (token: string) => {},
//     currentUser: {} as IUser | null,
//     setCurrentUser: (user: IUser| null) => {}
// });



const AppContext = createContext({
    currentUserStore: currentUserStore,
    tokenStore: tokenStore
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
    const updateUser = currentUserStore((state:any) => state.updateUser);
    const setToken = tokenStore((state:any) => state.setToken);

    updateUser(inititalCurrentUser);
    setToken(inititalToken);

    return (
        <AppContext.Provider value={{tokenStore,currentUserStore}}>
            {children }
        </AppContext.Provider>
        )
}

export { useAppContext };
export default AppProvider;