import { AuthService } from "@/server/services/auth.service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(): Promise<NextResponse> {
    return AuthService.getInstance().logout();
}