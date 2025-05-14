
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useData } from "@/contexts/DataContext";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";

const Invoices: React.FC = () => {
  const { invoices } = useData();
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "sent":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "draft":
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      case "overdue":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invoices</h1>
        <Button onClick={() => navigate("/invoices/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      {invoices.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Transport Company</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    {invoice.invoiceNumber}
                  </TableCell>
                  <TableCell>{invoice.customer.name}</TableCell>
                  <TableCell>{invoice.transportCompany.name}</TableCell>
                  <TableCell>{formatDate(invoice.date)}</TableCell>
                  <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                  <TableCell className="font-medium">
                    ${invoice.total.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusColor(invoice.status)}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/invoices/${invoice.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10 border rounded-md bg-white">
          <p className="text-muted-foreground">No invoices found.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Create an invoice to get started.
          </p>
          <Button onClick={() => navigate("/invoices/new")} className="mt-4">
            Create Your First Invoice
          </Button>
        </div>
      )}
    </div>
  );
};

export default Invoices;
