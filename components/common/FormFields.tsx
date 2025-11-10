import React from 'react';

export const InputField = ({ label, id, value, onChange, error, required = true, type = 'text' }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input type={type} id={id} name={id} value={value} onChange={onChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 dark:text-gray-100" />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
);

export const SelectField = ({ label, id, value, onChange, options, error, required = true }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select id={id} name={id} value={value} onChange={onChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-gray-900 dark:text-gray-100">
            <option value="">Selecione...</option>
            {options.map(opt => {
                const val = typeof opt === 'string' ? opt : opt.value;
                const lab = typeof opt === 'string' ? opt : opt.label;
                return <option key={val} value={val}>{lab}</option>;
            })}
        </select>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
);