/**
 * message service class for all api related to message
 */

import { NextResponse } from "next/server";
import Message from "../models/Message.model";
import { pusherServer } from "@/lib/pusher";
import Chat, { IChat } from "../models/Chat.model";

export class MessageService {
    private static instance: MessageService;
    private constructor() { }

    public static getInstance(): MessageService {
        if (!MessageService.instance) {
            MessageService.instance = new MessageService();
        }

        return MessageService.instance;
    }

    public async createMessage
        (
            chatId: string,
            sender: string,
            photo?: string,
            text?: string,
            seenBy?: string
        ): Promise<NextResponse> {

        if (!chatId || !sender || (!photo && !text)) {
            return NextResponse.json({ message: "Chat, sender and text are required!" }, { status: 400 });
        }

        try {
            let message = new Message({
                chat: chatId,
                sender,
                photo,
                text,
                seenBy
            });

            message = await message.save();

            const newMessage = await Message.findById(message._id)
                                            .populate('sender', '_id username email profileImage')
                                            .exec();
 


            const updateChat:IChat = await Chat.findByIdAndUpdate(chatId, {
                $push: { messages: newMessage._id },
                $set: { lastMessageAt: newMessage.createdAt }
            }, { new: true })
                .populate('members', '_id username email profileImage')
                .populate({
                    path: 'messages',
                    populate: {
                        path: 'sender',
                        select: 'name email profileImage'
                    }
                })
                .sort({ lastMessageAt: -1 })
                .exec();
                
            // pusher notification to all chat members
            await pusherServer.trigger(`chat-${chatId}`, 'new-message', newMessage);

            updateChat.members.forEach(async (member) => {
                await pusherServer.trigger(`chatList-${member._id}`, 'message', "");
            });

            return NextResponse.json(updateChat, { status: 200 });
        } catch (error: any) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}
