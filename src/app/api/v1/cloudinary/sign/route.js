export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function POST(request) {
  try {

    const body = await request.json();

    const { paramsToSign } = body;

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({
      signature
    });

  } catch (err) {
    console.error("Cloudinary sign error:", err);
    return NextResponse.json(
      { success: false, message: "Signing failed" },
      { status: 500 }
    );
  }
}


export async function DELETE(request) {
  try {
   

    const { public_id } = await request.json();

    const result = await cloudinary.api.delete_resources([public_id], {
      resource_type: "image",
      type: "upload",
    });


    if (result.result !== "ok") {
      return NextResponse.json(
        { success: false, message: "Cloudinary deletion failed", result },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /cloudinary/sign Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
