
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
import { Vehicle } from "@/types";
import { Pencil, Trash, Plus } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const Vehicles: React.FC = () => {
  const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentVehicle, setCurrentVehicle] = useState<Partial<Vehicle>>({});
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  const handleOpenDialog = (vehicle?: Vehicle) => {
    if (vehicle) {
      setCurrentVehicle({ ...vehicle });
    } else {
      setCurrentVehicle({
        registrationNumber: "",
        make: "",
        model: "",
        year: new Date().getFullYear(),
        capacity: "",
        type: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveVehicle = () => {
    if (
      !currentVehicle.registrationNumber ||
      !currentVehicle.make ||
      !currentVehicle.model ||
      !currentVehicle.year
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      if (currentVehicle.id) {
        updateVehicle(currentVehicle as Vehicle);
      } else {
        addVehicle(currentVehicle as Omit<Vehicle, "id">);
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to save vehicle");
    }
  };

  const handleDeleteClick = (id: string) => {
    setVehicleToDelete(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (vehicleToDelete) {
      try {
        deleteVehicle(vehicleToDelete);
        setIsDeleteConfirmOpen(false);
        setVehicleToDelete(null);
      } catch (error) {
        toast.error("Failed to delete vehicle");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Vehicles</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Vehicle
        </Button>
      </div>

      {vehicles.length > 0 ? (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Registration</TableHead>
                <TableHead>Make/Model</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.registrationNumber}</TableCell>
                  <TableCell>{vehicle.make} {vehicle.model}</TableCell>
                  <TableCell>{vehicle.year}</TableCell>
                  <TableCell>{vehicle.type}</TableCell>
                  <TableCell>{vehicle.capacity}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(vehicle)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteClick(vehicle.id)}
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
          <p className="text-muted-foreground">No vehicles found.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Add a vehicle to get started.
          </p>
        </div>
      )}

      {/* Vehicle Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentVehicle.id ? "Edit Vehicle" : "Add New Vehicle"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="registrationNumber" className="text-right">
                Registration*
              </Label>
              <Input
                id="registrationNumber"
                value={currentVehicle.registrationNumber || ""}
                onChange={(e) =>
                  setCurrentVehicle({ ...currentVehicle, registrationNumber: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="make" className="text-right">
                Make*
              </Label>
              <Input
                id="make"
                value={currentVehicle.make || ""}
                onChange={(e) =>
                  setCurrentVehicle({ ...currentVehicle, make: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model" className="text-right">
                Model*
              </Label>
              <Input
                id="model"
                value={currentVehicle.model || ""}
                onChange={(e) =>
                  setCurrentVehicle({
                    ...currentVehicle,
                    model: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="year" className="text-right">
                Year*
              </Label>
              <Input
                id="year"
                type="number"
                value={currentVehicle.year || new Date().getFullYear()}
                onChange={(e) =>
                  setCurrentVehicle({ ...currentVehicle, year: parseInt(e.target.value) })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Input
                id="type"
                value={currentVehicle.type || ""}
                onChange={(e) =>
                  setCurrentVehicle({ ...currentVehicle, type: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Capacity
              </Label>
              <Input
                id="capacity"
                value={currentVehicle.capacity || ""}
                onChange={(e) =>
                  setCurrentVehicle({ ...currentVehicle, capacity: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveVehicle}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this vehicle? This action cannot be undone.</p>
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

export default Vehicles;
