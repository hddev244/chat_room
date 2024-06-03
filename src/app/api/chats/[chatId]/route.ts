import Chat from "@/server/models/Chat.model";
import { connectToDatabase } from "@/server/mongodb";
import { ChatService } from "@/server/services/chat.service";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: { chatId: string } }

export const GET = async (req: NextRequest, params: Params): Promise<NextResponse> => {
    const { chatId } = params.params;
   
    return ChatService.getInstance().getChatById(chatId);
}