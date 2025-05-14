
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Generate a unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Calculate invoice item subtotal
export function calculateItemSubtotal(rate: number, quantity: number, otherCharges: { amount: number }[]): number {
  const baseAmount = rate * quantity;
  const otherChargesTotal = otherCharges.reduce((total, charge) => total + charge.amount, 0);
  return baseAmount + otherChargesTotal;
}

// Calculate invoice totals
export function calculateInvoiceTotals(items: { subtotal: number }[]): { subtotal: number, tax: number, total: number } {
  const subtotal = items.reduce((total, item) => total + item.subtotal, 0);
  const tax = subtotal * 0.1; // 10% tax rate as an example
  const total = subtotal + tax;
  
  return {
    subtotal,
    tax,
    total
  };
}
