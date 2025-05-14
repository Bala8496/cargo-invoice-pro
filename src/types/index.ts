export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  capacity: string;
  type: string;
}

export interface TransportCompany {
  id: string;
  name: string;
  address: string;
  contactPerson: string;
  email: string;
  phone: string;
  logo?: string; // URL for logo
  signature?: string; // URL for signature
}

export interface PickupDeliveryPoint {
  id: string;
  type: 'pickup' | 'delivery';
  address: string;
  date: string; // ISO string
  contactPerson: string;
  phone: string;
  notes?: string;
}

export interface OtherCharge {
  id: string;
  description: string;
  amount: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  vehicle: Vehicle;
  points: PickupDeliveryPoint[];
  amount: number; // Changed from rate/quantity to a single amount
  otherCharges: OtherCharge[];
  subtotal: number; // Calculated: amount + sum(otherCharges)
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string; // ISO string
  dueDate: string; // ISO string
  customer: Customer;
  transportCompany: TransportCompany;
  items: InvoiceItem[];
  subtotal: number; // Sum of all items and charges
  tax: number;
  total: number; // subtotal + tax
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
}
