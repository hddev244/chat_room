import { NextRequest, NextResponse } from "next/server";
import { AuthService } from "@/server/services/auth.service";

export async function POST(req: NextRequest): Promise<NextResponse> {
    const { username, password } = await req.json();
    
    return AuthService.getInstance().login(username, password);
}