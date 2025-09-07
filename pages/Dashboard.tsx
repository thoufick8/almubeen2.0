
import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import { BillStatus, Page } from '../types';
import { CustomersIcon, BillingIcon, StockIcon, InvoicesIcon } from '../components/icons';

const Dashboard: React.FC = () => {
    const { invoices, products, settings } = useAppContext();

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const salesToday = invoices
        .filter(inv => inv.date >= startOfToday && inv.status === BillStatus.Paid)
        .reduce((sum, inv) => sum + inv.amountPaid, 0);

    const salesThisMonth = invoices
        .filter(inv => inv.date >= startOfMonth && inv.status === BillStatus.Paid)
        .reduce((sum, inv) => sum + inv.amountPaid, 0);
        
    const salesThisYear = invoices
        .filter(inv => inv.date >= startOfYear && inv.status === BillStatus.Paid)
        .reduce((sum, inv) => sum + inv.amountPaid, 0);
    
    const pendingBills = invoices.filter(inv => inv.status === BillStatus.Pending || inv.status === BillStatus.Unpaid);
    const pendingAmount = pendingBills.reduce((sum, inv) => {
        const total = inv.items.reduce((itemSum, item) => {
            const product = products.find(p => p.id === item.productId);
            if (!product) return itemSum;
            const price = item.quantity * product.sellingPrice;
            const discountAmount = price * (item.discount / 100);
            const taxableAmount = price - discountAmount;
            const taxAmount = taxableAmount * (product.tax / 100);
            return itemSum + taxableAmount + taxAmount;
        }, 0);
        return sum + (total - inv.amountPaid);
    }, 0);

    const paidBills = invoices.filter(inv => inv.status === BillStatus.Paid);
    
    const lowStockProducts = products.filter(p => p.stockQuantity < 20).length;

    // Monthly sales data for chart
    const monthlySalesData = Array.from({ length: 12 }, (_, i) => {
        const month = new Date(today.getFullYear(), i, 1);
        const sales = invoices
            .filter(inv => inv.date.getFullYear() === today.getFullYear() && inv.date.getMonth() === i && inv.status === BillStatus.Paid)
            .reduce((sum, inv) => sum + inv.amountPaid, 0);
        return {
            name: month.toLocaleString('default', { month: 'short' }),
            sales: sales,
        };
    });

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <h3 className="text-gray-500 dark:text-gray-400 font-medium">Sales Today</h3>
                    <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{settings.currency}{salesToday.toLocaleString()}</p>
                </Card>
                <Card>
                    <h3 className="text-gray-500 dark:text-gray-400 font-medium">Sales This Month</h3>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">{settings.currency}{salesThisMonth.toLocaleString()}</p>
                </Card>
                <Card>
                    <h3 className="text-gray-500 dark:text-gray-400 font-medium">Pending Bills</h3>
                    <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{pendingBills.length} / {settings.currency}{pendingAmount.toLocaleString()}</p>
                </Card>
                <Card>
                    <h3 className="text-gray-500 dark:text-gray-400 font-medium">Paid Bills</h3>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{paidBills.length}</p>
                </Card>
            </div>
            
            <Card>
                <h3 className="text-xl font-semibold mb-4">Monthly Sales Report ({today.getFullYear()})</h3>
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <BarChart data={monthlySalesData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128, 128, 128, 0.2)" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => `${settings.currency}${Number(value)/1000}k`} />
                            <Tooltip formatter={(value) => [`${settings.currency}${Number(value).toLocaleString()}`, "Sales"]} />
                            <Legend />
                            <Bar dataKey="sales" fill="#3b82f6" name="Monthly Sales" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card>
                    <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <button className="flex flex-col items-center justify-center p-4 bg-primary-100 dark:bg-primary-900 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800 transition">
                            <BillingIcon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                            <span className="mt-2 font-medium">Generate Bill</span>
                        </button>
                         <button className="flex flex-col items-center justify-center p-4 bg-green-100 dark:bg-green-900 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition">
                            <StockIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
                            <span className="mt-2 font-medium">View Stock</span>
                        </button>
                         <button className="flex flex-col items-center justify-center p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-800 transition">
                            <CustomersIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                            <span className="mt-2 font-medium">Add Customer</span>
                        </button>
                         <button className="flex flex-col items-center justify-center p-4 bg-red-100 dark:bg-red-900 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition">
                            <InvoicesIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                            <span className="mt-2 font-medium">Pending Payments</span>
                        </button>
                     </div>
                </Card>
                <Card>
                    <h3 className="text-xl font-semibold mb-4">Notifications</h3>
                    <div className="space-y-3">
                        <div className="flex items-start p-3 bg-red-50 dark:bg-red-900/50 rounded-lg">
                            <div className="w-5 h-5 mt-1 mr-3 bg-red-500 rounded-full flex-shrink-0"></div>
                            <div>
                                <p className="font-semibold">Low Stock Alert</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">{lowStockProducts} products are running low on stock.</p>
                            </div>
                        </div>
                        <div className="flex items-start p-3 bg-yellow-50 dark:bg-yellow-900/50 rounded-lg">
                             <div className="w-5 h-5 mt-1 mr-3 bg-yellow-500 rounded-full flex-shrink-0"></div>
                            <div>
                                <p className="font-semibold">Pending Payments</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">You have {pendingBills.length} outstanding invoices.</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
