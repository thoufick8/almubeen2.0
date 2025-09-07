import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Invoice } from '../types';

// Define a more specific type for the enriched invoice passed as a prop
interface EnrichedInvoice extends Invoice {
    customerName: string;
    total: number;
    balance: number;
}

interface InvoiceDetailModalProps {
  invoice: EnrichedInvoice;
  onClose: () => void;
}

const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({ invoice, onClose }) => {
    const { settings, products, customers } = useAppContext();
    const customer = customers.find(c => c.id === invoice.customerId);

    const handlePrint = () => {
        window.print();
    };

    const calculation = React.useMemo(() => {
        let subtotal = 0;
        let totalTax = 0;
        let totalDiscount = 0;

        invoice.items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return;

            const itemTotal = product.sellingPrice * item.quantity;
            const itemDiscount = itemTotal * (item.discount / 100);
            const taxableAmount = itemTotal - itemDiscount;
            const itemTax = taxableAmount * (product.tax / 100);

            subtotal += product.sellingPrice * item.quantity; // subtotal is based on original price before discount
            totalDiscount += itemDiscount;
            totalTax += itemTax;
        });

        const grandTotal = subtotal - totalDiscount + totalTax;
        return { subtotal, totalTax, totalDiscount, grandTotal };
    }, [invoice.items, products]);


    if (!customer) return null; // Or some fallback

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="invoice-print-area bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-full overflow-y-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex justify-between items-start pb-6 border-b dark:border-gray-600">
                        <div className="flex items-center">
                            <img src={settings.businessDetails.logo} alt="Logo" className="h-20 w-20 mr-4 rounded-full object-cover" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{settings.businessDetails.name}</h1>
                                <p className="text-gray-500 dark:text-gray-400">{settings.businessDetails.address}</p>
                                <p className="text-gray-500 dark:text-gray-400">{settings.businessDetails.contact}</p>
                                <p className="text-gray-500 dark:text-gray-400">GST: {settings.businessDetails.gst}</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <h2 className="text-2xl font-semibold uppercase text-gray-500 dark:text-gray-400">Invoice</h2>
                             <p className="text-gray-700 dark:text-gray-300 font-mono">{invoice.invoiceNumber}</p>
                             <p className="text-gray-500 dark:text-gray-400 mt-1">Date: {new Date(invoice.date).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="flex justify-between py-6">
                        <div>
                             <h3 className="font-semibold text-gray-700 dark:text-gray-300">Bill To:</h3>
                             <p className="font-bold text-gray-800 dark:text-white">{customer.name}</p>
                             <p className="text-gray-500 dark:text-gray-400">{customer.address}</p>
                             <p className="text-gray-500 dark:text-gray-400">{customer.mobile}</p>
                             <p className="text-gray-500 dark:text-gray-400">{customer.email}</p>
                             {customer.gstNo && <p className="text-gray-500 dark:text-gray-400">GST: {customer.gstNo}</p>}
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left mb-8">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr>
                                    <th className="p-3 font-semibold">#</th>
                                    <th className="p-3 font-semibold">Item</th>
                                    <th className="p-3 font-semibold text-right">Qty</th>
                                    <th className="p-3 font-semibold text-right">Rate</th>
                                    <th className="p-3 font-semibold text-right">Discount</th>
                                    <th className="p-3 font-semibold text-right">Tax</th>
                                    <th className="p-3 font-semibold text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoice.items.map((item, index) => {
                                    const product = products.find(p => p.id === item.productId);
                                    if (!product) return null;
                                    const itemTotal = product.sellingPrice * item.quantity;
                                    const itemDiscount = itemTotal * (item.discount / 100);
                                    const taxableAmount = itemTotal - itemDiscount;
                                    const itemTax = taxableAmount * (product.tax / 100);
                                    const totalAmount = taxableAmount + itemTax;

                                    return (
                                        <tr key={index} className="border-b dark:border-gray-700">
                                            <td className="p-3">{index + 1}</td>
                                            <td className="p-3">{product.name}</td>
                                            <td className="p-3 text-right">{item.quantity} {product.unit}</td>
                                            <td className="p-3 text-right">{settings.currency}{product.sellingPrice.toFixed(2)}</td>
                                            <td className="p-3 text-right">{settings.currency}{itemDiscount.toFixed(2)} ({item.discount}%)</td>
                                            <td className="p-3 text-right">{settings.currency}{itemTax.toFixed(2)} ({product.tax}%)</td>
                                            <td className="p-3 text-right font-medium">{settings.currency}{totalAmount.toFixed(2)}</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals */}
                     <div className="flex justify-end mb-8">
                        <div className="w-full max-w-sm">
                            <div className="space-y-2 text-gray-700 dark:text-gray-300">
                                <div className="flex justify-between"><span>Subtotal:</span><span>{settings.currency}{calculation.subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Discount:</span><span className="text-green-600">-{settings.currency}{calculation.totalDiscount.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Tax:</span><span>+{settings.currency}{calculation.totalTax.toFixed(2)}</span></div>
                                <hr className="dark:border-gray-600 my-2" />
                                <div className="flex justify-between text-xl font-bold text-gray-800 dark:text-white"><span >Grand Total:</span><span>{settings.currency}{calculation.grandTotal.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Amount Paid:</span><span>{settings.currency}{invoice.amountPaid.toFixed(2)}</span></div>
                                <div className="flex justify-between font-bold text-red-500"><span >Balance Due:</span><span>{settings.currency}{invoice.balance.toFixed(2)}</span></div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="text-center text-gray-500 dark:text-gray-400 text-sm pt-6 border-t dark:border-gray-600">
                        Thank you for your business!
                    </div>
                </div>
                
                 <div className="no-print p-4 bg-gray-50 dark:bg-gray-900 flex justify-end items-center space-x-4 border-t dark:border-gray-700 rounded-b-lg">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Close</button>
                    <button onClick={handlePrint} className="px-4 py-2 rounded bg-primary-500 text-white hover:bg-primary-600">Print Invoice</button>
                 </div>
            </div>
        </div>
    )
};

export default InvoiceDetailModal;
