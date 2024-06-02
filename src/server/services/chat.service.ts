import { NextResponse } from "next/server";
import { connectToDatabase } from "../mongodb";
import Chat from "../models/Chat.model";
import { UserService } from "./user.service";

export class ChatService {
    private static instance: ChatService;
    private constructor() { }

    public static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }

        return ChatService.instance;
    }

    public async getChatByUserId(userId: string): Promise<NextResponse> {
        if(userId === 'searchContact') {
            return UserService.getInstance().searchContact(userId);
        }
        try {
            await connectToDatabase();

            const allChats = await Chat.find({ members: userId })
                                        .populate({ path: 'members' })
                                        .populate({ path: 'messages' })
                                        .sort({ lastMessageAt: -1 })
                                        .exec();

            return NextResponse.json(allChats, { status: 200 });
        } catch (error) {
            return NextResponse.json({
                message: "Lỗi không thể lấy dữ liệu chat!",
            },{status:500});
        }
    }
}