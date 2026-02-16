import { NextResponse } from "next/server";
import crypto from "crypto";

// {
//   userId,
//   items,
//   totalAmount,
//   address,
//   payment: {
//     gateway: "razorpay",
//     paymentId,
//     orderId,
//     status: "PAID"
//   },
//   status: "CONFIRMED"
// }


// await createShiprocketOrder({
//   payment_method: "Prepaid",
//   order_id,
//   address,
//   items,
// });


export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Payment verification failed" },
        { status: 400 },
      );
    }

    // ✅ PAYMENT VERIFIED
    // 👉 Save order in DB here
    // 👉 Mark payment = PAID

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verify payment error", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
