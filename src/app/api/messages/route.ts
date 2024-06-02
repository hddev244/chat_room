import { pusherServer } from "@/lib/pusher";
import Chat from "@/server/models/Chat.model";
import Message from "@/server/models/Message.model";
import { MessageService } from "@/server/services/message.service";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse>  => {
    const { chatId, sender, photo, text, seedBy } = await req.json();

    return MessageService.getInstance().createMessage(chatId, sender, photo, text, seedBy);
}

export const GET = async (req: NextRequest): Promise<NextResponse> => {
    try{
        const messages = await Message.find();
        return NextResponse.json(messages, { status: 200 });
    }
    catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}