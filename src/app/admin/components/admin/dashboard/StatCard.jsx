import { cn } from "@/lib/utils";

export default function StatCard({
  icon: Icon,
  title,
  value,
  percentage,
  delta,
  period = "this month",
  trend = "up", // "up" | "down"
}) {
  const isUp = trend === "up";

  return (
    <div className="border border-slate-500 rounded-md bg-admin-foreground p-4">
      {/* Icon */}
      <div className="h-10 w-10 border border-slate-500 bg-admin-bg-secondary rounded-full flex justify-center items-center">
        {Icon && <Icon className="text-white h-5 w-5" />}
      </div>

      {/* Title */}
      <p className="mt-4 text-slate-300 text-sm">{title}</p>

      {/* Value + Percentage */}
      <div className="mt-1 flex gap-3 items-center">
        <p className="text-white text-xl font-bold">{value}</p>

        <p
          className={cn(
            "text-sm px-2 rounded-xl flex items-center font-medium border border-slate-500",
            isUp ? "text-green-600 bg-admin-bg" : "text-red-500 bg-admin-bg"
          )}
        >
          {percentage}
        </p>
      </div>

      {/* Delta */}
      <p className="mt-1 flex gap-2 text-sm text-slate-300">
        <span
          className={cn(
            "font-medium",
            isUp ? "text-green-600" : "text-red-500"
          )}
        >
          {delta}
        </span>
        {period}
      </p>
    </div>
  );
}
