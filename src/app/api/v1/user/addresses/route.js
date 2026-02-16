import { NextResponse } from "next/server";
import { getUserId } from "@/helpers/getUserId";
import { UserModel } from "@/models/user.model";

export async function POST(request) {
  try {

    const userId = await getUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const {
      label,
      name,
      phone,
      line1,
      line2,
      city,
      state,
      pincode,
      country = "India",
      isDefault = false,
    } = body;

    if (!name || !phone || !line1 || !city || !state || !pincode) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const shouldBeDefault = user.addresses.length === 0 ? true : isDefault;

    const newAddress = {
      label,
      name,
      phone,
      line1,
      line2,
      city,
      state,
      pincode,
      country,
      isDefault: shouldBeDefault,
    };

    user.addresses.push(newAddress);

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Address added successfully",
        addresses: user.addresses,
      },
      { status: 201 },
    );

  } catch (error) {
    console.error("POST /api/v1/addresses error:", error);
    return NextResponse.json(
      { error: "Failed to add address" },
      { status: 500 },
    );
  }
}
