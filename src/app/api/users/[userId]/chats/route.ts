import Chat from "@/server/models/Chat.model";
import { connectToDatabase } from "@/server/mongodb";
import { ChatService } from "@/server/services/chat.service";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, params: { params: { userId: string } }): Promise<NextResponse> => {
    const { userId } = params.params;
   return ChatService.getInstance().getChatByUserId(userId);
}
