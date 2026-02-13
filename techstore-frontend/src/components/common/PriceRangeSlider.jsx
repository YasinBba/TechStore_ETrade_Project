import React, { useState, useRef, useEffect } from 'react';

const PriceRangeSlider = ({ min = 0, max = 10000, value = [0, 10000], onChange }) => {
    const [localValue, setLocalValue] = useState(value);
    const sliderRef = useRef(null);
    const isDragging = useRef(null);

    // Fix: Use ref to access latest value in event handlers
    const valueRef = useRef(value);

    useEffect(() => {
        valueRef.current = localValue;
    }, [localValue]);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleMouseDown = (thumbIndex) => (e) => {
        e.preventDefault();
        e.stopPropagation(); // Stop propagation
        isDragging.current = thumbIndex;
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleTouchStart = (thumbIndex) => (e) => {
        e.stopPropagation(); // Stop propagation
        isDragging.current = thumbIndex;
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchUp);
    };

    const updateValue = (clientX) => {
        if (!sliderRef.current || isDragging.current === null) return;

        const rect = sliderRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        const newValue = Math.round(min + percent * (max - min));

        setLocalValue(prev => {
            const updated = [...prev];
            updated[isDragging.current] = newValue;

            // Prevent thumbs from crossing
            if (isDragging.current === 0 && newValue >= updated[1]) {
                updated[0] = updated[1] - 100;
            } else if (isDragging.current === 1 && newValue <= updated[0]) {
                updated[1] = updated[0] + 100;
            }

            return updated;
        });
    };

    const handleMouseMove = (e) => {
        updateValue(e.clientX);
    };

    const handleTouchMove = (e) => {
        updateValue(e.touches[0].clientX);
    };

    const handleMouseUp = () => {
        if (isDragging.current !== null) {
            onChange(valueRef.current); // Use ref to get latest value
            isDragging.current = null;
        }
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleTouchUp = () => {
        if (isDragging.current !== null) {
            onChange(valueRef.current); // Use ref to get latest value
            isDragging.current = null;
        }
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchUp);
    };

    const getPercent = (val) => ((val - min) / (max - min)) * 100;

    return (
        <div className="px-1 py-2">
            <div className="flex justify-between mb-2 text-sm text-gray-600">
                <span>{localValue[0].toLocaleString('tr-TR')} ₺</span>
                <span>{localValue[1].toLocaleString('tr-TR')} ₺</span>
            </div>

            <div
                ref={sliderRef}
                className="relative h-2 bg-gray-200 rounded-full cursor-pointer"
            >
                {/* Track highlight */}
                <div
                    className="absolute h-full bg-blue-500 rounded-full"
                    style={{
                        left: `${getPercent(localValue[0])}%`,
                        right: `${100 - getPercent(localValue[1])}%`
                    }}
                />

                {/* Min thumb */}
                <div
                    className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full shadow-md cursor-grab active:cursor-grabbing -mt-1.5"
                    style={{ left: `calc(${getPercent(localValue[0])}% - 10px)` }}
                    onMouseDown={handleMouseDown(0)}
                    onTouchStart={handleTouchStart(0)}
                />

                {/* Max thumb */}
                <div
                    className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full shadow-md cursor-grab active:cursor-grabbing -mt-1.5"
                    style={{ left: `calc(${getPercent(localValue[1])}% - 10px)` }}
                    onMouseDown={handleMouseDown(1)}
                    onTouchStart={handleTouchStart(1)}
                />
            </div>
        </div>
    );
};

export default PriceRangeSlider;
