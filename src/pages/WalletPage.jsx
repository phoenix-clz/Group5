import React, { useState, useEffect } from "react";
import { PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/16/solid";
import Sidebar from "../components/Sidebar";
import { DashNavbar } from "../components/DashNavbar";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const WalletPage = () => {
  const [wallets, setWallets] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [newWalletName, setNewWalletName] = useState("");
  const [newWalletBalance, setNewWalletBalance] = useState("");
  const [newWalletPoints, setNewWalletPoints] = useState("");
  const [filter, setFilter] = useState("all");
  const [user, setUser] = useState(null);
  const [selectedWalletType, setSelectedWalletType] = useState("esewa");

  const walletTypes = ["esewa", "khalti", "imepay", "phonepay", "other"];

  useEffect(() => {
    if (user && user.uid) {
      fetchWallets();
    }
  }, [user]);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && parsedUser.uid) {
        setUser(parsedUser);
      } else {
        console.error("User object is missing uid");
      }
    }
  }, []);

  const fetchWallets = async () => {
    if (!user || !user.uid) return;
    const walletsCollection = collection(db, "wallets");
    const q = query(walletsCollection, where("userId", "==", user.uid));
    const walletsSnapshot = await getDocs(q);
    const walletsList = walletsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setWallets(walletsList);
    calculateTotalAmount(walletsList);
  };

  const calculateTotalAmount = (wallets) => {
    const total = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
    setTotalAmount(total);
  };

  const addNewWallet = async () => {
    if (newWalletBalance && user && user.uid) {
      const walletName =
        selectedWalletType === "other" ? newWalletName : selectedWalletType;
      if (!walletName) {
        alert("Please enter a wallet name for 'Other' type");
        return;
      }
      const newWallet = {
        name: walletName,
        balance: parseFloat(newWalletBalance),
        points: parseInt(newWalletPoints) || 0,
        userId: user.uid,
      };
      await addDoc(collection(db, "wallets"), newWallet);
      fetchWallets();
      setSelectedWalletType("esewa");
      setNewWalletName("");
      setNewWalletBalance("");
      setNewWalletPoints("");
    } else {
      alert("Please fill in all required fields");
    }
  };

  const removeWallet = async (walletId) => {
    await deleteDoc(doc(db, "wallets", walletId));
    fetchWallets();
  };

  const updateWallet = async (walletId, newData) => {
    const walletRef = doc(db, "wallets", walletId);
    await updateDoc(walletRef, newData);
    fetchWallets();
  };

  const filteredWallets = wallets.filter((wallet) => {
    if (filter === "all") return true;
    if (filter === "high-balance") return wallet.balance >= 500;
    if (filter === "low-balance") return wallet.balance < 500;
    return true;
  });

  const pieChartData = {
    labels: wallets.map((wallet) => wallet.name),
    datasets: [
      {
        data: wallets.map((wallet) => wallet.balance),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  const barChartData = {
    labels: wallets.map((wallet) => wallet.name),
    datasets: [
      {
        label: "Points",
        data: wallets.map((wallet) => wallet.points),
        backgroundColor: "#36A2EB",
      },
    ],
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
            <div className="mb-4">
              <label htmlFor="filter" className="mr-2">
                Filter:
              </label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="all">All Wallets</option>
                <option value="high-balance">High Balance (≥$500)</option>
                <option value="low-balance">Low Balance (&lt;$500)</option>
              </select>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {filteredWallets.map((wallet) => (
                <div key={wallet.id} className="p-4 bg-white rounded-lg shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">
                      {wallet.name.charAt(0).toUpperCase() +
                        wallet.name.slice(1)}
                    </h3>
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
              <select
                value={selectedWalletType}
                onChange={(e) => setSelectedWalletType(e.target.value)}
                className="p-2 border rounded"
              >
                {walletTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              {selectedWalletType === "other" && (
                <input
                  type="text"
                  value={newWalletName}
                  onChange={(e) => setNewWalletName(e.target.value)}
                  placeholder="Custom Wallet Name"
                  className="p-2 border rounded"
                />
              )}
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

          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">Wallet Analytics</h2>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="mb-4 text-xl font-semibold">
                  Balance Distribution
                </h3>
                <div style={{ height: "300px" }}>
                  <Pie
                    data={pieChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="mb-4 text-xl font-semibold">Points by Wallet</h3>
                <div style={{ height: "300px" }}>
                  <Bar
                    data={barChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          beginAtZero: true,
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
