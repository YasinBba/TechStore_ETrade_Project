import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ProgressBar = () => {
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Reset and start
        setVisible(true);
        setProgress(0);

        // Simulate progress
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) return prev;
                return prev + Math.random() * 10;
            });
        }, 100);

        // Finish quickly
        const timeout = setTimeout(() => {
            setProgress(100);
            setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 200);
        }, 500); // Simulate network delay

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [location]);

    if (!visible) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-1 z-[9999]">
            <div
                className="h-full bg-blue-600 transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default ProgressBar;
