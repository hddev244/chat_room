import Chat from "@/server/models/Chat";
import { connectToDatabase } from "@/server/mongodb";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, params: { params: { userId: string } }): Promise<NextResponse> => {
    const { userId } = params.params;
    try{
        await connectToDatabase();

        const allChats = await Chat.find({ members: userId })
        .populate({ path: 'members', model: 'User' })
        .sort({ lastMessageAt: -1 })
        .exec();

        return NextResponse.json(allChats, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
