import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items = [] }) => {
    const location = useLocation();

    // Default items empty, we can also auto-generate based on path if needed
    // But passed items give more control (e.g. Product Name instead of ID)

    if (items.length === 0) return null;

    return (
        <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                        <Home size={16} className="mr-2" />
                        Ana Sayfa
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index}>
                        <div className="flex items-center">
                            <ChevronRight size={16} className="text-gray-400" />
                            {item.url ? (
                                <Link to={item.url} className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                                    {item.label}
                                </span>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumb;
