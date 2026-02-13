import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const types = {
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-50',
            borderColor: 'border-green-500',
            textColor: 'text-green-800',
            iconColor: 'text-green-500'
        },
        error: {
            icon: XCircle,
            bgColor: 'bg-red-50',
            borderColor: 'border-red-500',
            textColor: 'text-red-800',
            iconColor: 'text-red-500'
        },
        info: {
            icon: Info,
            bgColor: 'bg-blue-50',
            borderColor: 'border-blue-500',
            textColor: 'text-blue-800',
            iconColor: 'text-blue-500'
        }
    };

    const config = types[type] || types.success;
    const Icon = config.icon;

    return (
        <div
            className={`${config.bgColor} ${config.borderColor} border-l-4 p-4 rounded-lg shadow-lg flex items-center justify-between min-w-[300px] max-w-md animate-in slide-in-from-top-5 duration-300`}
        >
            <div className="flex items-center space-x-3">
                <Icon className={config.iconColor} size={24} />
                <p className={`${config.textColor} font-medium`}>{message}</p>
            </div>
            <button
                onClick={onClose}
                className={`${config.textColor} hover:opacity-70 transition-opacity ml-4`}
            >
                <X size={18} />
            </button>
        </div>
    );
};

export default Toast;
