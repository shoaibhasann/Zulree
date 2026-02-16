import { getUserId } from "@/helpers/getUserId";
import { isValidObjectId } from "@/helpers/isValidObject";
import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET(request){
    await dbConnect();
    try {
        const userId = await getUserId(request);

        console.log("Authenticated user ID:", userId);

        if(!isValidObjectId(userId)){
            return NextResponse.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 });
        }

        const user = await UserModel.findById(userId);

        if(!user){
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404});
        }
        
        return NextResponse.json({
            success: true,
            message: "User fetched successfully",
            authenticated: true,
            user
        });
    } catch (err) {
        console.error("GET /auth/me error: ", err);
        return NextResponse.json({
            success: false,
            message: "Internal Server Error"
        }, { status: 500 });
    }
}