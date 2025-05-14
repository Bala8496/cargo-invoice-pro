
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
import { Customer } from "@/types";
import { Pencil, Trash, Plus } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Customers: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Partial<Customer>>({});
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  const handleOpenDialog = (customer?: Customer) => {
    if (customer) {
      setCurrentCustomer({ ...customer });
    } else {
      setCurrentCustomer({
        name: "",
        address: "",
        contactPerson: "",
        email: "",
        phone: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveCustomer = () => {
    if (!currentCustomer.name || !currentCustomer.address || !currentCustomer.contactPerson) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (currentCustomer.id) {
        updateCustomer(currentCustomer as Customer);
      } else {
        addCustomer(currentCustomer as Omit<Customer, "id">);
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to save customer");
    }
  };

  const handleDeleteClick = (id: string) => {
    setCustomerToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (customerToDelete) {
      try {
        deleteCustomer(customerToDelete);
        setIsDeleteConfirmOpen(false);
        setCustomerToDelete(null);
      } catch (error) {
        toast.error("Failed to delete customer");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Customers</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {customers.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.contactPerson}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(customer)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(customer.id)}
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
          <p className="text-muted-foreground">No customers found.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Add a customer to get started.
          </p>
        </div>
      )}

      {/* Customer Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentCustomer.id ? "Edit Customer" : "Add New Customer"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name*
              </Label>
              <Input
                id="name"
                value={currentCustomer.name || ""}
                onChange={(e) =>
                  setCurrentCustomer({ ...currentCustomer, name: e.target.value })
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
                value={currentCustomer.address || ""}
                onChange={(e) =>
                  setCurrentCustomer({ ...currentCustomer, address: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contactPerson" className="text-right">
                Contact Person*
              </Label>
              <Input
                id="contactPerson"
                value={currentCustomer.contactPerson || ""}
                onChange={(e) =>
                  setCurrentCustomer({
                    ...currentCustomer,
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
                value={currentCustomer.email || ""}
                onChange={(e) =>
                  setCurrentCustomer({ ...currentCustomer, email: e.target.value })
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
                value={currentCustomer.phone || ""}
                onChange={(e) =>
                  setCurrentCustomer({ ...currentCustomer, phone: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveCustomer}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this customer? This action cannot be undone.</p>
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

export default Customers;
