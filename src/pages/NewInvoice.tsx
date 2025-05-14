
import React, { useState } from "react";
import InvoiceForm from "@/components/invoice/InvoiceForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const NewInvoice: React.FC = () => {
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [signatureUrl, setSignatureUrl] = useState<string>("");
  const { toast } = useToast();

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a server/storage
      // For now, we'll create a local object URL
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">New Invoice</h1>
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
      <InvoiceForm initialLogo={logoUrl} initialSignature={signatureUrl} />
    </div>
  );
};

export default NewInvoice;
