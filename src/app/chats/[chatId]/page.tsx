'use client'
import SpinperBasic from "@/components/spinpers/spinper-basic";
import { IChat } from "@/server/models/Chat";
import axios from "axios";
import type { NextPage } from "next";
import { use, useEffect, useState } from "react";

type Props = {
    chatId: string;
    }

const Page: NextPage<{params : Props}> = (props) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [chat, setChat] = useState<IChat>();
    const { chatId } = props.params;
    
    const getChat = async () => {
        await axios.get(`/api/chats/${chatId}`)
        .then((res) => {
            setChat(res.data);
            console.log(res.data);
        })
        .catch((error) => {
            console.error(error);
        });
        setLoading(false);
    }

    useEffect(() => {
        getChat();
    },[])
  return (
    loading ? <SpinperBasic/> :
    <>
    <h1>Chat</h1>
    <p>{chatId}</p>
    <h2>{chat?.name}</h2>
    <p>{chat?.isGroup ? 'Group' : 'Personal'}</p>
    <p>{chat?.members?.map((member) => member.username).join(', ')}</p>
    </>
  )
}

export default Page