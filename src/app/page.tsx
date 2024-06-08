'use client'
import ChatList from "@/components/ChatList";
import ContactList from "@/components/ContactList";
import { BottomBar } from "@/components/bottom-bar";
import { useState } from "react";

export default function Home() {
  const [mode, setMode] = useState<"chats" | "contacts">("chats");
  const toggleMode = (mode: "chats" | "contacts") => {
    setMode(mode);
  }

  // check window size for responsive . width < 1024px => mobile
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024);

  return (
    <>
      <div className="size-full flex flex-col">
          { isMobile ? (
            <>
            <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
            {mode === "chats" ? <ChatList /> : <ContactList isMobile={isMobile} />}
            </div>
            </>
          ):(
            <>
            <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-3 gap-8 p-4">
              <ChatList /> 
              <ContactList isMobile={isMobile}  />
            </div>
            </>
          )
          }
        <BottomBar toggleMode={toggleMode} />
      </div>
    </>
  );
}
