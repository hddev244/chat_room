import { pusherServer } from "@/lib/pusher";
import Chat from "@/server/models/Chat.model";
import Message from "@/server/models/Message.model";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse>  => {
   try{
    const body = await req.json();
    const { chat, sender, photo, text, seedBy } = body;
    let newMessage = new Message({
        chat,
        sender,
        photo,
        text,
        seedBy
    });
    newMessage = await newMessage.save();

    const updateChat = await Chat.findByIdAndUpdate(chat, {
        $push: { messages: newMessage._id },
        $set: { lastMessageAt: newMessage.createdAt }
    }, { new: true })
    .populate({ path: 'members', model: 'User' })
    .populate({
        path: 'messages',
        // model: 'Message',
        // populate: {
        //     path: 'sender',
        //     model: 'User'
        // }
    })
    .exec();
    
    console.log(chat+"-----------------");
    // Trigger new message event
    await pusherServer.trigger(`chat-${chat}`, 'new-message', newMessage);

    return NextResponse.json(updateChat, { status: 200 });
   } catch (error: any) {
         return NextResponse.json({ message: error.message }, { status: 500 });
    }
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