import { getUserId } from "@/helpers/getUserId";
import { isValidObjectId } from "@/helpers/isValidObject";
import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET(request){
    await dbConnect();

    try {
        const userId = await getUserId(request);
        console.log("id: ", userId);

        if(!isValidObjectId(userId)){
            return NextResponse.json({
                success: false,
                message: "Invalid user ID"
            }, { status: 400 });
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