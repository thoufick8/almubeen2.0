
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from '../components/Card';
import { BusinessDetails } from '../types';

const Settings: React.FC = () => {
    const { settings, updateSettings } = useAppContext();
    const [businessDetails, setBusinessDetails] = useState<BusinessDetails>(settings.businessDetails);
    
    const handleBusinessDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBusinessDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        updateSettings({ businessDetails });
        alert('Settings saved successfully!');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold">Settings</h2>
            <Card>
                <h3 className="text-xl font-semibold mb-4 border-b pb-2 dark:border-gray-700">Business Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                         <div>
                            <label className="block text-sm font-medium">Business Name</label>
                            <input type="text" name="name" value={businessDetails.name} onChange={handleBusinessDetailsChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 mt-1" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Address</label>
                            <input type="text" name="address" value={businessDetails.address} onChange={handleBusinessDetailsChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 mt-1" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">GST No.</label>
                            <input type="text" name="gst" value={businessDetails.gst} onChange={handleBusinessDetailsChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 mt-1" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium">Contact Number</label>
                            <input type="text" name="contact" value={businessDetails.contact} onChange={handleBusinessDetailsChange} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 mt-1" />
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <label className="block text-sm font-medium mb-2">Business Logo</label>
                        <img src={businessDetails.logo} alt="Business Logo" className="w-32 h-32 rounded-full object-cover mb-4" />
                        <button className="px-4 py-2 text-sm rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500">Upload New Logo</button>
                    </div>
                </div>
            </Card>

            <Card>
                <h3 className="text-xl font-semibold mb-4 border-b pb-2 dark:border-gray-700">Defaults</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium">Default Tax (%)</label>
                        <input type="number" value={settings.defaultTax} onChange={e => updateSettings({defaultTax: Number(e.target.value)})} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 mt-1" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Currency Symbol</label>
                        <input type="text" value={settings.currency} onChange={e => updateSettings({currency: e.target.value})} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 mt-1" />
                    </div>
                </div>
            </Card>

            <div className="flex justify-end">
                <button onClick={handleSave} className="px-6 py-3 rounded-lg bg-primary-600 text-white font-bold hover:bg-primary-700">Save All Settings</button>
            </div>
        </div>
    );
};

export default Settings;
