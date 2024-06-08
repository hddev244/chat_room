import { IoIosLogOut } from "react-icons/io";
import { Card } from "./ui/card";


export function BottomBar(
    { 
        toggleMode    
    } : {
         toggleMode: (mode : "chats" | "contacts") => void
    }
) {
    return (
        <>
            <div className="w-full h-20 p-2 lg:hidden">
                <Card className="size-full">
                    <div className="size-full flex space-x-2 items-center justify-center">
                        <button onClick={()=>{toggleMode("chats")}}>
                            Chats
                        </button>
                        <button onClick={()=>{toggleMode("contacts")}}>
                            Contacts
                        </button>
                    </div>
                </Card>
            </div>
        </>
    )
}