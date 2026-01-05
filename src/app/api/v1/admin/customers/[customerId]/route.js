import { getUserRole } from "@/helpers/getUserId";
import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { isValidObjectId } from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const role = await getUserRole(request);
    if (role !== "Admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { customerId } = await params;

    if (!isValidObjectId(customerId)) {
      return NextResponse.json(
        { success: false, message: "Invalid customer ID" },
        { status: 400 }
      );
    }

    const customer = await UserModel.findById(customerId)
      .select("name email phone isBlocked role createdAt")
      .lean();

    if (!customer || customer.role !== "User") {
      return NextResponse.json(
        { success: false, message: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: customer,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /admin/customers/[customerId]", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
