import { Badge } from "@/components/ui/badge";



const StockBadge = ({ stock }) => {
  if (stock === 0) return <Badge variant="destructive">Out of stock</Badge>;
  if (stock < 5) return <Badge variant="secondary">Low stock</Badge>;
  return <Badge variant="success">In stock</Badge>;
};

export default StockBadge;