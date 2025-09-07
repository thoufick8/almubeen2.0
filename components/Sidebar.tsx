
import React from 'react';
import { Page } from '../types';
import { DashboardIcon, CustomersIcon, ProductsIcon, BillingIcon, InvoicesIcon, StockIcon, ReportsIcon, SettingsIcon, ChevronLeftIcon, ChevronRightIcon } from './icons';

interface SidebarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

const navItems = [
  { page: Page.Dashboard, icon: <DashboardIcon /> },
  { page: Page.Customers, icon: <CustomersIcon /> },
  { page: Page.Products, icon: <ProductsIcon /> },
  { page: Page.Stock, icon: <StockIcon /> },
  { page: Page.Billing, icon: <BillingIcon /> },
  { page: Page.Invoices, icon: <InvoicesIcon /> },
  { page: Page.Reports, icon: <ReportsIcon /> },
  { page: Page.Settings, icon: <SettingsIcon /> },
];

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setCurrentPage, isOpen, setOpen }) => {
  return (
    <div className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-lg flex flex-col transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="flex items-center justify-between h-16 border-b border-gray-200 dark:border-gray-700 px-4">
        <span className={`text-xl font-bold text-primary-600 dark:text-primary-400 overflow-hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Limra Pro</span>
        <button onClick={() => setOpen(!isOpen)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            {isOpen ? <ChevronLeftIcon className="w-5 h-5"/> : <ChevronRightIcon className="w-5 h-5"/>}
        </button>
      </div>
      <nav className="flex-1 mt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.page} className="px-4 py-1">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(item.page);
                }}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  currentPage === item.page
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-gray-700'
                }`}
              >
                {React.cloneElement(item.icon, { className: 'w-6 h-6' })}
                <span className={`ml-4 font-medium transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>{item.page}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className={`text-center text-xs text-gray-500 dark:text-gray-400 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            <p>&copy; {new Date().getFullYear()} Limra Billing Pro</p>
            <p>v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
