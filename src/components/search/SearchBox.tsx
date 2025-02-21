'use client';

import { useState, useEffect } from 'react';

interface SearchBoxProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onSubmit?: () => void;
    disabled?: boolean;
}

interface ApiResponse {
    is_success: boolean;
    list: string[];
}

export function SearchBox({ value, onChange, placeholder, onSubmit }: SearchBoxProps) {
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    useEffect(() => {
        const fetchStockList = async () => {
            try {
                const response = await fetch('/api/quiz/stockList');
                const data: ApiResponse = await response.json();
                if (data.is_success && Array.isArray(data.list)) {
                    setSuggestions(data.list);
                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                console.error('Error fetching stock list:', error);
                setSuggestions([]);
            }
        };

        fetchStockList();
    }, []);

    const handleClear = () => {
        onChange('');
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSubmit?.();
            setShowSuggestions(false);
        }
    };

    // suggestions가 배열인지 확인 후 필터링
    const filteredSuggestions = Array.isArray(suggestions) 
    ? suggestions.filter(suggestion =>
        suggestion?.toLowerCase?.()?.includes?.(value.toLowerCase()) ?? false
      )
    : [];

    return (
        <div className="relative">
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={() => {
                        setTimeout(() => setShowSuggestions(false), 200);
                    }}
                    placeholder={placeholder}
                    className="w-full p-2 pr-10 border rounded"
                />
                {value && (
                    <button
                        onClick={handleClear}
                        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100"
                    >
                        <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
            </div>
            {showSuggestions && value && filteredSuggestions.length > 0 && (
                <div className="absolute w-full bg-white border rounded mt-1 shadow-lg max-h-48 overflow-y-auto">
                    {filteredSuggestions.map((suggestion, index) => (
                        <div
                            key={index}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                onChange(suggestion);
                                setShowSuggestions(false);
                            }}
                        >
                            {suggestion}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}