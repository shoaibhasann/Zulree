import { Star } from "lucide-react";

export default function ReviewCard({ review }) {
  return (
    <div
      className="
        w-[320px] shrink-0 mx-3
        rounded-2xl border border-border
        bg-background p-6
        shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)]
        relative overflow-hidden
      "
    >
      {/* subtle gradient accent */}
      <div className={`absolute inset-0 bg-gradient-to-br ${review.accent}`} />

      <div className="relative">
        <h4 className="font-medium text-base mb-1">{review.title}</h4>

        <div className="flex gap-1 text-yellow-400 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} fill="currentColor" />
          ))}
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {review.text}
        </p>

        <span className="text-sm font-medium">— {review.name}</span>
      </div>
    </div>
  );
}
