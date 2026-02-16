import { getUserId } from "@/helpers/getUserId";
import { isValidObjectId } from "@/helpers/isValidObject";
import { normalizeIndianPhoneNumber } from "@/helpers/validatePhone";
import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function PATCH(request, { params }) {
    await dbConnect();
    try {
      const userId = await getUserId(request);

      if (!isValidObjectId(userId)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }

      const { addressId } = await params;

      if (!isValidObjectId(addressId)) {
        return NextResponse.json(
          { error: "Invalid address ID" },
          { status: 400 },
        );
      }

      const body = await request.json();

      if (!Object.keys(body).length) {
        return NextResponse.json(
          { error: "No fields to update" },
          { status: 400 },
        );
      }

      const user = await UserModel.findById(userId);

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const addressIndex = user.addresses.findIndex(
        (addr) => addr._id.toString() === addressId,
      );

      if (addressIndex === -1) {
        return NextResponse.json(
          { error: "Address not found" },
          { status: 404 },
        );
      }

      const addressToUpdate = user.addresses[addressIndex];

      const allowedFields = [
        "label",
        "name",
        "phone",
        "line1",
        "line2",
        "city",
        "state",
        "pincode",
        "country",
      ];

      for (const key of allowedFields) {
        if (body[key] !== undefined) {
          if (key === "phone") {
            const normalized = normalizeIndianPhoneNumber(body.phone);

            if (!normalized) {
              return NextResponse.json(
                { error: "Invalid Indian phone number" },
                { status: 400 },
              );
            }

            addressToUpdate[key] = normalized;
          } else {
            addressToUpdate[key] = body[key];
          }
        }
      }

      await user.save();

      return NextResponse.json({
        success: true,
        addresses: user.addresses,
      });
    } catch (error) {
        console.error("PATCH /user/addresses/[addressId] error: ", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}



export async function DELETE(request, { params }) {
  await dbConnect();

  try {

    const userId = await getUserId(request);

    if (!isValidObjectId(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }


    const { addressId } = await params; 

    if (!isValidObjectId(addressId)) {
      return NextResponse.json(
        { error: "Invalid address ID" },
        { status: 400 },
      );
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === addressId,
    );


    if (addressIndex === -1) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    const wasDefault = user.addresses[addressIndex].isDefault;

    user.addresses.splice(addressIndex, 1);

    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();

    return NextResponse.json({
      success: true,
      addresses: user.addresses,
    });
  } catch (error) {
    console.error("DELETE /user/addresses/[addressId] error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

