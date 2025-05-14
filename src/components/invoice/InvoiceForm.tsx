import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useData } from "@/contexts/DataContext";
import { generateId } from "@/lib/utils";
import {
  InvoiceItem,
  Customer,
  TransportCompany,
  Vehicle,
  PickupDeliveryPoint,
  OtherCharge,
  Invoice,
} from "@/types";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash, MapPin, DollarSign, Circle, CircleDot } from "lucide-react";
import { format } from "date-fns";

interface InvoiceFormProps {
  editingInvoice?: Invoice;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ editingInvoice }) => {
  const { 
    customers, 
    vehicles, 
    transportCompanies, 
    createInvoice, 
    updateInvoice 
  } = useData();
  const navigate = useNavigate();
  
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [selectedTransportCompanyId, setSelectedTransportCompanyId] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>(new Date(new Date().setDate(new Date().getDate() + 30)));
  const [notes, setNotes] = useState<string>("");
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [totals, setTotals] = useState({ subtotal: 0, tax: 0, total: 0 });

  // Initialize form if editing
  useEffect(() => {
    if (editingInvoice) {
      setSelectedCustomerId(editingInvoice.customer.id);
      setSelectedTransportCompanyId(editingInvoice.transportCompany.id);
      setInvoiceDate(new Date(editingInvoice.date));
      setDueDate(new Date(editingInvoice.dueDate));
      setNotes(editingInvoice.notes || "");
      setItems(editingInvoice.items);
      setTotals({
        subtotal: editingInvoice.subtotal,
        tax: editingInvoice.tax,
        total: editingInvoice.total,
      });
    }
  }, [editingInvoice]);

  // Calculate item subtotal (amount + other charges)
  const calculateItemSubtotal = (amount: number, otherCharges: OtherCharge[]): number => {
    const otherChargesTotal = otherCharges.reduce((sum, charge) => sum + charge.amount, 0);
    return amount + otherChargesTotal;
  };

  // Calculate invoice totals
  const calculateInvoiceTotals = (items: InvoiceItem[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  // Recalculate totals when items change
  useEffect(() => {
    setTotals(calculateInvoiceTotals(items));
  }, [items]);

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: generateId(),
      description: "",
      vehicle: {} as Vehicle,
      points: [],
      amount: 0,
      otherCharges: [],
      subtotal: 0,
    };
    setItems([...items, newItem]);
  };

  const updateItem = (index: number, updatedItem: Partial<InvoiceItem>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...updatedItem };
    
    // Recalculate subtotal
    newItems[index].subtotal = calculateItemSubtotal(
      newItems[index].amount,
      newItems[index].otherCharges
    );
    
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const addPoint = (itemIndex: number, type: 'pickup' | 'delivery') => {
    const newItems = [...items];
    const newPoint: PickupDeliveryPoint = {
      id: generateId(),
      type,
      address: "",
      date: new Date().toISOString(),
      contactPerson: "",
      phone: "",
      notes: "",
    };
    newItems[itemIndex].points.push(newPoint);
    setItems(newItems);
  };

  const updatePoint = (itemIndex: number, pointIndex: number, updatedPoint: Partial<PickupDeliveryPoint>) => {
    const newItems = [...items];
    newItems[itemIndex].points[pointIndex] = {
      ...newItems[itemIndex].points[pointIndex],
      ...updatedPoint,
    };
    setItems(newItems);
  };

  const removePoint = (itemIndex: number, pointIndex: number) => {
    const newItems = [...items];
    newItems[itemIndex].points.splice(pointIndex, 1);
    setItems(newItems);
  };

  const addCharge = (itemIndex: number) => {
    const newItems = [...items];
    const newCharge: OtherCharge = {
      id: generateId(),
      description: "",
      amount: 0,
    };
    newItems[itemIndex].otherCharges.push(newCharge);
    setItems(newItems);
  };

  const updateCharge = (itemIndex: number, chargeIndex: number, updatedCharge: Partial<OtherCharge>) => {
    const newItems = [...items];
    newItems[itemIndex].otherCharges[chargeIndex] = {
      ...newItems[itemIndex].otherCharges[chargeIndex],
      ...updatedCharge,
    };
    
    // Recalculate item subtotal
    newItems[itemIndex].subtotal = calculateItemSubtotal(
      newItems[itemIndex].amount,
      newItems[itemIndex].otherCharges
    );
    
    setItems(newItems);
  };

  const removeCharge = (itemIndex: number, chargeIndex: number) => {
    const newItems = [...items];
    newItems[itemIndex].otherCharges.splice(chargeIndex, 1);
    
    // Recalculate item subtotal
    newItems[itemIndex].subtotal = calculateItemSubtotal(
      newItems[itemIndex].amount,
      newItems[itemIndex].otherCharges
    );
    
    setItems(newItems);
  };

  const handleSaveInvoice = () => {
    if (!selectedCustomerId) {
      alert("Please select a customer");
      return;
    }

    if (!selectedTransportCompanyId) {
      alert("Please select a transport company");
      return;
    }

    if (items.length === 0) {
      alert("Please add at least one invoice item");
      return;
    }

    const selectedCustomer = customers.find(c => c.id === selectedCustomerId) as Customer;
    const selectedTransportCompany = transportCompanies.find(tc => tc.id === selectedTransportCompanyId) as TransportCompany;

    const invoiceData = {
      customer: selectedCustomer,
      transportCompany: selectedTransportCompany,
      date: invoiceDate.toISOString(),
      dueDate: dueDate.toISOString(),
      items,
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      status: 'draft' as const,
      notes,
    };

    if (editingInvoice) {
      updateInvoice({
        ...invoiceData,
        id: editingInvoice.id,
        invoiceNumber: editingInvoice.invoiceNumber,
        status: editingInvoice.status,
      });
      navigate(`/invoices/${editingInvoice.id}`);
    } else {
      const newInvoiceId = createInvoice(invoiceData);
      navigate(`/invoices/${newInvoiceId}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{editingInvoice ? "Edit Invoice" : "Create New Invoice"}</h1>
        <Button onClick={handleSaveInvoice}>Save Invoice</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Customer and Transport Company Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="transportCompany">Transport Company</Label>
                <Select value={selectedTransportCompanyId} onValueChange={setSelectedTransportCompanyId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a transport company" />
                  </SelectTrigger>
                  <SelectContent>
                    {transportCompanies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Invoice Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(invoiceDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={invoiceDate}
                      onSelect={(date) => date && setInvoiceDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(dueDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={(date) => date && setDueDate(date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes or instructions for this invoice"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (10%):</span>
              <span>${totals.tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button
              onClick={addItem}
              className="w-full"
              variant="outline"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Invoice Item
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Invoice Items */}
      {items.map((item, index) => (
        <Card key={item.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transport Job {index + 1}</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeItem(index)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor={`description-${index}`}>Description</Label>
                <Input
                  id={`description-${index}`}
                  placeholder="Job description"
                  value={item.description}
                  onChange={(e) => updateItem(index, { description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`vehicle-${index}`}>Vehicle</Label>
                <Select
                  value={item.vehicle?.id || ""}
                  onValueChange={(value) => {
                    const selectedVehicle = vehicles.find((v) => v.id === value);
                    if (selectedVehicle) {
                      updateItem(index, { vehicle: selectedVehicle });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.registrationNumber} ({vehicle.make} {vehicle.model})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor={`amount-${index}`}>Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    $
                  </span>
                  <Input
                    id={`amount-${index}`}
                    type="number"
                    step="0.01"
                    className="pl-7"
                    value={item.amount}
                    onChange={(e) => updateItem(index, { amount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Subtotal</Label>
                <Input
                  value={`$${item.subtotal.toFixed(2)}`}
                  readOnly
                  disabled
                />
              </div>
            </div>

            <Separator />

            {/* Pickup/Delivery Points */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Pickup & Delivery Points</h3>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addPoint(index, 'pickup')}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add Pickup
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addPoint(index, 'delivery')}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add Delivery
                  </Button>
                </div>
              </div>

              {item.points.length === 0 ? (
                <div className="text-center py-4 border rounded-md">
                  <p className="text-muted-foreground">No points added yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {item.points.map((point, pointIndex) => (
                    <Card key={point.id} className="overflow-hidden">
                      <div className={`p-3 flex justify-between items-center ${
                        point.type === 'pickup' ? 'bg-blue-50' : 'bg-green-50'
                      }`}>
                        <div className="flex items-center">
                          {point.type === 'pickup' ? (
                            <Circle className="h-4 w-4 mr-2 text-blue-600" />
                          ) : (
                            <CircleDot className="h-4 w-4 mr-2 text-green-600" />
                          )}
                          <span className="font-medium">
                            {point.type === 'pickup' ? 'Pickup' : 'Delivery'} Point
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePoint(index, pointIndex)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                        <div className="space-y-2">
                          <Label>Address</Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Address"
                              className="pl-9"
                              value={point.address}
                              onChange={(e) => updatePoint(index, pointIndex, { address: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {format(new Date(point.date), "PPP")}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={new Date(point.date)}
                                onSelect={(date) => date && updatePoint(index, pointIndex, { date: date.toISOString() })}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label>Contact Person</Label>
                          <Input
                            placeholder="Contact person name"
                            value={point.contactPerson}
                            onChange={(e) => updatePoint(index, pointIndex, { contactPerson: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input
                            placeholder="Contact phone number"
                            value={point.phone}
                            onChange={(e) => updatePoint(index, pointIndex, { phone: e.target.value })}
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label>Notes</Label>
                          <Textarea
                            placeholder="Additional notes about this point"
                            value={point.notes || ""}
                            onChange={(e) => updatePoint(index, pointIndex, { notes: e.target.value })}
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Other Charges */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Other Charges</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addCharge(index)}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add Charge
                </Button>
              </div>

              {item.otherCharges.length === 0 ? (
                <div className="text-center py-4 border rounded-md">
                  <p className="text-muted-foreground">No additional charges added.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {item.otherCharges.map((charge, chargeIndex) => (
                    <div key={charge.id} className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Input
                          placeholder="Charge description"
                          value={charge.description}
                          onChange={(e) => updateCharge(index, chargeIndex, { description: e.target.value })}
                        />
                      </div>
                      <div className="w-32">
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="Amount"
                            className="pl-9"
                            value={charge.amount}
                            onChange={(e) => updateCharge(index, chargeIndex, { amount: parseFloat(e.target.value) || 0 })}
                          />
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCharge(index, chargeIndex)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      {items.length === 0 && (
        <div className="text-center p-10 border rounded-md">
          <h3 className="font-medium text-lg">No Invoice Items Yet</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            Add items to start building your invoice.
          </p>
          <Button onClick={addItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add First Item
          </Button>
        </div>
      )}

      {items.length > 0 && (
        <div className="flex justify-end">
          <Button onClick={handleSaveInvoice} size="lg">
            Save Invoice
          </Button>
        </div>
      )}
    </div>
  );
};

export default InvoiceForm;
