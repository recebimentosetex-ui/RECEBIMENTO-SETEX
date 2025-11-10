import React, { useState, useEffect } from 'react';
import { FiberStatus } from '../types';
import { FIBER_STATUS_OPTIONS } from '../constants';
import { InputField, SelectField } from './common/FormFields';
import { DeleteIcon } from './icons';

export const FiberStockForm = ({ onSubmit, onCancel, initialData, onDelete, ruas }) => {
  const [formData, setFormData] = useState({
    material: '', lote: '', qtd: '', prateleira: '', rua: '',
    sala: '', status: FiberStatus.EmEstoque, sm: '',
  });
  // Fix: Initialize 'errors' state to fix missing 'error' prop issue in child components.
  const [errors, setErrors] = useState<any>({});

  useEffect(() => { if (initialData) setFormData(initialData); }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Fix: Clear errors on change for consistency.
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(initialData ? { ...formData, id: initialData.id } : formData);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
          {initialData ? 'Editar Item do Estoque' : 'Novo Item no Estoque de Fibras'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Material" id="material" value={formData.material} onChange={handleChange} required={false} error={errors.material} />
            <InputField label="Lote" id="lote" value={formData.lote} onChange={handleChange} required={false} error={errors.lote} />
            <InputField label="Quantidade" id="qtd" value={formData.qtd} onChange={handleChange} type="number" required={false} error={errors.qtd} />
            <InputField label="Prateleira" id="prateleira" value={formData.prateleira} onChange={handleChange} required={false} error={errors.prateleira} />
            <SelectField label="Rua" id="rua" value={formData.rua} onChange={handleChange} options={ruas} required={false} error={errors.rua} />
            <InputField label="Sala" id="sala" value={formData.sala} onChange={handleChange} required={false} error={errors.sala} />
            <SelectField label="Status" id="status" value={formData.status} onChange={handleChange} options={FIBER_STATUS_OPTIONS} required={false} error={errors.status} />
            <InputField label="SM" id="sm" value={formData.sm} onChange={handleChange} required={false} error={errors.sm} />
          </div>
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <div>
              {initialData && onDelete && (
                <button
                  type="button"
                  onClick={() => onDelete(initialData.id)}
                  className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                >
                  <DeleteIcon className="-ml-1 mr-2 h-5 w-5" />
                  Excluir
                </button>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button type="button" onClick={onCancel} className="px-6 py-2 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">Cancelar</button>
              <button type="submit" className="inline-flex justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">{initialData ? 'Salvar Alterações' : 'Adicionar Item'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
