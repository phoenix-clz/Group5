import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Sidebar from "../components/Sidebar";
import { DashNavbar } from "../components/DashNavbar";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const TransactionsPage = () => {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (user && user.uid) {
        try {
          const transactionsCollection = collection(db, "transactions");
          const q = query(transactionsCollection, where("userId", "==", user.uid));
          const transactionsSnapshot = await getDocs(q);
          const transactionsList = transactionsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp?.toDate() || new Date(),
          }));
          setTransactions(transactionsList);
          setFilteredTransactions(transactionsList);
        } catch (error) {
          console.error("Error fetching transactions:", error);
        }
      }
    };

    if (user) {
      fetchTransactions();
    }
  }, [user]);

  useEffect(() => {
    filterTransactions();
  }, [startDate, endDate, selectedType, selectedPlatform, transactions]);

  const filterTransactions = () => {
    let filtered = transactions;

    if (startDate) {
      filtered = filtered.filter(t => t.timestamp >= startDate);
    }
    if (endDate) {
      filtered = filtered.filter(t => t.timestamp <= endDate);
    }
    if (selectedType !== 'all') {
      filtered = filtered.filter(t => t.type === selectedType);
    }
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(t => t.platform === selectedPlatform);
    }

    setFilteredTransactions(filtered);
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <DashNavbar />
        <div className="container px-4 py-8 mx-auto">
          <h1 className="mb-6 text-3xl font-bold">Transaction History for {user.displayName || user.email}</h1>

          <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-4">
            <div>
              <label className="block mb-2">Start Date:</label>
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">End Date:</label>
              <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block mb-2">Type:</label>
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="all">All Types</option>
                <option value="income">Credit</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">Platform:</label>
              <select
                value={selectedPlatform}
                onChange={e => setSelectedPlatform(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="all">All Platforms</option>
                <option value="bank">Bank</option>
                <option value="wallet">Wallet</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Platform</th>
                  <th className="px-4 py-2">Sub-Platform</th>
                  <th className="px-4 py-2">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className={transaction.id % 2 === 0 ? 'bg-gray-100' : ''}>
                    <td className="px-4 py-2">{transaction.timestamp.toLocaleString()}</td>
                    <td className={`px-4 py-2 ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'income' ? '+' : '-'}Rs. {transaction.amount}
                    </td>
                    <td className="px-4 py-2">{transaction.type}</td>
                    <td className="px-4 py-2">{transaction.platform}</td>
                    <td className="px-4 py-2">{transaction.subPlatform?.name || transaction.subPlatform || 'N/A'}</td>
                    <td className="px-4 py-2">{transaction.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;