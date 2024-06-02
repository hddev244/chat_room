import { NextResponse } from "next/server";
import User from "../models/User.model";
import { connectToDatabase } from "../mongodb";

export class UserService {
    private static instance: UserService;

    private constructor() {}

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }

        return UserService.instance;
    }

    public async getAllUser(): Promise<NextResponse> {
        try {
            await connectToDatabase();
    
            const allUser = await User.find().select('-password')   ;
    
            return NextResponse.json(allUser,{status:200});
        }
        catch (error) {
            return NextResponse.json({
                message: "Lỗi không thể lấy dữ liệu người dùng!",
            },{status:500});
        }
    }


    public async searchContact(query: string): Promise<NextResponse> {
        if (!query) {
            return NextResponse.json({ message: 'Vui lòng nhập từ khóa tìm kiếm' }, { status: 400 });
        }   
        try {
            await connectToDatabase();
    
            const users = await User.find({
                $or: [
                    { username: { $regex: query, $options: 'i' } },
                    { email: { $regex: query, $options: 'i' } }
                ]
            });
            return NextResponse.json(users,{status:200});
        } catch (error:any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }

    public async getUserById(userId: string): Promise<NextResponse> {
        try {
            await connectToDatabase();
    
            const user = await User.findById(userId).select('-password');
    
            return NextResponse.json(user,{status:200});
        } catch (error) {
            return NextResponse.json({ message: 'Không tìm thấy người dùng' }, { status: 404 });
        }
    }
}