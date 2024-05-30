import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "./server/libs/auth";

export async function middleware(req:NextRequest) {
    const token = req.cookies.get('token')?.value;

    console.log('Token',token);
    
    const verifiedToken = token && (await verifyAuth(token).catch((error : any) => {
        console.log('Token is invalid' + error);
    }));

    if(req.nextUrl.pathname.startsWith('/login') && !verifiedToken){
        return 
    }

    if(req.url.includes('/login') && verifiedToken){
        return NextResponse.redirect(new URL('/',req.url));
    }

    if(!verifiedToken){
        return NextResponse.redirect(new URL('/login',req.url));
    }

}

export const config = {
    matcher : ['/login','/dashboard']
}