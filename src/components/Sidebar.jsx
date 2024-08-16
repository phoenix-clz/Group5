import React, { useState } from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({
    platform: "",
    subPlatform: "",
    amount: "",
    type: "",
    remarks: "",
  });

  const sidebarItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Bank", path: "/bank" },
    { name: "Card", path: "/card" },
    { name: "Wallet", path: "/wallet" },
    { name: "Loan", path: "/loan" },
    { name: "Insurance", path: "/insurance" },
  ];

  const handleNewTransaction = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setTransactionDetails({
      platform: "",
      subPlatform: "",
      amount: "",
      type: "",
      remarks: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransactionDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the transaction details to your backend
    console.log("Transaction submitted:", transactionDetails);
    handleClosePopup();
  };

  return (
    <>
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-800">Smart Paisa</h2>
          <button
            onClick={handleNewTransaction}
            className="w-full py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            New Transaction
          </button>
        </div>
        <nav className="mt-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg w-96">
            <h3 className="mb-4 text-xl font-semibold">New Transaction</h3>
            <form onSubmit={handleSubmit}>
              <select
                name="platform"
                value={transactionDetails.platform}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 border rounded"
                required
              >
                <option value="">Select Platform</option>
                <option value="bank">Bank</option>
                <option value="card">Card</option>
                <option value="wallet">Wallet</option>
                <option value="loan">Loan</option>
                <option value="insurance">Insurance</option>
                <option value="cash">Cash</option>
              </select>

              {transactionDetails.platform &&
                transactionDetails.platform !== "cash" && (
                  <input
                    type="text"
                    name="subPlatform"
                    value={transactionDetails.subPlatform}
                    onChange={handleInputChange}
                    placeholder={`Which Rs. {transactionDetails.platform}?`}
                    className="w-full p-2 mb-2 border rounded"
                    required
                  />
                )}

              <input
                type="number"
                name="amount"
                value={transactionDetails.amount}
                onChange={handleInputChange}
                placeholder="Amount"
                className="w-full p-2 mb-2 border rounded"
                required
              />

              <select
                name="type"
                value={transactionDetails.type}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 border rounded"
                required
              >
                <option value="">Select Type</option>
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>

              <textarea
                name="remarks"
                value={transactionDetails.remarks}
                onChange={handleInputChange}
                placeholder="Remarks"
                className="w-full p-2 mb-2 border rounded"
                required
              ></textarea>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleClosePopup}
                  className="px-4 py-2 mr-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
