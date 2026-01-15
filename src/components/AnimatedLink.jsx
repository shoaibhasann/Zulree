import Link from "next/link";
import clsx from "clsx";

export default function AnimatedLink({
  href,
  label,
  className = "",
  underlineClass = "bg-white",
}) {
  return (
    <Link
      href={href}
      className={clsx("relative inline-block group cursor-pointer", className)}
    >
      {/* TEXT */}
      <span className="relative z-10">{label}</span>

      {/* UNDERLINE */}
      <span
        className={clsx(
          "absolute left-0 -bottom-1 h-[1.5px] w-full scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100",
          underlineClass
        )}
      />
    </Link>
  );
}
