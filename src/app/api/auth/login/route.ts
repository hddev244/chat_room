import User from "@/server/models/User";
import { cp } from "fs";
import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { nanoid } from "nanoid";
import { sign } from "crypto";
import { getJwtSecretKey } from "@/server/libs/auth";

export async function POST(req: NextRequest): Promise<NextResponse> {
    const payload = await req.json();
    const { username, password } = payload;
    try {
        const userExist = await User.findOne().or([{ username: username }, { email: username }]);
        if (!userExist) {
            return NextResponse.json({ message: 'Tài khoản hoặc mật khẩu không đúng' }, { status: 400 });
        }
        const isPasswordMatch = await bcrypt.compare(password, userExist.password);

        if (!isPasswordMatch) {
            return NextResponse.json({ message: 'Tài khoản hoặc mật khẩu không đúng' }, { status: 400 });
        }

        const token = await new SignJWT({})
            .setProtectedHeader({ alg: 'HS256' })
            .setJti(nanoid())
            .setIssuedAt()
            .setExpirationTime('2h')
            .sign(new TextEncoder().encode(getJwtSecretKey()));

        const user = {
            id: userExist.id,
            username: userExist.username,
            email: userExist.email,
            avatar: userExist.profileImage,
        }
        
        return NextResponse.json(
            { user: user},
            {
                status: 200,
                headers: {
                    'Set-Cookie': `token=${token},user=${JSON.stringify(user)}; HttpOnly; Path=/; Max-Age=7200; SameSite=Strict;`,
                },
            });
    }
    catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}