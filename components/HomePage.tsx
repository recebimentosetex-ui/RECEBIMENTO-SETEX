import React from 'react';

export const HomePage = ({ onNavigate }) => {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center text-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
        Recebimento Setex
      </h1>
      <p className="text-md text-gray-500 dark:text-gray-400 max-w-xl mb-10">
        Um aplicativo para gerenciar e acompanhar liberações de materiais, com opções para adicionar, editar, excluir e exportar registros de liberação para o Excel.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
        <button
          onClick={() => onNavigate('releases')}
          className="w-full flex-1 inline-flex justify-center items-center px-8 py-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Liberação de Material
        </button>
        <button
          onClick={() => onNavigate('fibers')}
          className="w-full flex-1 inline-flex justify-center items-center px-8 py-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
        >
          Estoque de Fibras
        </button>
      </div>
    </div>
  );
};