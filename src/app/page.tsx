'use client'
import ChatList from "@/components/ChatList";
import ContactList from "@/components/ContactList";
import { BottomBar } from "@/components/bottom-bar";
import { useState } from "react";
import { currentUserStore } from "@/store/user"
import { Button } from "@/components/ui/button";


export default function Home() {
  const [mode, setMode] = useState<"chats" | "contacts">("chats");
  const toggleMode = (mode: "chats" | "contacts") => {
    setMode(mode);
  }

  const currentUser = currentUserStore((state:any) => state.user);
  const updateUser = currentUserStore((state:any) => state.updateUser);
  
  console.log(currentUser);

  // check window size for responsive . width < 1024px => mobile
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024);

  return (
    <> 
      {/* <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Chat App</h1>
        <div className="flex items-center">
          <p className="mr-2">{user.name}</p>
          <p>{user.age}</p>
        </div>
        <Button onClick={() => updateUser("Jane Doe 2", 30)}>Change User</Button>
      </div> */}
      <div className="size-full flex flex-col">
          { isMobile ? (
            <>
            <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
            {mode === "chats" ? <ChatList /> : <ContactList />}
            </div>
            </>
          ):(
            <>
            <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
              <ChatList /> 
              <ContactList />
            </div>
            </>
          )
          }
        <BottomBar toggleMode={toggleMode} />
      </div>
    </>
  );
}
