import { NextResponse } from "next/server";
import User, { IUser } from "../models/User.model";
import { connectToDatabase } from "../mongodb";
import bcrypt from 'bcryptjs';
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { getJwtSecretKey } from "../libs/auth";
import { nanoid } from "nanoid";


export class AuthService {
    private static instance: AuthService;
    private constructor() { }

    public static getInstance(): AuthService {
        connectToDatabase();
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }

        return AuthService.instance;
    }

    public async login(username: string, password: string): Promise<NextResponse> {
        if (!username || !password) {
            return NextResponse.json({ message: 'Vui lòng điền đầy đủ thông tin' }, { status: 400 });
        }

        try {
            connectToDatabase();

            const userExist:IUser = await User.findOne()
                .or([
                    { username: username },
                    { email: username }
                ]);
            if (!userExist) {
                return NextResponse.json({ message: 'Tài khoản hoặc mật khẩu không đúng' }, { status: 400 });
            }

            if (userExist.password) {
                const isPasswordMathc = await bcrypt.compare(password, userExist.password);

                if (!isPasswordMathc) {
                    return NextResponse.json({ message: 'Tài khoản hoặc mật khẩu không đúng' }, { status: 400 });
                }
            } else {
                return NextResponse.json({ message: 'Tài khoản của bạn không hợp lệ!' }, { status: 500 });
            }
          

            const token = await new SignJWT({ userId: userExist._id })
                                        .setProtectedHeader({ alg: 'HS256' })
                                        .setIssuedAt()
                                        .setExpirationTime('2h')
                                        .setJti(nanoid())
                                        .sign(new TextEncoder().encode(getJwtSecretKey())); 

            userExist.password = undefined;

            // Set cookie for user and token
            cookies().set('user', JSON.stringify(userExist), {
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

            return NextResponse.json({
                message: 'Đăng nhập thành công',
                user: userExist,
                token: token
            },
                { status: 200 });
        } catch (error: any) {
            return NextResponse.json({ message: 'Lỗi hệ thống, vui lòng thử lại sau!' }, { status: 500 });
        }

    }

    public async register(username: string, email: string, password: string): Promise<NextResponse> {
        if (!username || !email || !password) {
            return NextResponse.json({ message: 'Vui lòng điền đầy đủ thông tin' }, { status: 400 });
        }
        
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if(!usernameRegex.test(username)){
            return NextResponse.json({ message: 'Tên đăng nhập không được chứa ký tự đặc biệt' }, { status: 400 });
        }

        try {
            connectToDatabase();

            const userExists = await User.findOne().or([{ username: username }, { email: email }]);
            if (userExists) {
                throw new Error('Tài khoản hoặc email đã tồn tại');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                username: username,
                email: email,
                password: hashedPassword
            });

            return NextResponse.json({
                message: 'Đăng ký thành công',
                user: {
                    username: user.username,
                    email: user.email,
                    password: password
                }
            },
                { status: 200 });
        }
        catch (error: any) {
            return NextResponse.json({ message: error.message }, { status: 500 });
        }
    }

    public async logout(): Promise<NextResponse> {
        try {
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
                .json({ message: 'Logout success' }, { status: 200 })
        } catch (error) {
            console.error(error);
            return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
        }
    }
}