import User from "@/server/models/User.model";
import { AuthService } from "@/server/services/auth.service";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
    const { username, email, password } = await req.json();

    return AuthService.getInstance().register(username, email, password);
}