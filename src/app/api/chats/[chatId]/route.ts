import Chat from "@/server/models/Chat.model";
import { connectToDatabase } from "@/server/mongodb";
import { NextRequest, NextResponse } from "next/server";

type Params = { params: { chatId: string } }

export const GET = async (req: NextRequest, params: Params): Promise<NextResponse> => {
    const { chatId } = params.params;
    try {
        connectToDatabase();

        const chatFound = await Chat.findById(chatId)
            .populate({ path: 'members' })
            .populate(
                {
                    path: 'messages',
                    // populate: {
                    //     path: 'sender',
                    //     model: 'User'
                    // }
                }
            )
            .exec();
        return NextResponse.json(chatFound, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}