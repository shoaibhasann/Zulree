import { CirclePercent, Coins, MoveUp, ShoppingCart } from "lucide-react";
import StatCard from "./StatCard";



export default function DashboardHeader(){
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          icon={Coins}
          title="Gross Profit"
          value="$10,20,456"
          percentage="+21.2%"
          delta="+216,428"
          period="this month"
          trend="up"
        />
        <StatCard
          icon={CirclePercent}
          title="Net Profit"
          value="$8,45,120"
          percentage="+12.4%"
          delta="+98,100"
          trend="up"
        />

        <StatCard
          icon={ShoppingCart}
          title="Orders Completed"
          value="12.5K"
          percentage="+62%"
          delta="+7.7k"
          trend="up"
        />
      </div>
    );
}