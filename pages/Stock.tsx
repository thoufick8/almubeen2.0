
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import { ProductCategory } from '../types';

const Stock: React.FC = () => {
    const { products, settings } = useAppContext();
    const [categoryFilter, setCategoryFilter] = useState<string>('All');
    const [stockStatusFilter, setStockStatusFilter] = useState<string>('All');
    
    const filteredProducts = products.filter(product => {
        const categoryMatch = categoryFilter === 'All' || product.category === categoryFilter;
        let stockMatch = true;
        if (stockStatusFilter === 'Low') {
            stockMatch = product.stockQuantity < 20;
        } else if (stockStatusFilter === 'Out') {
            stockMatch = product.stockQuantity === 0;
        } else if (stockStatusFilter === 'In Stock') {
            stockMatch = product.stockQuantity > 0;
        }
        return categoryMatch && stockMatch;
    });

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-6">Stock & Inventory</h2>

            <div className="flex flex-wrap gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    >
                        <option value="All">All Categories</option>
                        {Object.values(ProductCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Stock Status</label>
                    <select
                        value={stockStatusFilter}
                        onChange={(e) => setStockStatusFilter(e.target.value)}
                        className="p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    >
                        <option value="All">All</option>
                        <option value="In Stock">In Stock</option>
                        <option value="Low">Low Stock (&lt;20)</option>
                        <option value="Out">Out of Stock</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="p-3">Product Name</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Purchase Price</th>
                            <th className="p-3">Selling Price</th>
                            <th className="p-3">Quantity in Stock</th>
                            <th className="p-3">Stock Value</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => {
                            const stockValue = product.purchasePrice * product.stockQuantity;
                            let status = <span className="text-green-600">In Stock</span>;
                            if (product.stockQuantity === 0) {
                                status = <span className="text-red-600">Out of Stock</span>;
                            } else if (product.stockQuantity < 20) {
                                status = <span className="text-yellow-600">Low Stock</span>;
                            }
                            return (
                                <tr key={product.id} className="border-b dark:border-gray-700">
                                    <td className="p-3 font-medium">{product.name}</td>
                                    <td className="p-3">{product.category}</td>
                                    <td className="p-3">{settings.currency}{product.purchasePrice.toFixed(2)}</td>
                                    <td className="p-3">{settings.currency}{product.sellingPrice.toFixed(2)}</td>
                                    <td className="p-3 font-bold">{product.stockQuantity} {product.unit}</td>
                                    <td className="p-3">{settings.currency}{stockValue.toFixed(2)}</td>
                                    <td className="p-3 font-semibold">{status}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default Stock;
