import { getUserId } from "@/helpers/getUserId";
import { isValidObjectId } from "@/helpers/isValidObject";
import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
    await dbConnect();

    try {
        const userId = await getUserId(request);

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { addressId } = await params;

        if (!isValidObjectId(addressId)) {
            return NextResponse.json({ error: "Invalid address ID" }, { status: 400 });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);

        if (addressIndex === -1) {
            return NextResponse.json({ error: "Address not found" }, { status: 404 });
        }

        user.addresses.forEach((addr, index) => {
            if(index === addressIndex){
                addr.isDefault = true;
            } else {
                addr.isDefault = false;
            }
        });

        await user.save();

        return NextResponse.json(
            { success: true, message: "Default address updated successfully", addresses: user.addresses , },
            { status: 200 }
        );

    } catch (error) {
        console.error("PATCH /user/addresses/[addressId]/default error: ", error);
        return NextResponse.json(
            { success: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}