import { NextResponse } from "next/server";
import { getUserRole } from "@/helpers/getUserId";

export async function POST(request) {
  try {
    const role = await getUserRole(request);

    if (role !== "Admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { public_id, secure_url } = body;

    if (!public_id || !secure_url) {
      return NextResponse.json(
        { success: false, message: "Invalid image data" },
        { status: 400 }
      );
    }

    // 🔥 For now just log it (later DB me save hoga)
    console.log("📸 Image received on backend:", {
      public_id,
      secure_url,
    });

    return NextResponse.json({
      success: true,
      message: "Image data received successfully",
      image: { public_id, secure_url },
    });

  } catch (err) {
    console.error("save image error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
