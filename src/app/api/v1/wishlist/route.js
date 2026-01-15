import { calculateFinalPrice } from "@/helpers/calculateFinalPrice";
import { getUserId } from "@/helpers/getUserId";
import { dbConnect } from "@/lib/dbConnect";
import { ProductModel } from "@/models/product.model";
import { VariantModel } from "@/models/variant.model";
import { WishlistModel } from "@/models/wishlist.model";


export async function POST(request) {
  try {
    await dbConnect();

    const user = await getUserId(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId, variantId, notifyOnRestock = false } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    // 🔍 Validate Product
    const product = await ProductModel.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    let priceAtAdd = calculateFinalPrice(product.price, product.discountpercent);

    // 🔍 Variant handling
    if (variantId) {
      const variant = await VariantModel.findById(variantId);
      if (!variant) {
        return NextResponse.json(
          { message: "Variant not found" },
          { status: 404 }
        );
      }
    }

    const wishlistItem = await WishlistModel.create({
      user: user.id,
      product: productId,
      variant: variantId || null,
      priceAtAdd,
      notifyOnRestock,
    });

    return NextResponse.json(
      { message: "Added to wishlist", wishlistItem },
      { status: 201 }
    );
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "Already in wishlist" },
        { status: 409 }
      );
    }

    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();

    const user = await getUserId(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId, variantId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const deleted = await WishlistModel.findOneAndDelete({
      user: user.id,
      product: productId,
      ...(variantId ? { variant: variantId } : { variant: null }),
    });

    if (!deleted) {
      return NextResponse.json(
        { message: "Item not found in wishlist" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Removed from wishlist" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

