import { NextResponse } from "next/server";

export async function POST():Promise<NextResponse> {
    return NextResponse
        .json({ message: 'Logout success' }, { status: 200, headers: {
            'Set-Cookie': `token=,user=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict;`,
        }})
}