'use client'
import SpinperBasic from "@/components/spinpers/spinper-basic";
import type { NextPage } from "next";
import { useState } from "react";

type Props = {
    chatId: string;
    }

const Page: NextPage<{params : Props}> = (props) => {
    const [loading, setLoading] = useState<boolean>(true);
    const { chatId } = props.params;
  return (
    loading ? <SpinperBasic/> :
    <>
        <h1>Chat ID: {chatId}</h1>
    </>
  )
}

export default Page