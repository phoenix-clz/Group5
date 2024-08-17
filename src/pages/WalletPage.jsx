import { useState, useEffect, useMemo } from "react";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
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
  const [user, setUser] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [newWalletName, setNewWalletName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedWalletType, setSelectedWalletType] = useState("esewa");

  const walletTypes = ["esewa", "khalti", "imepay", "phonepay", "other"];

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

  useEffect(() => {
    if (user && user.uid) {
      fetchWallets();
      fetchTransactions();
    }
  }, [user]);

  const fetchWallets = async () => {
    try {
      if (!user || !user.uid) return;
      const walletsCollection = collection(db, "wallets");
      const q = query(walletsCollection, where("userId", "==", user.uid));
      const walletsSnapshot = await getDocs(q);
      const walletsList = walletsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched wallets:", walletsList);
      setWallets(walletsList);
    } catch (error) {
      console.error("Error fetching wallets:", error);
    }
  };

  const fetchTransactions = async () => {
    try {
      if (!user || !user.uid) return;
      const transactionsCollection = collection(db, "transactions");
      const q = query(transactionsCollection, where("userId", "==", user.uid));
      const transactionsSnapshot = await getDocs(q);
      const transactionsList = transactionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched transactions:", transactionsList);
      setTransactions(transactionsList);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    if (wallets.length > 0 && transactions.length > 0) {
      calculateBalances();
    }
  }, [wallets, transactions]);

  const calculateBalances = () => {
    const walletBalances = {};
    let totalBalance = 0;
    let income = 0;
    let expenses = 0;

    transactions.forEach((t) => {
      if (t.platform === "wallets") {
        const walletName = t.subPlatform;
        if (!walletBalances[walletName]) {
          walletBalances[walletName] = 0;
        }
        if (t.type === "income") {
          walletBalances[walletName] += t.amount;
          totalBalance += t.amount;
          income += t.amount;
        } else if (t.type === "expense") {
          walletBalances[walletName] -= t.amount;
          totalBalance -= t.amount;
          expenses += t.amount;
        }
      }
    });

    const updatedWallets = wallets.map((wallet) => ({
      ...wallet,
      balance: walletBalances[wallet.name] || wallet.balance || 0,
    }));

    setWallets(updatedWallets);
    setTotalAmount(totalBalance);
    setTotalIncome(income);
    setTotalExpenses(expenses);
  };

  const toggleWalletLink = async (walletId, isLinked) => {
    try {
      const walletRef = doc(db, "wallets", walletId);
      await updateDoc(walletRef, { linked: !isLinked });
      fetchWallets();
    } catch (error) {
      console.error("Error toggling wallet link:", error);
    }
  };

  const addNewWallet = async () => {
    if (user && user.uid) {
      const walletName =
        selectedWalletType === "other"
          ? prompt("Enter custom wallet name:")
          : selectedWalletType;
      if (walletName) {
        await addDoc(collection(db, "wallets"), {
          userId: user.uid,
          name: walletName,
          linked: true,
          balance: 0,
        });
        fetchWallets();
        setNewWalletName("");
        setSelectedWalletType("esewa");
      }
    } else {
      console.error("Missing required data for adding a new wallet");
    }
  };

  const removeWallet = async (walletId) => {
    if (window.confirm("Are you sure you want to remove this wallet?")) {
      await deleteDoc(doc(db, "wallets", walletId));
      fetchWallets();
    }
  };

  const pieChartData = useMemo(() => {
    return {
      labels: wallets
        .filter((wallet) => wallet.linked)
        .map((wallet) => wallet.name),
      datasets: [
        {
          data: wallets
            .filter((wallet) => wallet.linked)
            .map((wallet) => wallet.balance),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
          ],
        },
      ],
    };
  }, [wallets]);

  const barChartData = useMemo(() => {
    return {
      labels: ["Income", "Expenses"],
      datasets: [
        {
          label: "Amount",
          data: [totalIncome, totalExpenses],
          backgroundColor: ["#36A2EB", "#FF6384"],
        },
      ],
    };
  }, [totalIncome, totalExpenses]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 md:flex-row">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <DashNavbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          <div className="container px-6 py-8 mx-auto">
            <div className="container p-4 mx-auto">
              <h1 className="mb-6 text-3xl font-bold">Your Wallet Dashboard</h1>

              <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-4">
                <div className="col-span-1 p-4 bg-white rounded-lg shadow md:col-span-2">
                  <h2 className="mb-2 text-xl font-semibold">Total Balance</h2>
                  <p className="text-3xl font-bold text-green-600">
                    Rs. {totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Wallet Details</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {wallets.map((wallet) => (
                    <div
                      key={wallet.id}
                      className="p-4 bg-white rounded-lg shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold">{wallet.name}</h3>
                        <button
                          onClick={() =>
                            toggleWalletLink(wallet.id, wallet.linked)
                          }
                          className={`p-1 rounded ${
                            wallet.linked
                              ? "bg-red-500 text-white"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {wallet.linked ? (
                            <MinusCircleIcon className="w-6 h-6" />
                          ) : (
                            <PlusCircleIcon className="w-6 h-6" />
                          )}
                        </button>
                      </div>
                      <p
                        className={`text-2xl font-bold ${
                          wallet.linked ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        Rs. {wallet.balance.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {wallet.linked ? "Linked" : "Unlinked"}
                      </p>
                      <button
                        onClick={() => removeWallet(wallet.id)}
                        className="px-2 py-1 mt-2 text-sm text-white bg-red-500 rounded"
                      >
                        Remove Wallet
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Add New Wallet</h2>
                <div className="flex gap-4">
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
                  <button
                    onClick={addNewWallet}
                    className="px-4 py-2 text-white bg-green-500 rounded"
                  >
                    Add Wallet
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
                <div>
                  <h2 className="mb-4 text-2xl font-bold">
                    Wallet Distribution
                  </h2>
                  <div style={{ width: "300px", height: "300px" }}>
                    <Pie
                      data={pieChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h2 className="mb-4 text-2xl font-bold">
                    Income vs Expenses
                  </h2>
                  <Bar data={barChartData} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default WalletPage;
