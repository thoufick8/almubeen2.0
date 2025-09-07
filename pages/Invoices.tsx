import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import { Invoice, BillStatus } from '../types';
import InvoiceDetailModal from '../components/InvoiceDetailModal';

// Define the enriched type here to be used in state
interface EnrichedInvoice extends Invoice {
    customerName: string;
    total: number;
    balance: number;
}


const Invoices: React.FC = () => {
    const { invoices, customers, products, settings } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [viewingInvoice, setViewingInvoice] = useState<EnrichedInvoice | null>(null);
    
    const getInvoiceTotal = (invoice: Invoice): number => {
        return invoice.items.reduce((sum, item) => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return sum;
            const price = item.quantity * product.sellingPrice;
            const discountAmount = price * (item.discount / 100);
            const taxableAmount = price - discountAmount;
            const taxAmount = taxableAmount * (product.tax / 100);
            return sum + taxableAmount + taxAmount;
        }, 0);
    };

    const enrichedInvoices: EnrichedInvoice[] = useMemo(() => {
        return invoices.map(invoice => {
            const customer = customers.find(c => c.id === invoice.customerId);
            const total = getInvoiceTotal(invoice);
            const balance = total - invoice.amountPaid;
            return {
                ...invoice,
                customerName: customer?.name || 'N/A',
                total,
                balance
            };
        }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [invoices, customers, products]);

    const filteredInvoices = enrichedInvoices.filter(inv =>
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: BillStatus) => {
        switch (status) {
            case BillStatus.Paid: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case BillStatus.Pending: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case BillStatus.Unpaid: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };
    
    return (
        <Card>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">All Invoices</h2>
                 <input
                    type="text"
                    placeholder="Search by invoice # or customer..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-1/3 p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="p-3">Invoice #</th>
                            <th className="p-3">Customer</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Total</th>
                            <th className="p-3">Amount Paid</th>
                            <th className="p-3">Balance</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInvoices.map(invoice => (
                            <tr key={invoice.id} className="border-b dark:border-gray-700">
                                <td className="p-3 font-medium">{invoice.invoiceNumber}</td>
                                <td className="p-3">{invoice.customerName}</td>
                                <td className="p-3">{new Date(invoice.date).toLocaleDateString()}</td>
                                <td className="p-3">{settings.currency}{invoice.total.toFixed(2)}</td>
                                <td className="p-3">{settings.currency}{invoice.amountPaid.toFixed(2)}</td>
                                <td className="p-3 font-semibold text-red-500">{settings.currency}{invoice.balance.toFixed(2)}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(invoice.status)}`}>
                                        {invoice.status}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <button onClick={() => setViewingInvoice(invoice)} className="text-primary-600 hover:underline">View / Print</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {viewingInvoice && (
                <InvoiceDetailModal 
                    invoice={viewingInvoice}
                    onClose={() => setViewingInvoice(null)}
                />
            )}
        </Card>
    );
};

export default Invoices;