import React, { useState, useEffect } from 'react';
import { ReleasesPage } from './components/ReleasesPage';
import { FiberStockPage } from './components/FiberStockPage';
import { AdminPage } from './components/AdminPage';
import { AdminLoginPage } from './components/AdminLoginPage';
import { LoadingSpinner } from './components/common/Feedback';
import { HomePage } from './components/HomePage';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [adminLists, setAdminLists] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    window.google.script.run
      .withSuccessHandler((data) => {
        setAdminLists(data);
        setIsLoading(false);
      })
      .withFailureHandler((err) => {
        console.error('Failed to load admin lists', err);
        alert('Falha ao carregar dados de configuração.');
        setIsLoading(false);
      })
      .getAdminLists();
  }, []);

  const handleSaveAdminLists = (lists) => {
    // Fix: Specify Promise return type as void since resolve() is called with no arguments.
    return new Promise<void>((resolve, reject) => {
      window.google.script.run
        .withSuccessHandler((savedLists) => {
          setAdminLists(savedLists);
          resolve();
        })
        .withFailureHandler((err) => {
          console.error('Failed to save admin lists', err);
          reject(err);
        })
        .saveAdminLists(lists);
    });
  };
  
  const navigateTo = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    if (isLoading || !adminLists) {
      return <div className="p-8"><LoadingSpinner text="Carregando configurações..." /></div>;
    }
    switch(currentPage) {
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'releases':
        return <ReleasesPage adminLists={adminLists} />;
      case 'fibers':
        return <FiberStockPage adminLists={adminLists} />;
      case 'admin':
        return isAdminAuthenticated ? 
          <AdminPage initialLists={adminLists} onSave={handleSaveAdminLists} /> :
          <AdminLoginPage 
            onLoginSuccess={() => setIsAdminAuthenticated(true)}
            onCancel={() => navigateTo('home')}
          />;
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center sm:justify-start h-16">
            <div className="flex space-x-4">
              <button
                onClick={() => navigateTo('home')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 'home' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                Início
              </button>
              <button
                onClick={() => navigateTo('releases')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 'releases' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                Liberação de Material
              </button>
              <button
                onClick={() => navigateTo('fibers')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 'fibers' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                Estoque de Fibras
              </button>
              <button
                onClick={() => navigateTo('admin')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${currentPage === 'admin' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                Admin
              </button>
            </div>
          </div>
        </nav>
      </header>
      <main>
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
