import Chat, { IChat } from "@/server/models/Chat.model";
import User, { IUser } from "@/server/models/User.model";
import { connectToDatabase } from "@/server/mongodb";
import { ChatService } from "@/server/services/chat.service";
import { group } from "console";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        await connectToDatabase();

        const { chat, currentUserId }: { chat: IChat, currentUserId: string } = await req.json();

        if(!chat || !currentUserId) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }

        if( !chat.members){
            return NextResponse.json({ error: "members value invalid" }, { status: 400 });
        } 

        // return NextResponse.json({ chat, currentUserId }, { status: 200 });
        return ChatService.getInstance().createChat(currentUserId, chat);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}