import { NextResponse } from "next/server";
import { connectToDatabase } from "../mongodb";
import Chat, { IChat } from "../models/Chat.model";
import { UserService } from "./user.service";
import User, { IUser } from "../models/User.model";

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

            console.log('chatFound', chatFound);

            if (!chatFound) {
                console.log('chat not found');
                chatFound = await new Chat(
                    chat.isGroup ? query : { members: [currentUserId, ...(chat.members ?? [])] }
                );

                chatFound = await chatFound.save();

                chatFound = await Chat.findById(chatFound._id)
                                        .populate('members','_id username email profileImage')

                await User.findByIdAndUpdate(currentUserId,
                    {
                        $addToSet: { chats: chatFound._id }
                    },
                    { new: true }
                );

                chat.members.forEach(async (member: IUser) => {
                    await User.findByIdAndUpdate(member._id,
                        {
                            $addToSet: { chats: chatFound._id }
                        },
                        { new: true })
                });
            }
            console.log('chatFound--------', chatFound);
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

    public async getChatById(chatId: string): Promise<NextResponse> {
        try {
            await connectToDatabase();

            const chatFound = await Chat.findById(chatId)
                .populate({ path: 'members', select: '_id username email profileImage' })
                .populate(
                    {
                        path: 'messages',
                        populate: {
                            path: 'sender',
                            select: '_id username email profileImage'
                        }
                    }
                )
                .exec();

            return NextResponse.json(chatFound, { status: 200 });
        } catch (error:any) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }
}