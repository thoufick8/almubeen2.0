
import React, { useState, useMemo } from 'react';
import { AppContextProvider } from './context/AppContext';
import { Page } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Products from './pages/Products';
import Billing from './pages/Billing';
import Invoices from './pages/Invoices';
import Settings from './pages/Settings';
import Header from './components/Header';
import Stock from './pages/Stock';
import Reports from './pages/Reports';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard />;
      case Page.Customers:
        return <Customers />;
      case Page.Products:
        return <Products />;
      case Page.Billing:
        return <Billing setCurrentPage={setCurrentPage} />;
      case Page.Invoices:
        return <Invoices />;
      case Page.Stock:
        return <Stock />;
      case Page.Reports:
        return <Reports />;
      case Page.Settings:
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const pageTitle = useMemo(() => {
    const pageName = Object.keys(Page).find(key => Page[key as keyof typeof Page] === currentPage);
    // Add spaces before capital letters
    return pageName ? pageName.replace(/([A-Z])/g, ' $1').trim() : 'Dashboard';
  }, [currentPage]);

  return (
    <AppContextProvider>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
        <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <Header pageTitle={pageTitle} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {renderPage()}
          </main>
        </div>
      </div>
    </AppContextProvider>
  );
};

export default App;
