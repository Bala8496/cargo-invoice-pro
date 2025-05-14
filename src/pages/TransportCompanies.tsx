
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useData } from "@/contexts/DataContext";
import { TransportCompany } from "@/types";
import { Pencil, Trash, Plus } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const TransportCompanies: React.FC = () => {
  const { transportCompanies, addTransportCompany, updateTransportCompany, deleteTransportCompany } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentCompany, setCurrentCompany] = useState<Partial<TransportCompany>>({});
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null);

  const handleOpenDialog = (company?: TransportCompany) => {
    if (company) {
      setCurrentCompany({ ...company });
    } else {
      setCurrentCompany({
        name: "",
        address: "",
        contactPerson: "",
        email: "",
        phone: "",
        logo: "",
        signature: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveCompany = () => {
    if (!currentCompany.name || !currentCompany.address) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (currentCompany.id) {
        updateTransportCompany(currentCompany as TransportCompany);
      } else {
        addTransportCompany(currentCompany as Omit<TransportCompany, "id">);
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to save transport company");
    }
  };

  const handleDeleteClick = (id: string) => {
    setCompanyToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (companyToDelete) {
      try {
        deleteTransportCompany(companyToDelete);
        setIsDeleteConfirmOpen(false);
        setCompanyToDelete(null);
      } catch (error) {
        toast.error("Failed to delete transport company");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transport Companies</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Company
        </Button>
      </div>

      {transportCompanies.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Logo/Signature</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transportCompanies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.contactPerson}</TableCell>
                  <TableCell>{company.email}</TableCell>
                  <TableCell>{company.phone}</TableCell>
                  <TableCell>
                    {(company.logo || company.signature) ? (
                      <span className="text-green-600 text-sm">Added</span>
                    ) : (
                      <span className="text-gray-400 text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(company)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(company.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-10 border rounded-md bg-white">
          <p className="text-muted-foreground">No transport companies found.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Add a transport company to get started.
          </p>
        </div>
      )}

      {/* Company Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentCompany.id ? "Edit Transport Company" : "Add New Transport Company"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name*
              </Label>
              <Input
                id="name"
                value={currentCompany.name || ""}
                onChange={(e) =>
                  setCurrentCompany({ ...currentCompany, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Address*
              </Label>
              <Input
                id="address"
                value={currentCompany.address || ""}
                onChange={(e) =>
                  setCurrentCompany({ ...currentCompany, address: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactPerson" className="text-right">
                Contact Person
              </Label>
              <Input
                id="contactPerson"
                value={currentCompany.contactPerson || ""}
                onChange={(e) =>
                  setCurrentCompany({
                    ...currentCompany,
                    contactPerson: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={currentCompany.email || ""}
                onChange={(e) =>
                  setCurrentCompany({ ...currentCompany, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={currentCompany.phone || ""}
                onChange={(e) =>
                  setCurrentCompany({ ...currentCompany, phone: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="logo" className="text-right">
                Logo URL
              </Label>
              <Input
                id="logo"
                value={currentCompany.logo || ""}
                onChange={(e) =>
                  setCurrentCompany({ ...currentCompany, logo: e.target.value })
                }
                className="col-span-3"
                placeholder="https://example.com/logo.png"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="signature" className="text-right">
                Signature URL
              </Label>
              <Input
                id="signature"
                value={currentCompany.signature || ""}
                onChange={(e) =>
                  setCurrentCompany({ ...currentCompany, signature: e.target.value })
                }
                className="col-span-3"
                placeholder="https://example.com/signature.png"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCompany}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this transport company? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TransportCompanies;
