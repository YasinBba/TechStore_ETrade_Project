import React from 'react';
import { AlertTriangle, XCircle, Info, CheckCircle } from 'lucide-react';

const ErrorState = ({
    type = 'error',
    title,
    message,
    action,
    actionLabel = 'Tekrar Dene'
}) => {
    const configs = {
        error: {
            icon: XCircle,
            bgColor: 'bg-red-50',
            iconColor: 'text-red-500',
            titleColor: 'text-red-900',
            messageColor: 'text-red-700'
        },
        warning: {
            icon: AlertTriangle,
            bgColor: 'bg-yellow-50',
            iconColor: 'text-yellow-500',
            titleColor: 'text-yellow-900',
            messageColor: 'text-yellow-700'
        },
        info: {
            icon: Info,
            bgColor: 'bg-blue-50',
            iconColor: 'text-blue-500',
            titleColor: 'text-blue-900',
            messageColor: 'text-blue-700'
        },
        success: {
            icon: CheckCircle,
            bgColor: 'bg-green-50',
            iconColor: 'text-green-500',
            titleColor: 'text-green-900',
            messageColor: 'text-green-700'
        }
    };

    const config = configs[type];
    const Icon = config.icon;

    return (
        <div className={`${config.bgColor} border border-${iconColor.replace('text-', '')} rounded-xl p-6 max-w-md mx-auto`}>
            <div className="flex items-start">
                <Icon className={`${config.iconColor} w-6 h-6 mr-3 flex-shrink-0`} />
                <div className="flex-1">
                    {title && (
                        <h3 className={`font-semibold mb-2 ${config.titleColor}`}>
                            {title}
                        </h3>
                    )}
                    {message && (
                        <p className={`text-sm ${config.messageColor} mb-4`}>
                            {message}
                        </p>
                    )}
                    {action && (
                        <button
                            onClick={action}
                            className={`text-sm font-medium ${config.iconColor} hover:underline focus:outline-none`}
                        >
                            {actionLabel}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ErrorState;
