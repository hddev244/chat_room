import { UserService } from "@/server/services/user.service";
import { NextResponse } from "next/server";

export const GET = async ():Promise<NextResponse> => {
   return UserService.getInstance().getAllUser();
}