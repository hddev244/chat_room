import {create} from 'zustand';

const userStore = create((set) => ({
    user: {
        name: 'John Doe',
        age: 25,
    },
    updateUser: (name: string, age: number) => set(() => ({user: {name, age}})),
}));

export {userStore};