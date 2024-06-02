import { UserService } from "@/server/services/user.service";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, params: { params: { query: string } }): Promise<NextResponse> => {
    const { query } = params.params;

    return UserService.getInstance().searchContact(query);
}