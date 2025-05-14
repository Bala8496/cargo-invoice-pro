
import React, { createContext, useContext, useState } from "react";
import { mockCustomers, mockVehicles, mockTransportCompanies, mockInvoices, generateInvoiceNumber } from "@/lib/mockData";
import { Customer, Vehicle, TransportCompany, Invoice, InvoiceItem, OtherCharge, PickupDeliveryPoint } from "@/types";
import { toast } from "@/components/ui/sonner";

interface DataContextType {
  customers: Customer[];
  vehicles: Vehicle[];
  transportCompanies: TransportCompany[];
  invoices: Invoice[];
  addCustomer: (customer: Omit<Customer, "id">) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  addVehicle: (vehicle: Omit<Vehicle, "id">) => void;
  updateVehicle: (vehicle: Vehicle) => void;
  deleteVehicle: (id: string) => void;
  addTransportCompany: (company: Omit<TransportCompany, "id">) => void;
  updateTransportCompany: (company: TransportCompany) => void;
  deleteTransportCompany: (id: string) => void;
  createInvoice: (invoice: Omit<Invoice, "id" | "invoiceNumber">) => string;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  markInvoiceAsPaid: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [transportCompanies, setTransportCompanies] = useState<TransportCompany[]>(mockTransportCompanies);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);

  // Customer functions
  const addCustomer = (customer: Omit<Customer, "id">) => {
    const newCustomer = { ...customer, id: `c${Date.now()}` };
    setCustomers([...customers, newCustomer]);
    toast.success("Customer added successfully");
  };

  const updateCustomer = (customer: Customer) => {
    setCustomers(customers.map(c => c.id === customer.id ? customer : c));
    toast.success("Customer updated successfully");
  };

  const deleteCustomer = (id: string) => {
    // Check if customer is used in any invoices
    const isUsed = invoices.some(invoice => invoice.customer.id === id);
    
    if (isUsed) {
      toast.error("Cannot delete customer as they are used in invoices");
      return;
    }
    
    setCustomers(customers.filter(c => c.id !== id));
    toast.success("Customer deleted successfully");
  };

  // Vehicle functions
  const addVehicle = (vehicle: Omit<Vehicle, "id">) => {
    const newVehicle = { ...vehicle, id: `v${Date.now()}` };
    setVehicles([...vehicles, newVehicle]);
    toast.success("Vehicle added successfully");
  };

  const updateVehicle = (vehicle: Vehicle) => {
    setVehicles(vehicles.map(v => v.id === vehicle.id ? vehicle : v));
    toast.success("Vehicle updated successfully");
  };

  const deleteVehicle = (id: string) => {
    // Check if vehicle is used in any invoices
    const isUsed = invoices.some(invoice => 
      invoice.items.some(item => item.vehicle.id === id)
    );
    
    if (isUsed) {
      toast.error("Cannot delete vehicle as it is used in invoices");
      return;
    }
    
    setVehicles(vehicles.filter(v => v.id !== id));
    toast.success("Vehicle deleted successfully");
  };

  // Transport Company functions
  const addTransportCompany = (company: Omit<TransportCompany, "id">) => {
    const newCompany = { ...company, id: `tc${Date.now()}` };
    setTransportCompanies([...transportCompanies, newCompany]);
    toast.success("Transport company added successfully");
  };

  const updateTransportCompany = (company: TransportCompany) => {
    setTransportCompanies(transportCompanies.map(tc => tc.id === company.id ? company : tc));
    toast.success("Transport company updated successfully");
  };

  const deleteTransportCompany = (id: string) => {
    // Check if transport company is used in any invoices
    const isUsed = invoices.some(invoice => invoice.transportCompany.id === id);
    
    if (isUsed) {
      toast.error("Cannot delete transport company as it is used in invoices");
      return;
    }
    
    setTransportCompanies(transportCompanies.filter(tc => tc.id !== id));
    toast.success("Transport company deleted successfully");
  };

  // Invoice functions
  const createInvoice = (invoiceData: Omit<Invoice, "id" | "invoiceNumber">) => {
    const invoiceNumber = generateInvoiceNumber();
    const id = `inv${Date.now()}`;
    const newInvoice = { ...invoiceData, id, invoiceNumber };
    setInvoices([...invoices, newInvoice]);
    toast.success("Invoice created successfully");
    return id;
  };

  const updateInvoice = (invoice: Invoice) => {
    setInvoices(invoices.map(inv => inv.id === invoice.id ? invoice : inv));
    toast.success("Invoice updated successfully");
  };

  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter(inv => inv.id !== id));
    toast.success("Invoice deleted successfully");
  };

  const markInvoiceAsPaid = (id: string) => {
    setInvoices(
      invoices.map(inv => 
        inv.id === id 
          ? { ...inv, status: 'paid' as const } 
          : inv
      )
    );
    toast.success("Invoice marked as paid");
  };

  return (
    <DataContext.Provider value={{
      customers,
      vehicles,
      transportCompanies,
      invoices,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addVehicle,
      updateVehicle,
      deleteVehicle,
      addTransportCompany,
      updateTransportCompany,
      deleteTransportCompany,
      createInvoice,
      updateInvoice,
      deleteInvoice,
      markInvoiceAsPaid,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
