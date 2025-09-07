
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Theme } from '../types';
import { SunIcon, MoonIcon, MenuIcon } from './icons';

interface HeaderProps {
  pageTitle: string;
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ pageTitle, toggleSidebar, isSidebarOpen }) => {
  const { settings, toggleTheme } = useAppContext();

  return (
    <header className="flex items-center justify-between h-16 bg-white dark:bg-gray-800 shadow-md px-4 sm:px-6 lg:px-8 flex-shrink-0">
       <div className="flex items-center">
         {!isSidebarOpen && (
            <button onClick={toggleSidebar} className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <MenuIcon className="w-6 h-6" />
            </button>
         )}
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">{pageTitle}</h1>
       </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
        >
          {settings.theme === Theme.Light ? <MoonIcon className="w-6 h-6"/> : <SunIcon className="w-6 h-6"/>}
        </button>
        <div className="flex items-center space-x-3">
            <img src="https://picsum.photos/40" alt="User Avatar" className="w-10 h-10 rounded-full" />
            <div>
                <p className="font-semibold text-sm">Admin User</p>
                <p className="text-xs text-gray-500">Administrator</p>
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
