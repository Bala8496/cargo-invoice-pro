
import { Customer, Vehicle, TransportCompany, Invoice } from "@/types";

// Mock Customers
export const mockCustomers: Customer[] = [
  {
    id: "c1",
    name: "Acme Logistics",
    address: "123 Main St, New York, NY 10001",
    contactPerson: "John Smith",
    email: "john@acmelogistics.com",
    phone: "212-555-1234",
  },
  {
    id: "c2",
    name: "Global Freight Inc",
    address: "456 Business Ave, Los Angeles, CA 90001",
    contactPerson: "Jane Doe",
    email: "jane@globalfreight.com",
    phone: "323-555-6789",
  },
  {
    id: "c3",
    name: "Express Shipping Co",
    address: "789 Transit Rd, Chicago, IL 60007",
    contactPerson: "Mike Johnson",
    email: "mike@expressship.com",
    phone: "312-555-9012",
  },
];

// Mock Vehicles
export const mockVehicles: Vehicle[] = [
  {
    id: "v1",
    registrationNumber: "XYZ-1234",
    make: "Volvo",
    model: "FH16",
    year: 2022,
    capacity: "40 tons",
    type: "Semi-trailer",
  },
  {
    id: "v2",
    registrationNumber: "ABC-5678",
    make: "Mercedes-Benz",
    model: "Actros",
    year: 2021,
    capacity: "25 tons",
    type: "Box truck",
  },
  {
    id: "v3",
    registrationNumber: "DEF-9012",
    make: "Scania",
    model: "R Series",
    year: 2023,
    capacity: "35 tons",
    type: "Refrigerated",
  },
];

// Mock Transport Companies
export const mockTransportCompanies: TransportCompany[] = [
  {
    id: "tc1",
    name: "FastTrack Transport",
    address: "101 Delivery Lane, Dallas, TX 75001",
    contactPerson: "Robert Brown",
    email: "robert@fasttrack.com",
    phone: "469-555-3456",
    logo: "https://placehold.co/200x100?text=FastTrack",
    signature: "https://placehold.co/200x60?text=R.Brown",
  },
  {
    id: "tc2",
    name: "Reliable Shipping",
    address: "202 Carrier Blvd, Miami, FL 33101",
    contactPerson: "Sarah Wilson",
    email: "sarah@reliableshipping.com",
    phone: "305-555-7890",
    logo: "https://placehold.co/200x100?text=Reliable",
    signature: "https://placehold.co/200x60?text=S.Wilson",
  },
];

// Mock Invoices (empty array to start)
export const mockInvoices: Invoice[] = [];

// Function to generate invoice number
export const generateInvoiceNumber = (): string => {
  const prefix = "INV";
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `${prefix}-${date}-${random}`;
};
