import { getUserRole } from "@/helpers/getUserId";
import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export async function POST(request) {
  try {

    const role = await getUserRole(request);

    if(role !== "Admin"){
        return NextResponse.json({
            success: false,
            message: "Unauthorized"
        }, { status: 401 });
    }

    const body = await request.json();

    const { mainCategory, subCategory } = body;

    const slugify = (str) => str?.toLowerCase().replace(/\s+/g, "-");

    const folder = subCategory
      ? `/products/${slugify(mainCategory)}/${slugify(subCategory)}`
      : `/products/${slugify(mainCategory)}`;

    const timestamp = Math.round(Date.now() / 1000);

    const paramsToSign = {
      timestamp,
      folder,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      min_image_width: 800,
      min_image_height: 800,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json(
      {
        signature,
        timestamp,
        folder
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("sign error: ", err);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
