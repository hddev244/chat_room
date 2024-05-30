import User from "@/server/models/User";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest, params: { params: { userId: string } }): Promise<NextResponse> => {
    const { userId } = params.params;
    const { username, email, password, avatar } = await req.json();
    try {
        const userExist = await User.findById(userId);
        if (!userExist) {
            return NextResponse.json({ message: 'User not found' }, { status: 400 });
        }

        if (username) {
            userExist.username = username;
        }

        if (email) {
            userExist.email = email;
        }

        if (password) {
            userExist.password = password;
        }

        if (avatar) {
            userExist.profileImage = avatar;
        }

        const userSave = await userExist.save();

        const user = {
            id: userSave.id,
            username: userSave.username,
            email: userSave.email,
            avatar: userSave.profileImage,
        }

        return NextResponse.json(
            { user, message: "Cập nhật thành công!" },
            {
                status: 200,
                headers: {
                    'Set-Cookie': `user=${JSON.stringify(user)}; HttpOnly; Path=/; Max-Age=7200; SameSite=Strict;`,
                },
            });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}