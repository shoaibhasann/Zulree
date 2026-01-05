import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import CustomerActions from "./CustomerActions";

export default function CustomersTable({ customers }) {
  if (!customers.length) {
    return (
      <p className="text-sm text-muted-foreground text-center">
        No customers found
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-admin-foreground">
          <TableHead className="text-admin-muted">Name</TableHead>
          <TableHead className="text-admin-muted">Email</TableHead>
          <TableHead className="text-admin-muted">Phone</TableHead>
          <TableHead className="text-admin-muted">Status</TableHead>
          <TableHead className="text-admin-muted">Joined</TableHead>
          <TableHead className="text-right text-admin-muted">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {customers.map((user) => (
          <TableRow className="hover:bg-admin-foreground" key={user._id}>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.phone || "-"}</TableCell>

            <TableCell>
              {user.isBlocked ? (
                <Badge variant="destructive">Blocked</Badge>
              ) : (
                <Badge className="bg-green-500 border-0 text-black" variant="success">Active</Badge>
              )}
            </TableCell>

            <TableCell>
              {new Date(user.createdAt).toLocaleDateString()}
            </TableCell>

            <TableCell className="text-right">
              <CustomerActions user={user} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
