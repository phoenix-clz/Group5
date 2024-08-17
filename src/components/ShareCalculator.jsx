import { useState } from 'react';

const ShareCalculator = () => {
    const [transactionType, setTransactionType] = useState('buy');
    const [shareQuantity, setShareQuantity] = useState("");
    const [sharePrice, setSharePrice] = useState("");
    const [sebonFee, setSebonFee] = useState(0.0001); // Example fee, 0.01%
    const [dpcFee, setDpcFee] = useState(0.0001); // Example fee, 0.01%
    const [nepseCommission, setNepseCommission] = useState(0.0003); // Example fee, 0.03%

    const calculateTotal = () => {
        const quantity = Number(shareQuantity);
        const price = Number(sharePrice);
        // Return 0 if either quantity or price is NaN or 0
        if (isNaN(quantity) || isNaN(price) || quantity <= 0 || price <= 0) {
            return 0;
        }
        const totalCost = quantity * price;
        const totalFees =
            totalCost * sebonFee + totalCost * dpcFee + totalCost * nepseCommission;
        return transactionType === 'buy' ? totalCost + totalFees : totalCost - totalFees;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full mx-auto p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
                <h1 className="text-2xl font-semibold text-center mb-6">Share Calculator</h1>
                <div className="mb-4">
                    <label className="block font-medium mb-2">Transaction Type:</label>
                    <select 
                        value={transactionType} 
                        onChange={(e) => setTransactionType(e.target.value)} 
                        className="w-full p-2 border border-gray-300 rounded"
                    >
                        <option value="buy">Buy</option>
                        <option value="sell">Sell</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block font-medium mb-2">Share Quantity:</label>
                    <input
                        type="number"
                        value={shareQuantity}
                        onChange={(e) => setShareQuantity(e.target.value)} // Keeping it as a string
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-medium mb-2">Share Price:</label>
                    <input
                        type="number"
                        value={sharePrice}
                        onChange={(e) => setSharePrice(e.target.value)} // Keeping it as a string
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mt-4 text-center">
                    <h2 className="text-xl font-semibold">
                        Total Cost: <span className="text-blue-500">{calculateTotal().toFixed(2)} NPR</span>
                    </h2>
                </div>
            </div>
        </div>
    );
};

export default ShareCalculator;