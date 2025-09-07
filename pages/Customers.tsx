
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import { Customer, CustomerType } from '../types';

// The form is defined outside the main component
const CustomerForm: React.FC<{ customer?: Customer, onSave: (customer: Omit<Customer, 'id'> | Customer) => void, onCancel: () => void }> = ({ customer, onSave, onCancel }) => {
    const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
        name: customer?.name || '',
        mobile: customer?.mobile || '',
        email: customer?.email || '',
        address: customer?.address || '',
        gstNo: customer?.gstNo || '',
        customerType: customer?.customerType || CustomerType.New,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(customer ? { ...formData, id: customer.id } : formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-6">{customer ? 'Edit Customer' : 'Add New Customer'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                        <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile" required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                    </div>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                    <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address" required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="gstNo" value={formData.gstNo} onChange={handleChange} placeholder="GST No. (Optional)" className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600" />
                        <select name="customerType" value={formData.customerType} onChange={handleChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                            {Object.values(CustomerType).map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                     </div>
                    <div className="flex justify-end space-x-4 pt-4">
                        <button type="button" onClick={onCancel} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded bg-primary-500 text-white hover:bg-primary-600">Save Customer</button>
                    </div>
                </form>
            </Card>
        </div>
    );
};


const Customers: React.FC = () => {
    const { customers, addCustomer, updateCustomer, deleteCustomer } = useAppContext();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSave = (customerData: Omit<Customer, 'id'> | Customer) => {
        if ('id' in customerData) {
            updateCustomer(customerData);
        } else {
            addCustomer(customerData);
        }
        setIsFormOpen(false);
        setEditingCustomer(undefined);
    };
    
    const openAddForm = () => {
        setEditingCustomer(undefined);
        setIsFormOpen(true);
    };

    const openEditForm = (customer: Customer) => {
        setEditingCustomer(customer);
        setIsFormOpen(true);
    };

    const filteredCustomers = customers.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.mobile.includes(searchTerm) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Card>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Customer Management</h2>
                <button onClick={openAddForm} className="px-4 py-2 rounded bg-primary-500 text-white hover:bg-primary-600">Add New Customer</button>
            </div>
            <input
                type="text"
                placeholder="Search by name, mobile, or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full p-2 mb-6 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Contact</th>
                            <th className="p-3">Type</th>
                            <th className="p-3">GST No.</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map(customer => (
                            <tr key={customer.id} className="border-b dark:border-gray-700">
                                <td className="p-3 font-medium">{customer.name}</td>
                                <td className="p-3">{customer.mobile}<br/>{customer.email}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-1 text-xs rounded-full ${customer.customerType === CustomerType.Corporate ? 'bg-blue-200 text-blue-800' : customer.customerType === CustomerType.Regular ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>{customer.customerType}</span>
                                </td>
                                <td className="p-3">{customer.gstNo || 'N/A'}</td>
                                <td className="p-3">
                                    <button onClick={() => openEditForm(customer)} className="text-primary-600 hover:underline mr-4">Edit</button>
                                    <button onClick={() => deleteCustomer(customer.id)} className="text-red-600 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isFormOpen && <CustomerForm customer={editingCustomer} onSave={handleSave} onCancel={() => setIsFormOpen(false)} />}
        </Card>
    );
};

export default Customers;
