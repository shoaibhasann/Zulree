import ImageCarousel from "./ImageCarousel";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { ConversationRelay } from "twilio/lib/twiml/VoiceResponse";
import { useRouter } from "next/navigation";

export default function VariantSummary({ productId, variant, onDelete }) {
  const router = useRouter();
  const totalStock = variant.sizes.reduce((sum, s) => sum + (s.stock || 0), 0);
  return (
    <Card className="border rounded-xl shadow-sm  bg-admin-foreground">
      <CardContent className="p-6">
        {/* GRID LAYOUT → NO OVERLAP */}
        <div className="grid grid-cols-[260px_1fr] gap-8 items-start">
          {/* LEFT: IMAGES (FIXED WIDTH) */}
          <div>
            <ImageCarousel
              images={variant.images}
              alt={`${variant.color} variant`}
              size="md"
            />
          </div>

          {/* RIGHT: DETAILS */}
          <div className="space-y-4 ml-12 text-white">
            {/* HEADER */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  Color: {variant.color}
                </h3>
              </div>

              <Badge
                className={`text-xs px-3 py-1 text-black ${
                  variant.isActive ? "bg-green-500" : "bg-red-500"
                }`}
              >
                {variant.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            {/* STATS */}
            <div className="flex flex-wrap gap-4 text-sm">
              <span>
                <strong>Sizes:</strong> {variant.sizes.length}
              </span>
              <span>
                <strong>Total Stock:</strong>{" "}
                {totalStock > 0 ? totalStock : "Out"}
              </span>
              <span>
                <strong>SKUs:</strong> {variant.sizes.length}
              </span>
            </div>

            {/* SIZE / STOCK CHIPS */}
            <div className="flex flex-wrap gap-2">
              {variant.sizes.map((s) => (
                <Badge
                  key={s._id}
                  variant="outline"
                  className={`text-sm text-slate-200 p-2 ${s.isActive ? "border-green-500" : "border-red-500"} border-dashed border-l-2 ${
                    s.stock === 0
                      ? "border-red-400 text-red-500"
                      : s.stock <= 3
                        ? "border-yellow-400 text-yellow-600"
                        : ""
                  }`}
                >
                  {s.size} · {s.stock > 0 ? s.stock : "Out of stock"}
                </Badge>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-2">
              <Button
                className="text-black"
                variant="outline"
                size="sm"
                onClick={() => router.replace(`/admin/products/${productId}/variants/${variant._id}/edit`)}
              >
                <Pencil className="w-4 h-4 mr-1" />
                Edit
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete?.(variant)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
