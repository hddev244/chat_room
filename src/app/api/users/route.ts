import User from "@/server/models/User";
import { connectToDatabase } from "@/server/mongodb";
import { NextResponse } from "next/server";

export const GET = async ():Promise<NextResponse> => {

    try {
        await connectToDatabase();

        const allUser = await User.find();

        return NextResponse.json(allUser,{status:200});
    }
    catch (error) {
        return NextResponse.json({
            message: "Error",
        },{status:500});
    }
   
    return NextResponse.json({
        message: "Hello World",
    });
}