import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST():Promise<NextResponse> {
    cookies().set('user', '', {
        httpOnly: true,
        path: '/',
        maxAge: 0,
        sameSite: 'strict',
    
    });
    
    cookies().set('token', '', {
        httpOnly: true,
        path: '/',
        maxAge: 0,
        sameSite: 'strict',
    });
    return NextResponse
        .json({ message: 'Logout success' }, { status: 200})
}