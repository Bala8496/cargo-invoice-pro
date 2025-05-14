
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
import { useToast } from "@/hooks/use-toast";

interface InvoiceDetailsProps {
  invoice: Invoice;
  printMode?: boolean;
}

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ invoice, printMode = false }) => {
  const { markInvoiceAsPaid } = useData();
  const navigate = useNavigate();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
    // Open a new window with print mode URL
    window.open(`/invoices/${invoice.id}?print=true`, '_blank');
  };

  const handleDownloadPDF = () => {
    // In a real app, this would generate a PDF download
    // For now, we'll just simulate it by opening the print view
    window.open(`/invoices/${invoice.id}?print=true`, '_blank');
    toast({
      title: "PDF Download",
      description: "Your invoice PDF is being prepared for download",
    });
  };

  const handleMarkAsPaid = () => {
    markInvoiceAsPaid(invoice.id);
    toast({
      title: "Invoice Updated",
      description: `Invoice ${invoice.invoiceNumber} marked as paid`,
    });
  };

  const renderInvoiceContent = () => (
    <div ref={invoiceRef} className={`${printMode ? 'p-8 max-w-4xl mx-auto' : ''}`}>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          {invoice.transportCompany.logo ? (
            <img 
              src={invoice.transportCompany.logo} 
              alt="Company Logo" 
              className="h-16 mr-4 object-contain"
            />
          ) : (
            <div className="h-16 w-32 bg-gray-100 flex items-center justify-center text-gray-400 mr-4 border rounded">
              Company Logo
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold">{invoice.transportCompany.name}</h2>
            <p className="text-muted-foreground">{invoice.transportCompany.address}</p>
          </div>
        </div>
        <div className="text-right">
          <h1 className="text-3xl font-bold text-blue-600">INVOICE</h1>
          <p className="text-xl font-medium">#{invoice.invoiceNumber}</p>
          {!printMode && (
            <Badge className={getStatusColor(invoice.status)}>
              {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
            </Badge>
          )}
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
          <div className="flex justify-between">
            <span className="font-medium">Invoice #:</span>
            <span>{invoice.invoiceNumber}</span>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left pb-3">Description</th>
            <th className="text-left pb-3">Vehicle</th>
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
                <td className="py-4 text-right">{formatCurrency(item.amount)}</td>
              </tr>
              
              <tr>
                <td colSpan={3} className="py-2">
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

      <div className="flex justify-between items-end">
        {/* Bank Details - only show in print mode or if explicitly set */}
        {(printMode) && (
          <div className="w-1/2 pr-4 text-sm">
            <h3 className="font-medium mb-2">Bank Details</h3>
            <p>Bank: EXAMPLE BANK LTD</p>
            <p>Account Name: {invoice.transportCompany.name}</p>
            <p>Account Number: 123456789</p>
            <p>Sort Code: 01-02-03</p>
            <p>IBAN: GB29NWBK01234567890</p>
            <p>Reference: INV-{invoice.invoiceNumber}</p>
          </div>
        )}
        
        <div className="w-64 ml-auto">
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

      {/* Signature Area - only show in print mode or if signature exists */}
      {(printMode || invoice.transportCompany.signature) && (
        <div className="mt-12 border-t pt-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Thank you for your business!</p>
              <p className="text-xs text-gray-500">
                Please contact us if you have any questions about this invoice.
              </p>
            </div>
            <div className="text-center">
              {invoice.transportCompany.signature ? (
                <img 
                  src={invoice.transportCompany.signature} 
                  alt="Authorized Signature" 
                  className="h-16 object-contain mb-1"
                />
              ) : printMode ? (
                <div className="h-16 border-b border-dotted w-48"></div>
              ) : null}
              <p className="text-sm font-medium">Authorized Signature</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (printMode) {
    return renderInvoiceContent();
  }

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
        <CardContent className="p-6">
          {renderInvoiceContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceDetails;
