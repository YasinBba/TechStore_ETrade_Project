import React from 'react';
import { X } from 'lucide-react';

const FilterChip = ({ label, value, onRemove }) => {
    return (
        <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200 hover:bg-blue-200 transition-colors">
            <span>{label}: {value}</span>
            <button
                onClick={onRemove}
                className="hover:bg-blue-300 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${label} filter`}
            >
                <X size={14} />
            </button>
        </div>
    );
};

export default FilterChip;
