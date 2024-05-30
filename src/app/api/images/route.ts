import { NextRequest, NextResponse } from "next/server";
import fs, { writeFile } from "fs/promises";
import path from "path";


export async function POST(req: NextRequest): Promise<NextResponse> {
    const data = await req.formData();

    const file: File | null = data.get('file') as File;
    if (!file) {
        return NextResponse.json({ message: 'File not found' }, { status: 400 });
    }

    const bites = await file.arrayBuffer();
    const buffer = Buffer.from(bites);

    const fileName = Date.now() + '-' + file.name;

    try {
        await fs.readdir(path.join(process.cwd() + "/public", "/images"));
    } catch (error) {
        await fs.mkdir(path.join(process.cwd() + "/public", "/images"));
    }

    const p = path.join(process.cwd() + "/public", "/images", fileName);
    await writeFile(p, buffer);

    const hostUrl = process.env.HOST_URL || "";

    return NextResponse.json({ status: 200, url:hostUrl+"/images/" + fileName });   
}