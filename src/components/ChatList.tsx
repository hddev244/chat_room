'use client'
import type { NextPage } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useAppContext } from "@/app/AppProvvider";
import axios from "axios";
import { useEffect, useState } from "react";
import SpinperBasic from "./spinpers/spinper-basic";
import { IChat } from "@/server/models/Chat.model";
import { Input } from "./ui/input";
import { ChatBox } from "./ChatBox";
import { pusherClient } from "@/lib/pusher";
import { toast } from "sonner";
import { ScrollArea } from "./ui/scroll-area";

type Props = {
  curentUserId?: string | null;
}

const ChatList = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [chats, setChats] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const { currentUser } = useAppContext();

  

  useEffect(() => {
    const getChats = async () => {
      if (!currentUser?._id) {
        toast('User not found')
        return;
      };
      try {
        const url = `/api/users/${currentUser?._id}/chats`;
        axios.get(url)
          .then((res) => {
            const chats: IChat[] = res.data;
            setChats(chats);
            setLoading(false);
          });
      } catch (error) {
        console.error(error);
      }
    }
    pusherClient.subscribe(`chatList-${currentUser?._id}`);
    pusherClient.bind(`message`, () => {
      getChats();
    });
    return () => {
      pusherClient.unsubscribe(`chatList-${currentUser?._id}`);
      pusherClient.unbind(`message`);
    }
  },[currentUser?._id])

  useEffect(() => {
    const getChats = async () => {
      if (!currentUser?._id) {
        toast('User not found')
        return;
      };
      try {
        const url = `/api/users/${currentUser?._id}/chats`;
        axios.get(url)
          .then((res) => {
            const chats: IChat[] = res.data;
            setChats(chats);
            setLoading(false);
          });
      } catch (error) {
        console.error(error);
      }
    }
    if (currentUser?._id) getChats();
  }, [currentUser?._id]);

  return (loading ? <SpinperBasic /> :
    <div className="size-full flex flex-col space-y-4">
      <div className="w-full">
        <Input
          type="text"
          className="h-14 rounded-3xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="search contacts..." />
      </div>
      <div className="w-full flex-1 gap-8">
        <Card className="flex flex-col size-full">
          <CardHeader>
            <CardTitle>Chats</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 w-full ">
            <ScrollArea className="h-full w-full scrollbar_hidden ">
              {
              chats.map((chat) => (
                <ChatBox key={chat._id} chat={chat} />
              ))
            }
            </ScrollArea>
          </CardContent>          
        </Card>
      </div>
    </div>
  )
}

export default ChatList