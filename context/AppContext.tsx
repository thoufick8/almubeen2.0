
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Customer, Product, Invoice, Settings, Theme, CustomerType, ProductCategory, ProductUnit, PaymentMethod, BillStatus } from '../types';

interface AppContextType {
  customers: Customer[];
  products: Product[];
  invoices: Invoice[];
  settings: Settings;
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (customerId: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'date'>) => void;
  updateInvoiceStatus: (invoiceId: string, status: BillStatus, amountPaid: number) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const generateMockData = () => {
    const customers: Customer[] = [
        { id: 'cust1', name: 'John Doe', mobile: '123-456-7890', email: 'john.d@example.com', address: '123 Main St, Anytown', customerType: CustomerType.Regular, gstNo: '22AAAAA0000A1Z5' },
        { id: 'cust2', name: 'Jane Smith', mobile: '987-654-3210', email: 'jane.s@example.com', address: '456 Oak Ave, Somewhere', customerType: CustomerType.New, gstNo: '29BBBBB1111B2Z6' },
        { id: 'cust3', name: 'Corporate Builders', mobile: '555-555-5555', email: 'contact@corp.com', address: '789 Business Blvd, Metropolis', customerType: CustomerType.Corporate, gstNo: '27CCCCC2222C3Z7' },
    ];

    const products: Product[] = [
        { id: 'prod1', name: 'Cement Bag', category: ProductCategory.Construction, purchasePrice: 350, sellingPrice: 400, stockQuantity: 150, tax: 18, unit: ProductUnit.Pcs },
        { id: 'prod2', name: 'TMT Steel Bar (12mm)', category: ProductCategory.Construction, purchasePrice: 50, sellingPrice: 65, stockQuantity: 500, tax: 18, unit: ProductUnit.Kg },
        { id: 'prod3', name: 'Paint (1 Ltr)', category: ProductCategory.Product, purchasePrice: 200, sellingPrice: 250, stockQuantity: 80, tax: 12, unit: ProductUnit.Ltr },
        { id: 'prod4', name: 'Electrical Wiring', category: ProductCategory.Product, purchasePrice: 800, sellingPrice: 1000, stockQuantity: 40, tax: 12, unit: ProductUnit.Mtr },
        { id: 'prod5', name: 'Plumbing Service', category: ProductCategory.Service, purchasePrice: 0, sellingPrice: 500, stockQuantity: 1000, tax: 18, unit: ProductUnit.Set },
        { id: 'prod6', name: 'Architectural Design', category: ProductCategory.Service, purchasePrice: 0, sellingPrice: 15000, stockQuantity: 100, tax: 18, unit: ProductUnit.Set },
        { id: 'prod7', name: 'Bricks', category: ProductCategory.Construction, purchasePrice: 8, sellingPrice: 10, stockQuantity: 10000, tax: 5, unit: ProductUnit.Pcs },
    ];

    const invoices: Invoice[] = [
        { id: 'inv1', invoiceNumber: 'INV-2024-001', date: new Date('2024-07-20'), customerId: 'cust1', items: [{ productId: 'prod1', quantity: 10, discount: 5 }, { productId: 'prod2', quantity: 50, discount: 0 }], paymentMethod: PaymentMethod.Card, status: BillStatus.Paid, amountPaid: 6982.50 },
        { id: 'inv2', invoiceNumber: 'INV-2024-002', date: new Date('2024-07-21'), customerId: 'cust2', items: [{ productId: 'prod3', quantity: 5, discount: 0 }], paymentMethod: PaymentMethod.UPI, status: BillStatus.Paid, amountPaid: 1400.00 },
        { id: 'inv3', invoiceNumber: 'INV-2024-003', date: new Date('2024-07-22'), customerId: 'cust3', items: [{ productId: 'prod6', quantity: 1, discount: 10 }], paymentMethod: PaymentMethod.Credit, status: BillStatus.Pending, amountPaid: 5000 },
        { id: 'inv4', invoiceNumber: 'INV-2024-004', date: new Date(), customerId: 'cust1', items: [{ productId: 'prod7', quantity: 500, discount: 0 }], paymentMethod: PaymentMethod.Credit, status: BillStatus.Unpaid, amountPaid: 0 },
    ];
    
    return { customers, products, invoices };
};

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [settings, setSettings] = useState<Settings>({
        theme: Theme.Light,
        businessDetails: {
            logo: 'https://picsum.photos/100',
            name: 'Limra Construction & Supplies',
            address: '123 Builder Lane, Structure City',
            gst: '27BITHP1234F1Z5',
            contact: '+91 98765 43210'
        },
        defaultTax: 18,
        defaultDiscount: 0,
        currency: '₹'
    });

    useEffect(() => {
        const { customers, products, invoices } = generateMockData();
        setCustomers(customers);
        setProducts(products);
        setInvoices(invoices);
        const storedTheme = localStorage.getItem('theme') as Theme | null;
        if (storedTheme) {
            setSettings(s => ({...s, theme: storedTheme}));
        }
    }, []);

    useEffect(() => {
        if (settings.theme === Theme.Dark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', settings.theme);
    }, [settings.theme]);

    const addCustomer = (customer: Omit<Customer, 'id'>) => {
        setCustomers([...customers, { ...customer, id: `cust${customers.length + 1}` }]);
    };
    
    const updateCustomer = (updatedCustomer: Customer) => {
        setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    };
    
    const deleteCustomer = (customerId: string) => {
        setCustomers(customers.filter(c => c.id !== customerId));
    };

    const addProduct = (product: Omit<Product, 'id'>) => {
        setProducts([...products, { ...product, id: `prod${products.length + 1}` }]);
    };
    
    const updateProduct = (updatedProduct: Product) => {
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const deleteProduct = (productId: string) => {
        setProducts(products.filter(p => p.id !== productId));
    };

    const addInvoice = (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'date'>) => {
        const newInvoice: Invoice = {
            ...invoice,
            id: `inv${invoices.length + 1}`,
            invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
            date: new Date(),
        };
        setInvoices([...invoices, newInvoice]);
        // Deduct stock
        newInvoice.items.forEach(item => {
            updateProductStock(item.productId, -item.quantity);
        });
    };
    
    const updateInvoiceStatus = (invoiceId: string, status: BillStatus, amountPaid: number) => {
        setInvoices(invoices.map(inv => inv.id === invoiceId ? { ...inv, status, amountPaid } : inv));
    };

    const updateProductStock = (productId: string, change: number) => {
        setProducts(prevProducts => prevProducts.map(p => 
            p.id === productId ? { ...p, stockQuantity: p.stockQuantity + change } : p
        ));
    };

    const updateSettings = (newSettings: Partial<Settings>) => {
        setSettings(prev => ({...prev, ...newSettings}));
    };

    const toggleTheme = () => {
        setSettings(prev => ({...prev, theme: prev.theme === Theme.Light ? Theme.Dark : Theme.Light }));
    };

    return (
        <AppContext.Provider value={{ customers, products, invoices, settings, addCustomer, updateCustomer, deleteCustomer, addProduct, updateProduct, deleteProduct, addInvoice, updateInvoiceStatus, updateSettings, toggleTheme }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};
