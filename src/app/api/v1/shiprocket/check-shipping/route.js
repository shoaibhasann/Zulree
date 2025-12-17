export async function POST(req) {
  let rawBody;

  try {
    rawBody = await req.text(); // 👈 IMPORTANT
  } catch (e) {
    return NextResponse.json(
      { success: false, error: "Unable to read request body" },
      { status: 400 }
    );
  }

  console.log("RAW BODY RECEIVED 👉", rawBody);

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid JSON body",
        rawBody,
      },
      { status: 400 }
    );
  }

  // 👇 ab aage ka code
  try {
    const data = await checkShippingService({
      pickupPincode: body.pickup_pincode,
      deliveryPincode: body.delivery_pincode,
      weight: body.weight,
      cod: body.cod,
      declaredValue: body.product_value,
    });

    const companies = data?.data?.available_courier_companies || [];
    const estimate = estimateShippingForUser(companies);

    return NextResponse.json({
      success: true,
      user_estimate: {
        shipping_charge: estimate.approxShippingCharge,
        delivery_time: estimate.approxDeliveryDays,
        currency: "INR",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
