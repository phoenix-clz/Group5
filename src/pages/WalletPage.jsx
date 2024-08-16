import React, { useState, useEffect } from "react";
import { MinusCircleIcon } from "@heroicons/react/16/solid";
import Sidebar from "../components/Sidebar";
import { DashNavbar } from "../components/DashNavbar";

const WalletPage = () => {
  const [wallets, setWallets] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletBalance, setNewWalletBalance] = useState("");
  const [newWalletPoints, setNewWalletPoints] = useState("");

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    // Replace with your API call
    const mockedWallets = [
      { id: 1, name: "eSewa", balance: 1000, points: 50 },
      { id: 2, name: "Khalti", balance: 500, points: 25 },
      { id: 3, name: "FonePay", balance: 750, points: 30 },
    ];
    setWallets(mockedWallets);
    calculateTotalAmount(mockedWallets);
  };

  const calculateTotalAmount = (wallets) => {
    const total = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
    setTotalAmount(total);
  };

  const addNewWallet = () => {
    if (newWalletName && newWalletBalance) {
      const newWallet = {
        id: wallets.length + 1,
        name: newWalletName,
        balance: parseFloat(newWalletBalance),
        points: parseInt(newWalletPoints) || 0,
      };
      const updatedWallets = [...wallets, newWallet];
      setWallets(updatedWallets);
      calculateTotalAmount(updatedWallets);
      setNewWalletName("");
      setNewWalletBalance("");
      setNewWalletPoints("");
    }
  };

  const removeWallet = (walletId) => {
    const updatedWallets = wallets.filter((wallet) => wallet.id !== walletId);
    setWallets(updatedWallets);
    calculateTotalAmount(updatedWallets);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <DashNavbar />
        <div className="container p-4 mx-auto">
          <h1 className="mb-6 text-3xl font-bold">Your Wallet Dashboard</h1>

          <div className="p-4 mb-8 bg-white rounded-lg shadow">
            <h2 className="mb-2 text-xl font-semibold">Total Balance</h2>
            <p className="text-3xl font-bold text-green-600">
              ${totalAmount.toFixed(2)}
            </p>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">Your Wallets</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {wallets.map((wallet) => (
                <div key={wallet.id} className="p-4 bg-white rounded-lg shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{wallet.name}</h3>
                    <button
                      onClick={() => removeWallet(wallet.id)}
                      className="p-1 text-white bg-red-500 rounded"
                    >
                      <MinusCircleIcon className="w-6 h-6" />
                    </button>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    ${wallet.balance.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Points: {wallet.points}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">Add New Wallet</h2>
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                value={newWalletName}
                onChange={(e) => setNewWalletName(e.target.value)}
                placeholder="Wallet Name"
                className="p-2 border rounded"
              />
              <input
                type="number"
                value={newWalletBalance}
                onChange={(e) => setNewWalletBalance(e.target.value)}
                placeholder="Initial Balance"
                className="p-2 border rounded"
              />
              <input
                type="number"
                value={newWalletPoints}
                onChange={(e) => setNewWalletPoints(e.target.value)}
                placeholder="Initial Points"
                className="p-2 border rounded"
              />
              <button
                onClick={addNewWallet}
                className="px-4 py-2 text-white bg-green-500 rounded"
              >
                Add Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
