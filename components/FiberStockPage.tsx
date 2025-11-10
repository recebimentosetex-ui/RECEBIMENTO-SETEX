import React, { useState, useEffect, useRef } from 'react';
import { FiberStatus } from '../types';
import { exportFiberStockToExcel } from '../services/exportService';
import { FiberStockForm } from './FiberStockForm';
import { PlusIcon, EditIcon, DeleteIcon, ExportIcon, ImportIcon, SearchIcon } from './icons';
import { LoadingSpinner, ProcessingOverlay } from './common/Feedback';

declare const XLSX: any;

const FiberStatusBadge = ({ status }) => {
    const isEmEstoque = status === FiberStatus.EmEstoque;
    const bgColor = isEmEstoque ? 'bg-blue-100 dark:bg-blue-900' : 'bg-green-100 dark:bg-green-900';
    const textColor = isEmEstoque ? 'text-blue-800 dark:text-blue-200' : 'text-green-800 dark:text-green-200';
    const label = isEmEstoque ? 'Em Estoque' : 'Pago';
    return (<span className={`px-3 py-1 text-xs font-medium rounded-full ${bgColor} ${textColor}`}>{label}</span>);
};

export const FiberStockPage = ({ adminLists }) => {
    const [stock, setStock] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [processingText, setProcessingText] = useState('');
    const [view, setView] = useState('list');
    const [editingItem, setEditingItem] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        window.google.script.run
            .withSuccessHandler(data => {
                setStock(data);
                setIsLoading(false);
            })
            .withFailureHandler(err => {
                console.error(err);
                alert("Falha ao carregar dados do estoque. Verifique o console.");
                setIsLoading(false);
            })
            .getFiberStock();
    }, []);

    const handleAddClick = () => { setEditingItem(null); setView('form'); };
    const handleEditClick = (item) => { setEditingItem(item); setView('form'); };
    
    // Fix: Make onSuccessCallback optional to handle calls with only one argument.
    const handleDeleteClick = (id: any, onSuccessCallback?: () => void) => {
      if (window.confirm('Tem certeza que deseja excluir este item do estoque?')) {
        setProcessingText('Excluindo item...');
        setIsSubmitting(true);
        window.google.script.run
          .withSuccessHandler(() => {
            setStock(prevStock => prevStock.filter(item => item.id !== id));
            setIsSubmitting(false);
            if (onSuccessCallback) onSuccessCallback();
          })
          .withFailureHandler(err => {
            console.error(err);
            alert("Falha ao excluir o item.");
            setIsSubmitting(false);
          })
          .deleteFiberStock(id);
      }
    };
    
    const handleFormDelete = (id) => {
        handleDeleteClick(id, () => {
            setView('list');
            setEditingItem(null);
        });
    };

    const handleFormSubmit = (itemData) => {
      setProcessingText('Salvando item...');
      setIsSubmitting(true);
      window.google.script.run
        .withSuccessHandler((savedItem) => {
          if ('id' in itemData) {
            setStock(prev => prev.map(s => s.id === savedItem.id ? savedItem : s));
          } else {
            setStock(prev => [savedItem, ...prev]);
          }
          setView('list');
          setIsSubmitting(false);
        })
        .withFailureHandler(err => {
          console.error(err);
          alert("Falha ao salvar o item.");
          setIsSubmitting(false);
        })
        .saveFiberStock(itemData);
    };
    
    const handleImportClick = () => { fileInputRef.current?.click(); };
    const handleFileImport = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setProcessingText('Importando arquivo...');
        setIsSubmitting(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, {
              header: ["material", "lote", "qtd", "prateleira", "rua", "sala", "status", "sm"]
            });
            
            if (json.length > 0 && (json[0] as any).material?.toUpperCase() === 'MATERIAL') {
                json.shift();
            }

            window.google.script.run
                .withSuccessHandler((updatedStock) => {
                    setStock(updatedStock);
                    setIsSubmitting(false);
                    alert(`${json.length} itens importados com sucesso!`);
                })
                .withFailureHandler(err => {
                    console.error(err);
                    alert("Falha ao importar o arquivo.");
                    setIsSubmitting(false);
                })
                .importFiberStock(json);
        };
        reader.readAsArrayBuffer(file);
        event.target.value = '';
    };

    const handleCancelForm = () => { setView('list'); setEditingItem(null); };
    const handleExport = () => exportFiberStockToExcel(stock, 'relatorio_estoque_fibras');
    
    const filteredStock = stock.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    if (isLoading) return <div className="p-8"><LoadingSpinner text="Carregando estoque..." /></div>;
    if (view === 'form') return <FiberStockForm 
        onSubmit={handleFormSubmit} 
        onCancel={handleCancelForm} 
        initialData={editingItem} 
        onDelete={handleFormDelete} 
        ruas={adminLists.ruas} 
    />;

    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {isSubmitting && <ProcessingOverlay text={processingText} />}
        <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".xlsx, .xls, .csv" />
        <header className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">ESTOQUE DE FIBRAS</h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Gerencie o estoque de fibras.</p>
                </div>
                <div className="flex space-x-2 mt-4 sm:mt-0 flex-shrink-0">
                    <button onClick={handleImportClick} className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"><ImportIcon className="mr-2 h-5 w-5" />Importar</button>
                    <button onClick={handleExport} disabled={stock.length === 0} className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ExportIcon className="mr-2 h-5 w-5" />Exportar</button>
                    <button onClick={handleAddClick} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"><PlusIcon className="mr-2 h-5 w-5" />Adicionar</button>
                </div>
            </div>
            <div className="mt-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Pesquisar por ID, material, lote, prateleira, etc..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
        </header>
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            {filteredStock.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>{['ID', 'Material', 'Lote', 'Qtd', 'Prateleira', 'Rua', 'Sala', 'Status', 'SM', 'Ações'].map(header => (<th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{header}</th>))}</tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredStock.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700 dark:text-gray-200">{item.displayId || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.material}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.lote}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.qtd}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.prateleira}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.rua}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.sala}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm"><FiberStatusBadge status={item.status} /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.sm || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-4">
                          <button onClick={() => handleEditClick(item)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors" title="Editar"><EditIcon /></button>
                          <button onClick={() => handleDeleteClick(item.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors" title="Excluir"><DeleteIcon /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-16 px-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {searchQuery ? 'Nenhum item encontrado' : 'Nenhum item no estoque'}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {searchQuery
                    ? `Sua busca por "${searchQuery}" não retornou resultados.`
                    : 'Comece adicionando um novo item ou importando uma planilha.'}
                </p>
                <div className="mt-6">
                  <button onClick={handleAddClick} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"><PlusIcon className="-ml-1 mr-2 h-5 w-5" />Adicionar Item</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
};
