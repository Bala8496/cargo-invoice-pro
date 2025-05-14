
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Invoice } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useData } from "@/contexts/DataContext";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Check, Pencil, Printer, FileText, Circle, CircleDot } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface InvoiceDetailsProps {
  invoice: Invoice;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice }) => {
  const { markInvoiceAsPaid } = useData();
  const navigate = useNavigate();
  const invoiceRef = useRef<HTMLDivElement>(null);

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

  const handlePrint = () => {
    const printContent = invoiceRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;

    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice ${invoice.invoiceNumber}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .print-invoice { max-width: 800px; margin: 0 auto; }
                .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
                .logo { font-size: 24px; font-weight: bold; }
                .invoice-id { font-size: 20px; font-weight: bold; }
                .invoice-info { margin-bottom: 30px; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border-bottom: 1px solid #ddd; text-align: left; padding: 12px; }
                th { background-color: #f5f5f5; }
                .totals { margin-top: 20px; text-align: right; }
                .total-row { display: flex; justify-content: flex-end; margin: 5px 0; }
                .total-label { width: 150px; }
                .total-value { width: 100px; text-align: right; }
                .final-total { font-weight: bold; font-size: 18px; }
                .pickup { color: #1a73e8; }
                .delivery { color: #34a853; }
                .points-table { margin-left: 20px; width: calc(100% - 20px); }
              </style>
            </head>
            <body>
              <div class="print-invoice">
                ${printContent}
              </div>
              <script>
                window.onload = function() {
                  window.print();
                  window.setTimeout(function() {
                    window.close();
                  }, 500);
                };
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const handleDownloadPDF = () => {
    // In a real app, this would generate a PDF
    toast.success("PDF download feature would generate a PDF of this invoice");
  };

  const handleMarkAsPaid = () => {
    markInvoiceAsPaid(invoice.id);
    toast.success(`Invoice ${invoice.invoiceNumber} marked as paid`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invoice {invoice.invoiceNumber}</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate(`/invoices/${invoice.id}/edit`)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" onClick={handleDownloadPDF}>
            <FileText className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          {invoice.status !== "paid" && (
            <Button onClick={handleMarkAsPaid}>
              <Check className="mr-2 h-4 w-4" />
              Mark as Paid
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-6" ref={invoiceRef}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold">{invoice.transportCompany.name}</h2>
              <p className="text-muted-foreground">{invoice.transportCompany.address}</p>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold text-invoice-blue">INVOICE</h1>
              <p className="text-xl font-medium">#{invoice.invoiceNumber}</p>
              <Badge className={getStatusColor(invoice.status)}>
                {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-medium mb-2">Bill To:</h3>
              <div className="space-y-1">
                <p className="font-medium">{invoice.customer.name}</p>
                <p>{invoice.customer.address}</p>
                <p>Attn: {invoice.customer.contactPerson}</p>
                <p>{invoice.customer.email}</p>
                <p>{invoice.customer.phone}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Invoice Date:</span>
                <span>{formatDate(invoice.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Due Date:</span>
                <span>{formatDate(invoice.dueDate)}</span>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-3">Description</th>
                <th className="text-left pb-3">Vehicle</th>
                <th className="text-right pb-3">Rate</th>
                <th className="text-right pb-3">Qty</th>
                <th className="text-right pb-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item) => (
                <React.Fragment key={item.id}>
                  <tr className="border-b">
                    <td className="py-4">
                      <div className="font-medium">{item.description}</div>
                    </td>
                    <td className="py-4">
                      {item.vehicle.registrationNumber} 
                      <span className="text-muted-foreground text-sm block">
                        {item.vehicle.make} {item.vehicle.model}
                      </span>
                    </td>
                    <td className="py-4 text-right">{formatCurrency(item.rate)}</td>
                    <td className="py-4 text-right">{item.quantity}</td>
                    <td className="py-4 text-right">{formatCurrency(item.rate * item.quantity)}</td>
                  </tr>
                  
                  <tr>
                    <td colSpan={5} className="py-2">
                      {item.points.length > 0 && (
                        <div className="bg-gray-50 rounded-md p-4 my-2">
                          <h4 className="font-medium mb-2">Pickup & Delivery Points:</h4>
                          <table className="w-full points-table">
                            <tbody>
                              {item.points.map((point) => (
                                <tr key={point.id}>
                                  <td className="py-2 w-8">
                                    {point.type === 'pickup' ? (
                                      <Circle className="h-4 w-4 text-blue-600" />
                                    ) : (
                                      <CircleDot className="h-4 w-4 text-green-600" />
                                    )}
                                  </td>
                                  <td className="py-2 w-20">
                                    <span className={point.type === 'pickup' ? 'text-blue-600' : 'text-green-600'}>
                                      {point.type === 'pickup' ? 'Pickup:' : 'Delivery:'}
                                    </span>
                                  </td>
                                  <td className="py-2">
                                    <div>{point.address}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {formatDate(point.date)} • {point.contactPerson} • {point.phone}
                                    </div>
                                    {point.notes && (
                                      <div className="text-sm italic mt-1">{point.notes}</div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                      
                      {item.otherCharges.length > 0 && (
                        <div className="pl-6">
                          <h4 className="font-medium text-sm mb-1">Additional Charges:</h4>
                          {item.otherCharges.map((charge) => (
                            <div key={charge.id} className="flex justify-between text-sm py-1">
                              <span>- {charge.description}</span>
                              <span>{formatCurrency(charge.amount)}</span>
                            </div>
                          ))}
                          {item.otherCharges.length > 0 && (
                            <div className="flex justify-between font-medium text-sm pt-1 border-t mt-1">
                              <span>Total Additional Charges:</span>
                              <span>
                                {formatCurrency(
                                  item.otherCharges.reduce((sum, charge) => sum + charge.amount, 0)
                                )}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>

          <Separator className="my-8" />

          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Subtotal:</span>
                <span>{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">Tax (10%):</span>
                <span>{formatCurrency(invoice.tax)}</span>
              </div>
              <Separator className="my-4" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="mt-8 p-4 border rounded-md bg-gray-50">
              <h3 className="font-medium mb-2">Notes</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceDetails;
