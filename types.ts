
export enum Page {
  Dashboard = 'Dashboard',
  Customers = 'Customers',
  Products = 'Products & Services',
  Billing = 'New Bill',
  Invoices = 'All Invoices',
  Stock = 'Stock & Inventory',
  Reports = 'Reports',
  Settings = 'Settings',
}

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}

export enum CustomerType {
  Regular = 'Regular',
  New = 'New',
  Corporate = 'Corporate',
}

export enum ProductCategory {
  Product = 'Product',
  Service = 'Service',
  Construction = 'Construction',
}

export enum ProductUnit {
  Pcs = 'pcs',
  Box = 'box',
  Kg = 'kg',
  Ltr = 'ltr',
  Mtr = 'mtr',
  Set = 'set',
}

export enum PaymentMethod {
    Cash = 'Cash',
    UPI = 'UPI',
    Card = 'Card',
    NetBanking = 'Net Banking',
    Credit = 'Credit',
}

export enum BillStatus {
    Paid = 'Paid',
    Unpaid = 'Unpaid',
    Pending = 'Pending',
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  gstNo?: string;
  customerType: CustomerType;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  purchasePrice: number;
  sellingPrice: number;
  stockQuantity: number;
  tax: number; // as percentage
  unit: ProductUnit;
}

export interface InvoiceItem {
  productId: string;
  quantity: number;
  discount: number; // as percentage
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: Date;
  customerId: string;
  items: InvoiceItem[];
  paymentMethod: PaymentMethod;
  status: BillStatus;
  amountPaid: number;
}

export interface BusinessDetails {
    logo: string;
    name: string;
    address: string;
    gst: string;
    contact: string;
}

export interface Settings {
    theme: Theme;
    businessDetails: BusinessDetails;
    defaultTax: number;
    defaultDiscount: number;
    currency: string;
}
