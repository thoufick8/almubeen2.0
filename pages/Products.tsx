
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import { Product, ProductCategory, ProductUnit } from '../types';

const ProductForm: React.FC<{ product?: Product, onSave: (product: Omit<Product, 'id'> | Product) => void, onCancel: () => void }> = ({ product, onSave, onCancel }) => {
    const { settings } = useAppContext();
    const [formData, setFormData] = useState<Omit<Product, 'id'>>({
        name: product?.name || '',
        category: product?.category || ProductCategory.Product,
        purchasePrice: product?.purchasePrice || 0,
        sellingPrice: product?.sellingPrice || 0,
        stockQuantity: product?.stockQuantity || 0,
        tax: product?.tax || settings.defaultTax,
        unit: product?.unit || ProductUnit.Pcs,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(product ? { ...formData, id: product.id } : formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6">{product ? 'Edit Product/Service' : 'Add New Product/Service'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                    <select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                        {Object.values(ProductCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} placeholder="Purchase Price" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                        <input type="number" name="sellingPrice" value={formData.sellingPrice} onChange={handleChange} placeholder="Selling Price" required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <input type="number" name="stockQuantity" value={formData.stockQuantity} onChange={handleChange} placeholder="Stock Quantity" required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                         <input type="number" name="tax" value={formData.tax} onChange={handleChange} placeholder="Tax (%)" required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                    </div>
                     <select name="unit" value={formData.unit} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                            {Object.values(ProductUnit).map(unit => <option key={unit} value={unit}>{unit}</option>)}
                     </select>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded bg-primary-500 text-white hover:bg-primary-600">Save Product</button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

const Products: React.FC = () => {
    const { products, addProduct, updateProduct, deleteProduct, settings } = useAppContext();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSave = (productData: Omit<Product, 'id'> | Product) => {
        if ('id' in productData) {
            updateProduct(productData);
        } else {
            addProduct(productData);
        }
        setIsFormOpen(false);
        setEditingProduct(undefined);
    };

    const openAddForm = () => {
        setEditingProduct(undefined);
        setIsFormOpen(true);
    };

    const openEditForm = (product: Product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Card>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Products & Services</h2>
                <button onClick={openAddForm} className="px-4 py-2 rounded bg-primary-500 text-white hover:bg-primary-600">Add New Item</button>
            </div>
             <input
                type="text"
                placeholder="Search by name or category..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full p-2 mb-6 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Selling Price</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3">Tax</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id} className="border-b dark:border-gray-700">
                                <td className="p-3 font-medium">{product.name}</td>
                                <td className="p-3">{product.category}</td>
                                <td className="p-3">{settings.currency}{product.sellingPrice.toFixed(2)}</td>
                                <td className="p-3">
                                    <span className={product.stockQuantity < 10 ? 'text-red-500 font-bold' : ''}>
                                        {product.stockQuantity} {product.unit}
                                    </span>
                                </td>
                                <td className="p-3">{product.tax}%</td>
                                <td className="p-3">
                                    <button onClick={() => openEditForm(product)} className="text-primary-600 hover:underline mr-4">Edit</button>
                                    <button onClick={() => deleteProduct(product.id)} className="text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isFormOpen && <ProductForm product={editingProduct} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />}
        </Card>
    );
};

export default Products;
