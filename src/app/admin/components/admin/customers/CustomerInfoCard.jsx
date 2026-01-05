import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function CustomerInfoCard({ customer }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Name</p>
          <p className="font-medium">{customer.name}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium">{customer.email}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Phone</p>
          <p className="font-medium">{customer.phone || "-"}</p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Status</p>
          {customer.isBanned ? (
            <Badge variant="destructive">Blocked</Badge>
          ) : (
            <Badge variant="success">Active</Badge>
          )}
        </div>

        <div>
          <p className="text-sm text-muted-foreground">Joined On</p>
          <p className="font-medium">
            {new Date(customer.createdAt).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
