import React, { useState } from 'react';
import { DeleteIcon, PlusIcon } from './icons';
import { ProcessingOverlay } from './common/Feedback';

const ListManager = ({ title, items, onUpdate }) => {
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    if (newItem.trim() && !items.includes(newItem.trim())) {
      onUpdate([...items, newItem.trim()].sort());
      setNewItem('');
    }
  };

  const handleDeleteItem = (itemToDelete) => {
    onUpdate(items.filter(item => item !== itemToDelete));
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
      <div className="space-y-2 mb-4 max-h-60 overflow-y-auto pr-2">
        {items.map(item => (
          <div key={item} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
            <span className="text-sm text-gray-800 dark:text-gray-200">{item}</span>
            <button
              onClick={() => handleDeleteItem(item)}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
              title={`Excluir ${item}`}
            >
              <DeleteIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
        {items.length === 0 && <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum item na lista.</p>}
      </div>
      <div className="flex items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
          placeholder="Adicionar novo item..."
          className="flex-grow block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100"
        />
        <button
          onClick={handleAddItem}
          className="inline-flex items-center justify-center p-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};


export const AdminPage = ({ initialLists, onSave }) => {
  const [lists, setLists] = useState(initialLists);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdateList = (listName, newItems) => {
    const updatedLists = { ...lists, [listName]: newItems };
    setLists(updatedLists);
  };

  const handleSaveChanges = async () => {
    setIsSubmitting(true);
    try {
      await onSave(lists);
      alert('Alterações salvas com sucesso!');
    } catch (error) {
      console.error('Failed to save changes:', error);
      alert('Falha ao salvar as alterações.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {isSubmitting && <ProcessingOverlay text="Salvando..." />}
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ADMINISTRAÇÃO</h1>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Gerencie as listas suspensas do aplicativo.</p>
            </div>
            <div className="flex space-x-2 mt-4 sm:mt-0 flex-shrink-0">
                <button
                    onClick={handleSaveChanges}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                    Salvar Alterações
                </button>
            </div>
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ListManager
          title="Operadores"
          items={lists.operadores}
          onUpdate={(newItems) => handleUpdateList('operadores', newItems)}
        />
        <ListManager
          title="Ruas"
          items={lists.ruas}
          onUpdate={(newItems) => handleUpdateList('ruas', newItems)}
        />
        <ListManager
          title="Locais de Entrega"
          items={lists.locaisDeEntrega}
          onUpdate={(newItems) => handleUpdateList('locaisDeEntrega', newItems)}
        />
      </div>
    </div>
  );
};