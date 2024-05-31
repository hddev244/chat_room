import User from "@/server/models/User";
import { connectToDatabase } from "@/server/mongodb";
import { NextRequest, NextResponse } from "next/server";

    export const GET = async ( req: NextRequest, params: { params: { query: string } }): Promise<NextResponse> => {
    try {
        await connectToDatabase();

        const { query } = params.params;
                    console.log(query);

        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ]
        
        });
        return NextResponse.json({
            message: "Success",
            data: users,
        },{status:200});
    } catch (error:any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}