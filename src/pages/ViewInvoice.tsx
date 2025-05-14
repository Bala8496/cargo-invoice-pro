
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { Invoice } from "@/types";
import InvoiceDetails from "@/components/invoice/InvoiceDetails";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ViewInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { invoices } = useData();
  const [invoice, setInvoice] = useState<Invoice | undefined>(undefined);
  const navigate = useNavigate();
  const [isPrintMode, setIsPrintMode] = useState(false);

  useEffect(() => {
    if (id) {
      const foundInvoice = invoices.find((inv) => inv.id === id);
      if (foundInvoice) {
        setInvoice(foundInvoice);
      } else {
        navigate("/invoices", { replace: true });
      }
    }
  }, [id, invoices, navigate]);

  // Check if the URL has a print parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const printParam = urlParams.get('print');
    if (printParam === 'true') {
      setIsPrintMode(true);
      // Automatically trigger print dialog after a short delay
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, []);

  if (!invoice) {
    return <div>Loading...</div>;
  }

  if (isPrintMode) {
    return (
      <div className="print-mode">
        <InvoiceDetails invoice={invoice} printMode={true} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/invoices')} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Invoices
        </Button>
      </div>
      <InvoiceDetails invoice={invoice} />
    </div>
  );
};

export default ViewInvoice;
