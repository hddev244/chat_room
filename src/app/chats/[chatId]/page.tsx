'use client'
import { useAppContext } from "@/app/AppProvvider";
import { ChatArea } from "@/components/ChatArea";
import ChatList from "@/components/ChatList";
import SpinperBasic from "@/components/spinpers/spinper-basic";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { IChat } from "@/server/models/Chat.model";
import axios from "axios";
import type { NextPage } from "next";
import { useParams } from "next/navigation";
import { use, useEffect, useState } from "react";

type Props = {
  chatId: string;
}

const Page: NextPage<{ params: Props }> = (props) => {
  const { currentUser } = useAppContext();
  const [chat, setChat] = useState<IChat>();
  const { chatId } = useParams();

  return (
      <>
        <div className=" size-full grid grid-cols-3 gap-8 p-4">
          <div className="col-span-1">
            <ChatList />
          </div>
          <ChatArea chatId={chatId} />
        </div>
      </>
  )
}

export default Page