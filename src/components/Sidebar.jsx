import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  increment,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebase-config";

const Sidebar = ({ isOpen, onClose }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({
    platform: "",
    subPlatform: "",
    amount: "",
    type: "",
    remarks: "",
  });
  const [userPlatforms, setUserPlatforms] = useState({
    banks: [],
    cards: [],
    wallets: [],
    loans: [],
    insurances: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const sidebarItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "My Transactions", path: "/transaction" },
    { name: "Bank", path: "/bank" },
    { name: "Card", path: "/card" },
    { name: "Wallet", path: "/wallet" },
    { name: "Loan", path: "/loan" },
    { name: "Insurance", path: "/insurance" },
    { name: "Retirement Planner", path: "/retirement-planner" },
  ];

  useEffect(() => {
    fetchUserPlatforms();
  }, []);

  const fetchUserPlatforms = async () => {
    //get user from the session storage
    const storedUser = sessionStorage.getItem("user");

    const userId = JSON.parse(storedUser)?.uid;
    const platforms = {};

    for (const platformType of [
      "banks",
      "cards",
      "wallets",
      "loans",
      "insurances",
    ]) {
      const q = query(
        collection(db, platformType),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      platforms[platformType] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }

    setUserPlatforms(platforms);
  };

  const getSubPlatformName = (platform, subPlatformId) => {
    const platformData = userPlatforms[platform];
    const selectedPlatform = platformData.find(
      (item) => item.id === subPlatformId
    );

    switch (platform) {
      case "banks":
      case "wallets":
        return selectedPlatform?.name;
      case "cards":
        return `${
          selectedPlatform?.bankName
        } - **** ${selectedPlatform?.number.slice(-4)}`;
      case "loans":
        return `Loan of $${selectedPlatform?.amount} at ${selectedPlatform?.interestRate}%`;
      case "insurances":
        return `${selectedPlatform?.typeId} Insurance`;
      default:
        return "";
    }
  };

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
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransactionDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    const userId = auth.currentUser.uid;

    try {
      let subPlatformName = transactionDetails.subPlatform;
      if (transactionDetails.platform !== "cash") {
        subPlatformName = getSubPlatformName(
          transactionDetails.platform,
          transactionDetails.subPlatform
        );
      }

      const newTransaction = {
        ...transactionDetails,
        subPlatform: subPlatformName,
        userId,
        amount: parseFloat(transactionDetails.amount),
        date: new Date().toISOString(),
      };

      // Add the transaction to Firestore
      await addDoc(collection(db, "transactions"), newTransaction);

      // Update the balance of the selected platform
      if (transactionDetails.platform !== "cash") {
        const platformRef = doc(
          db,
          transactionDetails.platform,
          transactionDetails.subPlatform
        );
        await updateDoc(platformRef, {
          balance: increment(
            transactionDetails.type === "income"
              ? parseFloat(transactionDetails.amount)
              : -parseFloat(transactionDetails.amount)
          ),
        });
      }

      console.log("Transaction saved successfully");
      handleClosePopup();
      fetchUserPlatforms(); // Refresh the user platforms data
    } catch (error) {
      console.error("Error saving transaction: ", error);
      setError("Failed to save transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSubPlatformOptions = () => {
    if (
      !transactionDetails.platform ||
      transactionDetails.platform === "cash"
    ) {
      return null;
    }

    switch (transactionDetails.platform) {
      case "banks":
        return userPlatforms.banks.map((bank) => (
          <option key={bank.id} value={bank.id}>
            {bank.name} - Balance: ${bank.balance}
          </option>
        ));
      case "cards":
        return userPlatforms.cards.map((card) => (
          <option key={card.id} value={card.id}>
            {card.bankName} - **** {card.number.slice(-4)}
          </option>
        ));
      case "wallets":
        return userPlatforms.wallets.map((wallet) => (
          <option key={wallet.id} value={wallet.id}>
            {wallet.name} - Balance: ${wallet.balance}
          </option>
        ));
      case "loans":
        return userPlatforms.loans.map((loan) => (
          <option key={loan.id} value={loan.id}>
            Loan of ${loan.amount} at {loan.interestRate}% - Next payment: $
            {loan.monthlyPayment.toFixed(2)}
          </option>
        ));
      case "insurances":
        return userPlatforms.insurances.map((insurance) => (
          <option key={insurance.id} value={insurance.id}>
            {insurance.typeId} Insurance - Premium: ${insurance.premium}
          </option>
        ));
      default:
        return null;
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 transition-opacity bg-black opacity-50 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-md overflow-y-auto transition duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-800">
              Smart Paisa
            </h2>
            <button onClick={onClose} className="md:hidden">
              <svg
                className="w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
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
            {error && <p className="mb-4 text-red-500">{error}</p>}
            <form onSubmit={handleSubmit}>
              <select
                name="platform"
                value={transactionDetails.platform}
                onChange={handleInputChange}
                className="w-full p-2 mb-2 border rounded"
                required
              >
                <option value="">Select Platform</option>
                <option value="banks">Bank</option>
                <option value="cards">Card</option>
                <option value="wallets">Wallet</option>
                <option value="loans">Loan</option>
                <option value="insurances">Insurance</option>
                <option value="cash">Cash</option>
              </select>

              {transactionDetails.platform &&
                transactionDetails.platform !== "cash" && (
                  <select
                    name="subPlatform"
                    value={transactionDetails.subPlatform}
                    onChange={handleInputChange}
                    className="w-full p-2 mb-2 border rounded"
                    required
                  >
                    <option value="">
                      Select {transactionDetails.platform}
                    </option>
                    {renderSubPlatformOptions()}
                  </select>
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
                <option value="income">Income</option>
                <option value="expense">Expense</option>
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
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
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
