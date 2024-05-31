import { IChat } from "@/server/models/Chat";
import { connectToDatabase } from "@/server/mongodb";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
    try {
        await connectToDatabase();

        const { body } = await req.json();
        const {chatPayload, currentUser} = body;

        const chat:IChat = chatPayload;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}