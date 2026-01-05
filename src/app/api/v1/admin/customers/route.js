import { getUserRole } from "@/helpers/getUserId";
import { dbConnect } from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { NextResponse } from "next/server";

export async function GET(request) {
  await dbConnect();

  try {
    const role = await getUserRole(request);
    if (role !== "Admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized or page not found",
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const query = { role: "User" }; // only customers

    const customers = await UserModel.find(query)
      .select("name email phone isBlocked createdAt") // SAFE fields only
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await UserModel.countDocuments(query);

    return NextResponse.json(
      {
        success: true,
        message: "Customers fetched successfully",
        data: customers,
        meta: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /admin/customers error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
