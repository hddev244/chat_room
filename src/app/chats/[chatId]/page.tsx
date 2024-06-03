'use client'
import { ChatArea } from "@/components/ChatArea";
import ChatList from "@/components/ChatList";
import type { NextPage } from "next";
import { useParams } from "next/navigation";

type Props = {
  chatId: string;
}

const Page: NextPage<{ params: Props }> = (props) => {
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