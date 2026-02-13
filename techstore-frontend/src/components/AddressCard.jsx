import React from 'react';
import { Pencil, Trash2, CheckCircle, MapPin, Building, Home } from 'lucide-react';

const AddressCard = ({
    address,
    onSelect,
    selected = false,
    onEdit,
    onDelete,
    onSetDefault,
    selectable = false
}) => {

    // Get icon based on address type
    const getIcon = () => {
        switch (address.addressType) {
            case 'Home': return <Home size={18} />;
            case 'Work': return <Building size={18} />;
            default: return <MapPin size={18} />;
        }
    };

    return (
        <div
            className={`
                relative p-6 rounded-xl border transition-all duration-200 
                ${selectable ? 'cursor-pointer hover:border-blue-400' : ''}
                ${selected
                    ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600 shadow-md'
                    : 'border-gray-200 bg-white hover:shadow-md'}
            `}
            onClick={() => selectable && onSelect && onSelect(address)}
        >
            {/* Selection Indicator */}
            {selectable && selected && (
                <div className="absolute top-4 right-4 text-blue-600">
                    <CheckCircle size={24} fill="currentColor" className="text-white" />
                </div>
            )}

            {/* Default Badge (Only show if not in selection mode or if it adds value) */}
            {address.isDefault && !selected && (
                <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <CheckCircle size={12} className="mr-1" />
                    Varsayılan
                </div>
            )}

            {/* Header */}
            <div className="flex items-start mb-3 pr-8">
                <div className={`p-2 rounded-lg mr-3 ${selected ? 'bg-blue-200 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                    {getIcon()}
                </div>
                <div>
                    <h3 className="font-bold text-gray-800">{address.title}</h3>
                    <p className="text-sm text-gray-500">{address.firstName} {address.lastName}</p>
                </div>
            </div>

            {/* Address Details */}
            <div className="space-y-1 text-sm text-gray-600 mb-4 pl-12">
                <p className="font-medium text-gray-800">{address.phone}</p>
                <p className="line-clamp-2">{address.addressLine1} {address.addressLine2}</p>
                <p>{address.neighborhood}, {address.district}/{address.city}</p>
            </div>

            {/* Actions (Edit/Delete - Only show if provided) */}
            {(onEdit || onDelete || onSetDefault) && (
                <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                    {onSetDefault && !address.isDefault && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onSetDefault(address); }}
                            className="text-xs text-green-600 hover:text-green-800 font-medium px-2 py-1 rounded hover:bg-green-50"
                        >
                            Varsayılan Yap
                        </button>
                    )}

                    {onEdit && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onEdit(address); }}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Düzenle"
                        >
                            <Pencil size={16} />
                        </button>
                    )}

                    {onDelete && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(address); }}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Sil"
                        >
                            <Trash2 size={16} />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default AddressCard;
