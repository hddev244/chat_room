import { NextResponse } from "next/server";
import { connectToDatabase } from "../mongodb";
import Chat, { IChat } from "../models/Chat.model";
import { UserService } from "./user.service";
import User from "../models/User.model";

export class ChatService {
    private static instance: ChatService;
    private constructor() { }

    public static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }

        return ChatService.instance;
    }

    public async createChat(currentUserId: string, chat: IChat): Promise<NextResponse> {
        try {
            await connectToDatabase();

            const query = chat.isGroup ? {
                isGroup: chat.isGroup,
                name: chat.name,
                groupImage: chat.groupImage,
                members: [currentUserId, ...(chat.members ?? [])],
            } : {
                members: { $all: [currentUserId, (chat.members ?? [])], $size: 2 },
            };

            let chatFound = await Chat.findOne(query);

            if (!chatFound) {
                chatFound = await new Chat(
                    chat.isGroup ? query : { members: [currentUserId, ...(chat.members ?? [])] }
                );

                chatFound = await chatFound.save();

                await User.findByIdAndUpdate(currentUserId,
                    {
                        $addToSet: { chats: chatFound._id }
                    },
                    { new: true }
                );

                chat.members.forEach(async (member: string) => {
                    await User.findByIdAndUpdate(member,
                        {
                            $addToSet: { chats: chatFound._id }
                        },
                        { new: true })
                });
            }

            return NextResponse.json(chatFound, { status: 200 });
        } catch (error) {
            return NextResponse.json({
                message: "Lỗi không thể tạo chat!",
            }, { status: 500 });
        }
    }

    public async getChatByUserId(userId: string): Promise<NextResponse> {
        if (userId === 'searchContact') {
            return UserService.getInstance().searchContact(userId);
        }
        try {
            await connectToDatabase();

            const allChats = await Chat.find({ members: userId })
                .populate('members','_id username email profileImage')
                .populate({
                    path: 'messages',
                    populate: {
                        path: 'sender',
                        select: 'name email profileImage'
                    }
                })
                .sort({ lastMessageAt: -1 })
                .exec();

            return NextResponse.json(allChats, { status: 200 });
        } catch (error) {
            return NextResponse.json({
                message: "Lỗi server, không thể lấy dữ liệu chat!",
            }, { status: 500 });
        }
    }
}