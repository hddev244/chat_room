import Chat, { IChat } from "@/server/models/Chat";
import User, { IUser } from "@/server/models/User";
import { connectToDatabase } from "@/server/mongodb";
import { group } from "console";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        await connectToDatabase();

        const body = await req.json();
        const { chat, currentUserId }: { chat: IChat, currentUserId: string } = body;

        // define "query" to find the chat
        if (!chat)
            throw new Error('Chat not found');
        const query = chat.isGroup ? {
            isGroup: chat.isGroup,
            name: chat.name,
            groupImage: chat.groupImage,
            members: [currentUserId, ...(chat.members ?? [])],
        } : {
            members: { $all: [currentUserId, (chat.members ?? [])], $size: 2 },
        };

        let chatFound = await Chat.findOne(query);

        // if chat not found, create a new chat
        if (!chatFound) {
            chatFound = await new Chat(
                chat.isGroup ? query : { members: [currentUserId, ...(chat.members ?? [])] }
            );
        }

        chatFound = await chatFound.save();

        await User.findByIdAndUpdate(currentUserId,
            {
                $addToSet: { chats: chatFound._id }
            },
            { new: true }
        );

        chat.members?.forEach(async (member: string) => {
            await User.findByIdAndUpdate(member,
                {
                    $addToSet: { chats: chatFound._id }
                }, 
                { new: true })
        });

        return NextResponse.json(chatFound, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}