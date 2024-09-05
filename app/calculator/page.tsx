// Imports
"use client"
import { useState } from 'react';

// Calculator frontend
export default function Calculator(){
    // JS goes here
    // Create input and result variables
    const [input, setInput] = useState<string>('');
    const [result, setResult] = useState<string | null>(null);

    // Handle updating the input
    const handleInput = (value: string) => {
        setInput(prevInput => prevInput + value);
    };

    // Handle clearing input and result
    const handleClear = () => {
        setInput('');
        setResult(null);
    };

    // Handle the calculation of the mathematical expression
    const handleCalculate = async () => {
        try {
            const response = await fetch('api/calculator', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ expression: input }), 
            });

            // Handle response in case of error
            if (!response.ok) {
                throw new Error('Network response not ok');
            }

            // Parse in result
            const data = await response.json();
            setResult(data.result);
        } catch (error) {   // Error handling
            console.error('Error calculating result:', error);
            setResult('Error');
        };
    }
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-64 p-4 bg-gray-800 rounded shadow-lg">
                {/* Display Area */}
                <div className="mb-4 p-2 bg-gray-900 text-right text-2xl text-white font-mono">
                    {result !== null ? result : input || '0'}
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-4 gap-2">
                    {['7', '8', '9', '/'].map(value => (
                        <button
                            key={value}
                            className="bg-blue-500 text-white p-4 rounded"
                            onClick={() => handleInput(value)}
                        >
                            {value}
                        </button>
                    ))}
                    {['4', '5', '6', '*'].map(value => (
                        <button
                            key={value}
                            className="bg-blue-500 text-white p-4 rounded"
                            onClick={() => handleInput(value)}
                        >
                            {value}
                        </button>
                    ))}
                    {['1', '2', '3', '-'].map(value => (
                        <button
                            key={value}
                            className="bg-blue-500 text-white p-4 rounded"
                            onClick={() => handleInput(value)}
                        >
                            {value}
                        </button>
                    ))}
                    {['0', '.', '=', '+'].map(value => (
                        <button
                            key={value}
                            className="bg-blue-500 text-white p-4 rounded"
                            onClick={() => (value === '=' ? handleCalculate() : handleInput(value))}
                        >
                            {value}
                        </button>
                    ))}
                    {/* Clear Button */}
                    <button
                        className="col-span-4 bg-red-500 text-white p-4 rounded"
                        onClick={handleClear}
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
}