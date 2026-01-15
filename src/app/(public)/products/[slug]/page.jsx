"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import api from "@/app/lib/api";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductDetailSkeleton from "@/components/skeletons/ProductDetailSkeleton";
import { TicketPercent } from "lucide-react";
import FAQItem from "@/components/FAQItem";
import RelatedProducts from "@/components/RelatedProducts";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [openDescription, setOpenDescription] = useState(false);
  const [openCare, setOpenCare] = useState(false);
  const [openShipping, setOpenShipping] = useState(false);

  useEffect(() => {
    if (!slug) return;

    async function getProduct() {
      try {
        setLoading(true);
        const { data } = await api.get(`/api/v1/products/${slug}`);
        if (data.success) {
          setProduct(data.data);
          setError(null);
        }
      } catch (err) {
        setError(err?.response?.data?.message || "Product not found");
      } finally {
        setLoading(false);
      }
    }

    getProduct();
  }, [slug]);

  if (loading) return <ProductDetailSkeleton />;
  if (error) return <p className="text-center py-20">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      {product && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14">
          {/* LEFT – IMAGE GALLERY */}
          <ProductImageGallery
            discount={product.discountPercent}
            images={product.images}
            title={product.title}
          />

          {/* RIGHT – PRODUCT INFO */}
          <div className="flex flex-col">
            {/* CATEGORY */}
            <p className="text-xs uppercase tracking-widest opacity-60 mb-3">
              {product.category?.main}
            </p>
            {/* TITLE */}
            <h1 className="text-3xl md:text-4xl font-heading mb-4">
              {product.title}
            </h1>
            {/* RATINGS */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-500">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i <= 4 ? "fill-yellow-500" : "fill-gray-300"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09L5.5 11.545 1 7.41l6.06-.88L10 1l2.94 5.53 6.06.88-4.5 4.135 1.378 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm opacity-70">4.0 • 128 reviews</span>
            </div>
            {/* PRICE */}
            <div className="flex items-center gap-3 mb-6">
              {product.discountPercent > 0 && (
                <span className="line-through opacity-50 text-lg">
                  ₹{product.price}
                </span>
              )}
              <span className="text-2xl font-medium">
                ₹{product.finalPrice ?? product.price}
              </span>
              {product.discountPercent > 0 && (
                <span className="text-sm flex items-center gap-1 text-green-600">
                  <TicketPercent className="w-4 h-4" />
                  Save {product.discountPercent}%
                </span>
              )}
            </div>
            {/* QUANTITY */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium">Quantity</span>
              <div className="flex items-center border rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                >
                  −
                </button>
                <span className="w-10 text-center text-sm font-medium select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            {/* OFFERS (DESCRIPTION REPLACEMENT) */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold mb-3">Available Offers</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <TicketPercent className="w-4 h-4 text-pink-600" />
                  Free Shipping Above ₹599
                </li>
                <li className="flex items-center gap-2">
                  <TicketPercent className="w-4 h-4 text-pink-600" />
                  Free gift on shopping above ₹699
                </li>
                <li className="flex items-center gap-2">
                  <TicketPercent className="w-4 h-4 text-pink-600" />
                  Free organiser on shopping above ₹1199
                </li>
                <li className="flex items-center gap-2">
                  <TicketPercent className="w-4 h-4 text-pink-600" />
                  Get ₹100 off on shopping above ₹1499
                </li>
              </ul>
            </div>
            {/* ACTION BUTTONS */}
            <div className="flex flex-col gap-3">
              <Button className="w-full border-0 md:w-2/3 bg-pink-600 text-white rounded-full py-6 hover:bg-pink-700">
                Add to Cart
              </Button>

              <Button
                variant="outline"
                className="w-full cursor-pointer md:w-2/3 rounded-full py-6 border-black hover:bg-black hover:text-white"
              >
                Buy Now
              </Button>
            </div>
            {/* TRUST */}
            <p className="text-xs opacity-60 mt-3">
              Free shipping • Easy returns • Authentic jewellery
            </p>
            {/* DESCRIPTION */}{" "}
            <p className="text-sm my-8 leading-relaxed opacity-80 border-t pt-6 hidden md:block">
              {" "}
              Description: {product?.description}{" "}
            </p>
            <div className="block md:hidden">
              <FAQItem
                question="Product Description"
                isOpen={openDescription}
                onToggle={() => setOpenDescription((p) => !p)}
              >
                <p>{product.description}</p>
              </FAQItem>
            </div>
            {/* CORE SPECS (NOW BELOW OFFERS ✅) */}
            <div className="border-t pt-6 space-y-4 text-sm">
              <Spec label="Stone Type" value={product.coreSpecs?.stoneType} />
              <Spec
                label="Base Material"
                value={product.coreSpecs?.baseMaterial}
              />
              <Spec label="Quality" value={product.coreSpecs?.quality} />
              <Spec
                label="Weight"
                value={
                  product.coreSpecs?.weight_g &&
                  `${product.coreSpecs.weight_g} g`
                }
              />
              <Spec
                label="Authenticity"
                value={product.coreSpecs?.isAuthentic ? "Certified" : "—"}
              />
            </div>
            <div>
              <FAQItem
                question="Shipping & Returns"
                isOpen={openShipping}
                onToggle={() => setOpenShipping((p) => !p)}
              >
                <div className="space-y-6">
                  {/* SHIPPING POLICY */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3">
                      - Shipping Policy
                    </h4>

                    <ul className="list-disc pl-4 space-y-2 text-sm">
                      <li>₹59 for orders below ₹599</li>
                      <li>Free shipping for orders above ₹599</li>
                    </ul>

                    <button
                      className="mt-2 text-sm text-pink-600 font-medium hover:underline"
                      type="button"
                    >
                      View Shipping Policy
                    </button>
                  </div>

                  {/* REFUND & EXCHANGE */}
                  <div>
                    <h4 className="text-sm font-semibold mb-3">
                      - Refund & Exchange
                    </h4>

                    <p className="text-sm leading-relaxed">
                      We strive to ensure your satisfaction with every purchase
                      from <span className="font-medium">Zulree</span>. If for
                      any reason you&apos;re not completely satisfied with your
                      order, we offer both refunds and exchanges within{" "}
                      <span className="font-medium">48 hours</span>.
                    </p>

                    <p className="text-sm leading-relaxed mt-2">
                      Please refer to our return policy page for more detailed
                      information on how to initiate a return or exchange. If
                      you have any questions or need further assistance, our
                      customer support team is always here to help.
                    </p>

                    <button
                      className="mt-2 text-sm text-pink-600 font-medium hover:underline"
                      type="button"
                    >
                      View Return & Exchange Policy
                    </button>
                  </div>
                </div>
              </FAQItem>
            </div>
            <div>
              <FAQItem
                question="Care Instructions"
                isOpen={openCare}
                onToggle={() => setOpenCare((p) => !p)}
              >
                <ul className="list-disc text-sm pl-4 space-y-1">
                  <li>Avoid contact with water</li>
                  <li>Store in dry place</li>
                  <li>Clean with soft cloth</li>
                </ul>
              </FAQItem>
            </div>
          </div>
        </div>
      )}
      {/* Related Products  */}
      <RelatedProducts slugProp={slug} />
    </div>
  );
}

/* SPEC ROW */
function Spec({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex justify-between">
      <span className="opacity-60">{label}</span>
      <span>{value}</span>
    </div>
  );
}
