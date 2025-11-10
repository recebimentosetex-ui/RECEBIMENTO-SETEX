import React, { useState, useEffect } from 'react';
import { Status } from '../types';
import { exportReleasesToExcel } from '../services/exportService';
import { ReleaseForm } from './ReleaseForm';
import { PlusIcon, EditIcon, DeleteIcon, ExportIcon, SearchIcon } from './icons';
import { LoadingSpinner, ProcessingOverlay } from './common/Feedback';

const StatusBadge = ({ status }) => {
    const isPendente = status === Status.Pendente;
    const bgColor = isPendente ? 'bg-yellow-100 dark:bg-yellow-900' : 'bg-green-100 dark:bg-green-900';
    const textColor = isPendente ? 'text-yellow-800 dark:text-yellow-200' : 'text-green-800 dark:text-green-200';
    const label = isPendente ? 'Pendente' : 'Finalizado';
    return (<span className={`px-3 py-1 text-xs font-medium rounded-full ${bgColor} ${textColor}`}>{label}</span>);
};

export const ReleasesPage = ({ adminLists }) => {
    const [releases, setReleases] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [processingText, setProcessingText] = useState('');
    const [view, setView] = useState('list');
    const [editingRelease, setEditingRelease] = useState(null);

    useEffect(() => {
      window.google.script.run
        .withSuccessHandler(data => {
          setReleases(data);
          setIsLoading(false);
        })
        .withFailureHandler(err => {
            console.error(err);
            alert("Falha ao carregar os dados. Verifique o console para mais detalhes.");
            setIsLoading(false);
        })
        .getReleases();
    }, []);

    const handleAddClick = () => { setEditingRelease(null); setView('form'); };
    const handleEditClick = (release) => { setEditingRelease(release); setView('form'); };
    
    // Fix: Make onSuccessCallback optional to handle calls with only one argument.
    const handleDeleteClick = (id: any, onSuccessCallback?: () => void) => {
      if (window.confirm('Tem certeza que deseja excluir esta liberação?')) {
        setProcessingText('Excluindo liberação...');
        setIsSubmitting(true);
        window.google.script.run
            .withSuccessHandler(() => {
                setReleases(prevReleases => prevReleases.filter(r => r.id !== id));
                setIsSubmitting(false);
                if (onSuccessCallback) onSuccessCallback();
            })
            .withFailureHandler(err => {
                console.error(err);
                alert("Falha ao excluir a liberação.");
                setIsSubmitting(false);
            })
            .deleteRelease(id);
      }
    };

    const handleFormDelete = (id) => {
        handleDeleteClick(id, () => {
            setView('list');
            setEditingRelease(null);
        });
    };

    const handleFormSubmit = (releaseData) => {
      setProcessingText('Salvando liberação...');
      setIsSubmitting(true);
      window.google.script.run
        .withSuccessHandler((savedRelease) => {
          if ('id' in releaseData) {
            setReleases(prev => prev.map(r => r.id === savedRelease.id ? savedRelease : r));
          } else {
            setReleases(prev => [savedRelease, ...prev]);
          }
          setView('list');
          setIsSubmitting(false);
        })
        .withFailureHandler(err => {
            console.error(err);
            alert("Falha ao salvar a liberação.");
            setIsSubmitting(false);
        })
        .saveRelease(releaseData);
    };

    const handleCancelForm = () => { setView('list'); setEditingRelease(null); };
    const handleExport = () => exportReleasesToExcel(releases, 'relatorio_liberacao_material');
    
    const filteredReleases = releases.filter(release =>
      Object.values(release).some(value =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    if (isLoading) return <div className="p-8"><LoadingSpinner text="Carregando liberações..." /></div>;
    if (view === 'form') return <ReleaseForm
      onSubmit={handleFormSubmit}
      onCancel={handleCancelForm}
      initialData={editingRelease}
      onDelete={handleFormDelete}
      operadores={adminLists.operadores}
      ruas={adminLists.ruas}
      locaisDeEntrega={adminLists.locaisDeEntrega}
    />;

    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {isSubmitting && <ProcessingOverlay text={processingText} />}
        <header className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">LIBERAÇÃO DE MATERIAL</h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Gerencie e acompanhe as liberações de materiais.</p>
                </div>
                <div className="flex space-x-2 mt-4 sm:mt-0 flex-shrink-0">
                    <button onClick={handleExport} disabled={releases.length === 0} className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"><ExportIcon className="mr-2 h-5 w-5" />Exportar</button>
                    <button onClick={handleAddClick} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"><PlusIcon className="mr-2 h-5 w-5" />Adicionar</button>
                </div>
            </div>
            <div className="mt-4 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Pesquisar por ID, material, operador, rua, SM, etc..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-500 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>
        </header>
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            {filteredReleases.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>{['ID', 'Material', 'Operador', 'Rua', 'Local', 'Data', 'Status', 'SM', 'Ações'].map(header => (<th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{header}</th>))}</tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredReleases.map(release => (
                    <tr key={release.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700 dark:text-gray-200">{release.displayId || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{release.material}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{release.operador}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{release.rua}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{release.localDeEntrega}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(release.data + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={release.status} /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{release.sm || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-4">
                          <button onClick={() => handleEditClick(release)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors" title="Editar"><EditIcon /></button>
                          <button onClick={() => handleDeleteClick(release.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors" title="Excluir"><DeleteIcon /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-16 px-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {searchQuery ? 'Nenhuma liberação encontrada' : 'Nenhuma liberação cadastrada'}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {searchQuery 
                    ? `Sua busca por "${searchQuery}" não retornou resultados.` 
                    : 'Comece adicionando uma nova liberação de material.'}
                </p>
                <div className="mt-6">
                  <button onClick={handleAddClick} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"><PlusIcon className="-ml-1 mr-2 h-5 w-5" />Adicionar Liberação</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
};
