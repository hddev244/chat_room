import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import Image, { IImage } from "@/server/models/Image.model";
import { connectToDatabase } from "@/server/mongodb";

export const GET = async (req: Request, params: { params: { query: string } }): Promise<NextResponse> => {
    const { query } = params.params;
    try {
        connectToDatabase();

        if (!query) {
            return NextResponse.json({ message: 'Query is required' }, { status: 400 });
        }

        const imageFound: IImage = await Image.findOne({ name: query })    // Tìm ảnh trong database
            .exec();
        console.log("imageFound", imageFound);
        if (!imageFound) {
            return NextResponse.json({ message: 'Image not found 1' }, { status: 404 });
        }

        const filePath = path.join(process.cwd(), imageFound.path); // Tạo đường dẫn đến file (từ thư mục gốc của project đến thư mục chứa file
           // kiểm tra xem file có tồn tại không
        try {
            const imageBuffer = await fs.readFileSync(filePath);

            // Thiết lập header của HTTP response file base64
            // const headers = new Headers();
            // headers.set('Content-Type', fileType );
            // headers.set('Content-Length', imageStat.size.toString());

            const  response = new NextResponse(imageBuffer);

            return response;
        }
        catch (error:any) {
            return NextResponse.json({ error }, { status: 404 });
        }
        

            


    } catch (error) {
        return NextResponse.json({ error }, { status: 404 });
    }
    return NextResponse.json({ message: 'Image not found 3' }, { status: 404 });
}                       