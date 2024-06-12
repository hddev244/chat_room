import { IUser } from '@/server/models/User.model';
import {create} from 'zustand';

const currentUserStore = create((set) => ({
    currentUser: {},
    updateUser: (currentUser : IUser | {} ) => set(() => ({currentUser: currentUser})),
    updateProfileImage: (profileImage: string) => set((state : IUser) => ({
        currentUser: {...state, profileImage}
    })),

}));

const tokenStore = create((set) => ({
    token: '',
    setToken: (token: string) => set(() => ({token:token})),
}));

export {currentUserStore, tokenStore};