import User, { IUser } from "@/server/models/User";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest, params: { params: { userId: string } }): Promise<NextResponse> => {
    const { userId } = params.params;
    console.log(userId);
    const { username, email, password, profileImage } = await req.json();
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

        if (profileImage) {
            userExist.profileImage = profileImage;
        }

        const userSave = await userExist.save();

        const user:IUser = {
            _id: userSave._id,
            username: userSave.username,
            email: userSave.email,
            profileImage: userSave.profileImage,
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