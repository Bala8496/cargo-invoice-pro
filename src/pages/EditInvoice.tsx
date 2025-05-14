
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import { Invoice } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const EditInvoice: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { invoices } = useData();
  const [invoice, setInvoice] = useState<Invoice | undefined>(undefined);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [logoUrl, setLogoUrl] = useState<string>("");
  const [signatureUrl, setSignatureUrl] = useState<string>("");

  useEffect(() => {
    if (id) {
      const foundInvoice = invoices.find((inv) => inv.id === id);
      if (foundInvoice) {
        setInvoice(foundInvoice);
        setLogoUrl(foundInvoice.transportCompany.logo || "");
        setSignatureUrl(foundInvoice.transportCompany.signature || "");
      } else {
        navigate("/invoices", { replace: true });
      }
    }
  }, [id, invoices, navigate]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a server/storage
      const objectUrl = URL.createObjectURL(file);
      setLogoUrl(objectUrl);
      toast({
        title: "Logo uploaded",
        description: "Your logo has been uploaded successfully"
      });
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a server/storage
      const objectUrl = URL.createObjectURL(file);
      setSignatureUrl(objectUrl);
      toast({
        title: "Signature uploaded",
        description: "Your signature has been uploaded successfully"
      });
    }
  };

  if (!invoice) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Edit Invoice #{invoice.invoiceNumber}</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Upload Logo</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Company Logo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {logoUrl && (
                  <div className="mb-4 flex justify-center">
                    <img src={logoUrl} alt="Company Logo" className="max-h-40 object-contain" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="logo">Select Logo Image</Label>
                  <Input id="logo" type="file" accept="image/*" onChange={handleLogoUpload} />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Upload Signature</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Signature</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {signatureUrl && (
                  <div className="mb-4 flex justify-center">
                    <img src={signatureUrl} alt="Signature" className="max-h-40 object-contain" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="signature">Select Signature Image</Label>
                  <Input id="signature" type="file" accept="image/*" onChange={handleSignatureUpload} />
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <InvoiceForm editingInvoice={invoice} initialLogo={logoUrl} initialSignature={signatureUrl} />
    </div>
  );
};

export default EditInvoice;
