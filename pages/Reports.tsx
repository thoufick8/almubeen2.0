
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import { BillStatus } from '../types';

type ReportType = 'dailySales' | 'customerWise' | 'productWise';

const Reports: React.FC = () => {
    const { invoices, customers, products, settings } = useAppContext();
    const [activeReport, setActiveReport] = useState<ReportType>('dailySales');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const reportData = useMemo(() => {
        switch (activeReport) {
            case 'dailySales':
                const date = new Date(selectedDate);
                const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
                return invoices
                    .filter(inv => inv.date >= startOfDay && inv.date < endOfDay && inv.status === BillStatus.Paid)
                    .map(inv => {
                        const customer = customers.find(c => c.id === inv.customerId);
                        const total = inv.items.reduce((sum, item) => {
                             const product = products.find(p => p.id === item.productId);
                             if (!product) return sum;
                             const itemTotal = product.sellingPrice * item.quantity * (1 - item.discount / 100);
                             return sum + itemTotal * (1 + product.tax / 100);
                        }, 0);
                        return { id: inv.id, invoice: inv.invoiceNumber, customer: customer?.name, total: inv.amountPaid };
                    });

            case 'customerWise':
                 return customers.map(customer => {
                    const customerInvoices = invoices.filter(inv => inv.customerId === customer.id && inv.status === BillStatus.Paid);
                    const totalPurchase = customerInvoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
                    return { id: customer.id, customer: customer.name, invoices: customerInvoices.length, total: totalPurchase };
                }).sort((a,b) => b.total - a.total);

            case 'productWise':
                const productSales = new Map<string, { quantity: number, total: number }>();
                invoices.forEach(inv => {
                    if (inv.status === BillStatus.Paid) {
                        inv.items.forEach(item => {
                            const product = products.find(p => p.id === item.productId);
                            if (!product) return;
                            const current = productSales.get(item.productId) || { quantity: 0, total: 0 };
                            const itemTotal = product.sellingPrice * item.quantity * (1 - item.discount / 100);
                            productSales.set(item.productId, {
                                quantity: current.quantity + item.quantity,
                                total: current.total + itemTotal
                            });
                        });
                    }
                });
                return Array.from(productSales.entries()).map(([id, data]) => {
                    const product = products.find(p => p.id === id);
                    return { id, product: product?.name || 'N/A', ...data };
                }).sort((a,b) => b.total - a.total);
            default:
                return [];
        }
    }, [activeReport, selectedDate, invoices, customers, products]);

    const renderTable = () => {
        switch (activeReport) {
            case 'dailySales':
                return (
                    <>
                    <div className="mb-4">
                        <label className="mr-4">Select Date:</label>
                        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"/>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Daily Sales for {new Date(selectedDate).toLocaleDateString()}</h3>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700"><tr><th className="p-2">Invoice #</th><th className="p-2">Customer</th><th className="p-2">Total Amount</th></tr></thead>
                        <tbody>{reportData.map(row => <tr key={row.id} className="border-b dark:border-gray-700"><td className="p-2">{row.invoice}</td><td className="p-2">{row.customer}</td><td className="p-2">{settings.currency}{row.total.toFixed(2)}</td></tr>)}</tbody>
                    </table>
                    </>
                );
            case 'customerWise':
                return (
                    <>
                    <h3 className="text-xl font-bold mb-2">Customer-wise Sales Report</h3>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700"><tr><th className="p-2">Customer</th><th className="p-2">Invoices</th><th className="p-2">Total Purchase</th></tr></thead>
                        <tbody>{reportData.map(row => <tr key={row.id} className="border-b dark:border-gray-700"><td className="p-2">{row.customer}</td><td className="p-2">{row.invoices}</td><td className="p-2">{settings.currency}{row.total.toFixed(2)}</td></tr>)}</tbody>
                    </table>
                    </>
                );
            case 'productWise':
                return (
                     <>
                    <h3 className="text-xl font-bold mb-2">Product-wise Sales Report</h3>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700"><tr><th className="p-2">Product</th><th className="p-2">Quantity Sold</th><th className="p-2">Total Sales</th></tr></thead>
                        <tbody>{reportData.map(row => <tr key={row.id} className="border-b dark:border-gray-700"><td className="p-2">{row.product}</td><td className="p-2">{row.quantity}</td><td className="p-2">{settings.currency}{row.total.toFixed(2)}</td></tr>)}</tbody>
                    </table>
                     </>
                );
            default: return null;
        }
    }

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-6">Reports & Analytics</h2>
            <div className="flex border-b dark:border-gray-700 mb-6">
                <button onClick={() => setActiveReport('dailySales')} className={`px-4 py-2 ${activeReport === 'dailySales' ? 'border-b-2 border-primary-500 font-semibold' : ''}`}>Daily Sales</button>
                <button onClick={() => setActiveReport('customerWise')} className={`px-4 py-2 ${activeReport === 'customerWise' ? 'border-b-2 border-primary-500 font-semibold' : ''}`}>Customer Wise</button>
                <button onClick={() => setActiveReport('productWise')} className={`px-4 py-2 ${activeReport === 'productWise' ? 'border-b-2 border-primary-500 font-semibold' : ''}`}>Product Wise</button>
            </div>
            <div className="overflow-x-auto">
                {renderTable()}
            </div>
        </Card>
    );
};

export default Reports;
