"use client";

export default function Badge({count}) {

  return (
    <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 flex items-center justify-center rounded-full bg-accent text-white text-[10px] font-medium leading-none">
      {count}
    </span>
  );
}
