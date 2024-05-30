import User from "@/server/models/User";
import bcrypt from 'bcryptjs';

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
    const payload = await req.json();
    const { username, email, password } = payload;
    try {
        const userExists = await User.findOne().or([{ username: username }, { email: email }]);
        if (userExists) {
            return NextResponse.json({ message: 'Tài khoản hoặc email đã tồn tại' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username: username,
            email: email,
            password: hashedPassword
        });
        return NextResponse.json({
            user: {
                username: user.username,
                email: user.email
            },
            message: "Đăng ký thành công!"
        }, { status: 201 });
    }
    catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}