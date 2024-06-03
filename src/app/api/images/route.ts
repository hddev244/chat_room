import { NextRequest, NextResponse } from "next/server";
import fs, { writeFile } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { parseJwt } from "@/server/libs/auth";
import Image from "@/server/models/Image.model";


export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        // Get token from cookies
        const token = cookies().get('token');
        const tokenInfo = parseJwt(token?.value || "");
        
        if (!tokenInfo) {
            return NextResponse.json({ message: 'Token is invalid' }, { status: 400 });
        }

        const data = await req.formData();
        const file: File | null = data.get('file') as File;

        if (!file) {
            return NextResponse.json({ message: 'File not found' }, { status: 400 });
        }

        const bites = await file.arrayBuffer();
        const buffer = Buffer.from(bites);
        const type = file.type;
        if (!type.includes('image')) {
            return NextResponse.json({ message: 'File is not an image' }, { status: 400 });
        }
        // Check if file extension is allowed
        const fileExtension = type.split('/')[1];
        const fileName = Date.now() + '.' + fileExtension;
        
        // Check if images folder exists
        const localPath = path.join("/public", "/images/", tokenInfo.userId);
        
        try {
            await fs.readdir(path.join(process.cwd(), localPath));
        } catch (error) {
            await fs.mkdir(path.join(process.cwd(), localPath));
        }

        // Save image to public/images folder
        const p = path.join(process.cwd(), localPath, fileName);
        await writeFile(p, buffer);

        // Save image to database
        const hostUrl = process.env.SERVER_HOST || "";
        const image = new Image({
            name: fileName,
            url: hostUrl+ "/images/"+tokenInfo.userId +"/" + fileName,
            path: path.join(localPath,"/", fileName),
            owner: tokenInfo.userId,
        });

        const imageSaved = await image.save();

        console.log(tokenInfo);
        console.log(imageSaved);
        return NextResponse.json({url: imageSaved.url}, { status: 200 });

    }
    catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}