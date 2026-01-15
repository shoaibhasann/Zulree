import Link from "next/link";

export default function ExploreMore({ href }) {
  return (
    <div className="text-center mt-12">
      <Link
        href={href}
        className="inline-flex items-center gap-2 text-sm font-medium border-b border-foreground pb-1 hover:opacity-70 transition"
      >
        Explore More →
      </Link>
    </div>
  );
}
