
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { Invoice } from "@/types";
import InvoiceDetails from "@/components/invoice/InvoiceDetails";

const ViewInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { invoices } = useData();
  const [invoice, setInvoice] = useState<Invoice | undefined>(undefined);
  const navigate = useNavigate();

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

  if (!invoice) {
    return <div>Loading...</div>;
  }

  return <InvoiceDetails invoice={invoice} />;
};

export default ViewInvoice;
