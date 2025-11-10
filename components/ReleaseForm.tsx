import React, { useState, useEffect } from 'react';
import { Status } from '../types';
import { STATUS_OPTIONS } from '../constants';
import { InputField, SelectField } from './common/FormFields';
import { DeleteIcon } from './icons';

export const ReleaseForm = ({ onSubmit, onCancel, initialData, onDelete, operadores, ruas, locaisDeEntrega }) => {
  const [formData, setFormData] = useState({
    material: '', operador: '', rua: '', localDeEntrega: '',
    data: new Date().toISOString().split('T')[0], status: Status.Pendente, sm: '',
  });
  // Fix: Explicitly type the 'errors' state to resolve property access errors.
  const [errors, setErrors] = useState<any>({});

  useEffect(() => { if (initialData) setFormData(initialData); }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.material.trim()) newErrors.material = 'Material é obrigatório.';
    if (!formData.operador) newErrors.operador = 'Operador é obrigatório.';
    if (!formData.rua) newErrors.rua = 'Rua é obrigatória.';
    if (!formData.localDeEntrega) newErrors.localDeEntrega = 'Local de Entrega é obrigatório.';
    if (!formData.data) newErrors.data = 'Data é obrigatória.';
    if (!formData.status) newErrors.status = 'Status é obrigatório.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(initialData ? { ...formData, id: initialData.id } : formData);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
          {initialData ? 'Editar Liberação' : 'Nova Liberação de Material'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Material" id="material" value={formData.material} onChange={handleChange} error={errors.material} />
            <SelectField label="Operador" id="operador" value={formData.operador} onChange={handleChange} options={operadores} error={errors.operador} />
            <SelectField label="Rua" id="rua" value={formData.rua} onChange={handleChange} options={ruas} error={errors.rua} />
            <SelectField label="Local de Entrega" id="localDeEntrega" value={formData.localDeEntrega} onChange={handleChange} options={locaisDeEntrega} error={errors.localDeEntrega} />
            <InputField label="Data" id="data" value={formData.data} onChange={handleChange} error={errors.data} type="date" />
            <SelectField label="Status" id="status" value={formData.status} onChange={handleChange} options={STATUS_OPTIONS} error={errors.status} />
            <div className="md:col-span-2">
              <InputField label="SM" id="sm" value={formData.sm} onChange={handleChange} error={errors.sm} required={false} />
            </div>
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
              <button type="submit" className="inline-flex justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">{initialData ? 'Salvar Alterações' : 'Adicionar Liberação'}</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
