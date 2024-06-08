'use client'
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { IoIosLogOut } from "react-icons/io";
import axios from "axios";
import { useAppContext } from "@/app/AppProvvider";
import { toast } from "sonner";
import { Card } from "./ui/card";
import { ModeToggle } from "@/components/ModeToggle";

const TopBar = () => {
    const { currentUser ,setCurrentUser } = useAppContext();
    const pathName = usePathname();
    const router = useRouter();
    const handleLogout = () => {
        axios.post("/api/auth/logout")
            .then(res => {
                console.log(res.data.message);
                setCurrentUser(null);
                router.push("/login");
            }
        )
        .catch(err => {
            toast("Logout failed", 
                {
                    description: err.response.data.message,
                }
            )
        })
    }
    return (
        <div className="flex w-full h-24 p-4 border-b bg-card text-card-foreground shadow-sm">
            <div className="flex-1 flex items-center">
                <Link href="/">
                    <h1 className=" text-2xl lg:text-5xl font-semibold cursor-pointer">HD Chat</h1>
                </Link>
            </div>
            <div className="flex items-center space-x-8 lg:text-3xl font-semibold">
                {/* <Link
                    href="/chats"
                    className={`hidden ${pathName === '/chats' ? 'text-red-500' : ''}`}>
                    Chats
                </Link>
                <Link href="/contacts"
                    className={`${pathName === '/contacts' ? 'text-red-500' : ''}`}>
                    Contacts
                </Link> */}
                <button 
                    className="text-red-500"
                    onClick={handleLogout}
                    >
                <IoIosLogOut />
                </button>
                <Link href="/profile">
                    <Avatar className="size-16">
                        <AvatarImage src={currentUser?.profileImage || '/images/commons/persion.webp'} alt="@hd-chat" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </Link>
                <ModeToggle />
            </div>
        </div>
    );
}

export default TopBar;