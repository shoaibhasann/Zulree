import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request) {
  try {
    const payload = {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    };

    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, 
      }
    );

    const data = response.data;

    if (!data?.token) {
      return NextResponse.json(
        { success: false, message: "Shiprocket login failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      token: data.token,
      expires_in: data.expires_in || null,
    });
  } catch (error) {
    console.error(
      "GET /shiprocket/login error:",
      error?.response?.data || error.message
    );

    return NextResponse.json(
      { success: false, message: "Shiprocket login error" },
      { status: 500 }
    );
  }
}
