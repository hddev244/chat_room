import User, { IUser } from "@/server/models/User";
import { SignJWT } from "jose";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { nanoid } from "nanoid";
import { getJwtSecretKey } from "@/server/libs/auth";
import { cookies } from "next/headers";

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
        console
        const user:IUser = {
            _id: userExist.id,
            username: userExist.username,
            email: userExist.email,
            profileImage: userExist.profileImage,
        }

        cookies().set('user', JSON.stringify(user), {
            httpOnly: true,
            path: '/',
            maxAge: 7200,
            sameSite: 'strict',
        
        });
        
        cookies().set('token', token, {
            httpOnly: true,
            path: '/',
            maxAge: 7200,
            sameSite: 'strict',
        });
        
        return NextResponse.json({ user: user, token: token }, { status: 200})
    }
    catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}