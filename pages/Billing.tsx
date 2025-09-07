
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Customer, Product, InvoiceItem, PaymentMethod, BillStatus, Page } from '../types';
import Card from '../components/Card';

interface BillingProps {
    setCurrentPage: (page: Page) => void;
}

const Billing: React.FC<BillingProps> = ({ setCurrentPage }) => {
    const { customers, products, addInvoice, settings } = useAppContext();
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const [items, setItems] = useState<InvoiceItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.Cash);
    const [status, setStatus] = useState<BillStatus>(BillStatus.Paid);
    const [amountPaid, setAmountPaid] = useState(0);

    const [productSearch, setProductSearch] = useState('');

    const handleAddItem = (product: Product) => {
        const existingItem = items.find(i => i.productId === product.id);
        if (existingItem) {
            setItems(items.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i));
        } else {
            setItems([...items, { productId: product.id, quantity: 1, discount: 0 }]);
        }
        setProductSearch('');
    };

    const handleItemChange = <T extends keyof InvoiceItem>(index: number, field: T, value: InvoiceItem[T]) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleRemoveItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const calculation = useMemo(() => {
        let subtotal = 0;
        let totalTax = 0;
        let totalDiscount = 0;

        items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return;

            const itemTotal = product.sellingPrice * item.quantity;
            const itemDiscount = itemTotal * (item.discount / 100);
            const taxableAmount = itemTotal - itemDiscount;
            const itemTax = taxableAmount * (product.tax / 100);

            subtotal += itemTotal;
            totalDiscount += itemDiscount;
            totalTax += itemTax;
        });

        const grandTotal = subtotal - totalDiscount + totalTax;
        return { subtotal, totalTax, totalDiscount, grandTotal };
    }, [items, products]);
    
    const handleStatusChange = (newStatus: BillStatus) => {
        setStatus(newStatus);
        if(newStatus === BillStatus.Paid) {
            setAmountPaid(calculation.grandTotal);
        } else if (newStatus === BillStatus.Unpaid) {
            setAmountPaid(0);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCustomerId || items.length === 0) {
            alert('Please select a customer and add at least one item.');
            return;
        }
        addInvoice({
            customerId: selectedCustomerId,
            items,
            paymentMethod,
            status,
            amountPaid,
        });
        alert('Invoice created successfully!');
        setCurrentPage(Page.Invoices);
    };

    const filteredProducts = productSearch
        ? products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()))
        : [];

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Customer Details</h2>
                        <select
                            value={selectedCustomerId}
                            onChange={e => setSelectedCustomerId(e.target.value)}
                            required
                            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                        >
                            <option value="">Select a Customer</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.name} - {c.mobile}</option>)}
                        </select>
                    </Card>
                    <Card>
                        <h2 className="text-xl font-bold mb-4">Invoice Items</h2>
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Search for a product..."
                                value={productSearch}
                                onChange={e => setProductSearch(e.target.value)}
                                className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                            />
                            {productSearch && filteredProducts.length > 0 && (
                                <ul className="absolute z-10 w-full bg-white dark:bg-gray-700 border rounded-b shadow-lg max-h-60 overflow-y-auto">
                                    {filteredProducts.map(p => (
                                        <li
                                            key={p.id}
                                            onClick={() => handleAddItem(p)}
                                            className="p-2 hover:bg-primary-100 dark:hover:bg-primary-900 cursor-pointer"
                                        >
                                            {p.name} ({settings.currency}{p.sellingPrice})
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="p-2">Product</th>
                                        <th className="p-2 w-24">Qty</th>
                                        <th className="p-2 w-28">Price</th>
                                        <th className="p-2 w-24">Discount(%)</th>
                                        <th className="p-2 w-32">Total</th>
                                        <th className="p-2 w-12"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item, index) => {
                                        const product = products.find(p => p.id === item.productId);
                                        if (!product) return null;
                                        const total = product.sellingPrice * item.quantity * (1 - item.discount / 100);
                                        return (
                                            <tr key={index} className="border-b dark:border-gray-700">
                                                <td className="p-2">{product.name}</td>
                                                <td className="p-2"><input type="number" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', Number(e.target.value))} className="w-full p-1 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" /></td>
                                                <td className="p-2">{settings.currency}{product.sellingPrice.toFixed(2)}</td>
                                                <td className="p-2"><input type="number" value={item.discount} onChange={e => handleItemChange(index, 'discount', Number(e.target.value))} className="w-full p-1 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" /></td>
                                                <td className="p-2 font-medium">{settings.currency}{total.toFixed(2)}</td>
                                                <td className="p-2"><button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500">X</button></td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-1">
                    <Card className="space-y-4">
                        <h2 className="text-xl font-bold">Summary & Payment</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between"><span>Subtotal:</span><span>{settings.currency}{calculation.subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Discount:</span><span className="text-green-600">-{settings.currency}{calculation.totalDiscount.toFixed(2)}</span></div>
                            <div className="flex justify-between"><span>Tax:</span><span>+{settings.currency}{calculation.totalTax.toFixed(2)}</span></div>
                            <hr className="dark:border-gray-600" />
                            <div className="flex justify-between text-xl font-bold"><span >Grand Total:</span><span>{settings.currency}{calculation.grandTotal.toFixed(2)}</span></div>
                        </div>
                        <div className="space-y-2">
                            <label>Payment Method</label>
                            <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value as PaymentMethod)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                                {Object.values(PaymentMethod).map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label>Bill Status</label>
                            <select value={status} onChange={e => handleStatusChange(e.target.value as BillStatus)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                                {Object.values(BillStatus).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label>Amount Paid</label>
                            <input type="number" value={amountPaid} onChange={e => setAmountPaid(Number(e.target.value))} max={calculation.grandTotal} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                        </div>
                        <button type="submit" className="w-full mt-4 p-3 rounded bg-primary-600 text-white font-bold text-lg hover:bg-primary-700">Generate Invoice</button>
                    </Card>
                </div>
            </div>
        </form>
    );
};

export default Billing;
