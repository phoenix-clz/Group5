import { useState, useEffect, useMemo } from "react";
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
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import Sidebar from "../components/Sidebar";
import { DashNavbar } from "../components/DashNavbar";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
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

const BankPage = () => {
  const [user, setUser] = useState(null);
  const [banks, setBanks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [newBankName, setNewBankName] = useState("");
  const [nepaliBanks, setNepaliBanks] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
      fetchBanks();
      fetchTransactions();
    }

    setNepaliBanks([
      "Nepal Rastra Bank",
      "Nepal Bank Limited",
      "Rastriya Banijya Bank",
      "Agricultural Development Bank",
      "Nabil Bank",
      "Nepal Investment Bank",
      "Standard Chartered Bank Nepal",
      "Himalayan Bank",
      "Nepal SBI Bank",
      "Nepal Bangladesh Bank",
      "Everest Bank",
      "Kumari Bank",
      "Laxmi Bank",
      "Siddhartha Bank",
      "Global IME Bank",
      "Citizens Bank International",
      "Prime Commercial Bank",
      "Sunrise Bank",
      "NIC Asia Bank",
      "Machhapuchchhre Bank",
      "NMB Bank",
      "Prabhu Bank",
      "Mega Bank Nepal",
      "Civil Bank",
      "Century Commercial Bank",
      "Sanima Bank",
      "Other",
    ]);
  }, [user]);

  const fetchBanks = async () => {
    try {
      if (!user || !user.uid) return;
      const banksCollection = collection(db, "banks");
      const q = query(banksCollection, where("userId", "==", user.uid));
      const banksSnapshot = await getDocs(q);
      const banksList = banksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Fetched banks:", banksList);
      setBanks(banksList);
    } catch (error) {
      console.error("Error fetching banks:", error);
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
    if (banks.length > 0 && transactions.length > 0) {
      calculateBalances();
    }
  }, [banks, transactions]);

  const calculateBalances = () => {
    const bankBalances = {};
    let totalBalance = 0;
    let income = 0;
    let expenses = 0;

    transactions.forEach((t) => {
      if (t.platform === "banks") {
        const bankName = t.subPlatform;
        if (!bankBalances[bankName]) {
          bankBalances[bankName] = 0;
        }
        if (t.type === "income") {
          bankBalances[bankName] += t.amount;
          totalBalance += t.amount;
          income += t.amount;
        } else if (t.type === "expense") {
          bankBalances[bankName] -= t.amount;
          totalBalance -= t.amount;
          expenses += t.amount;
        }
      }
    });

    const updatedBanks = banks.map((bank) => ({
      ...bank,
      balance: bankBalances[bank.name] || bank.balance || 0,
    }));

    setBanks(updatedBanks);
    setTotalAmount(totalBalance);
    setTotalIncome(income);
    setTotalExpenses(expenses);
  };

  const toggleBankLink = async (bankId, isLinked) => {
    try {
      const bankRef = doc(db, "banks", bankId);
      await updateDoc(bankRef, { linked: !isLinked });
      fetchBanks();
    } catch (error) {
      console.error("Error toggling bank link:", error);
    }
  };

  const addNewBank = async () => {
    if (newBankName && user && user.uid) {
      const bankName =
        newBankName === "Other"
          ? prompt("Enter custom bank name:")
          : newBankName;
      if (bankName) {
        await addDoc(collection(db, "banks"), {
          userId: user.uid,
          name: bankName,
          linked: true,
          balance: 0,
        });
        fetchBanks();
        setNewBankName("");
      }
    } else {
      console.error("Missing required data for adding a new bank");
    }
  };

  const removeBank = async (bankId) => {
    if (window.confirm("Are you sure you want to remove this bank?")) {
      await deleteDoc(doc(db, "banks", bankId));
      fetchBanks();
    }
  };

  const pieChartData = useMemo(() => {
    return {
      labels: banks.filter((bank) => bank.linked).map((bank) => bank.name),
      datasets: [
        {
          data: banks.filter((bank) => bank.linked).map((bank) => bank.balance),
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
  }, [banks]);

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
              <h1 className="mb-6 text-3xl font-bold">Your Bank Dashboard</h1>

              <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-4">
                <div className="col-span-1 p-4 bg-white rounded-lg shadow md:col-span-2">
                  <h2 className="mb-2 text-xl font-semibold">Total Balance</h2>
                  <p className="text-3xl font-bold text-green-600">
                    Rs. {totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Bank Details</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {banks.map((bank) => (
                    <div
                      key={bank.id}
                      className="p-4 bg-white rounded-lg shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold">{bank.name}</h3>
                        <button
                          onClick={() => toggleBankLink(bank.id, bank.linked)}
                          className={`p-1 rounded ${
                            bank.linked
                              ? "bg-red-500 text-white"
                              : "bg-green-500 text-white"
                          }`}
                        >
                          {bank.linked ? (
                            <MinusCircleIcon className="w-6 h-6" />
                          ) : (
                            <PlusCircleIcon className="w-6 h-6" />
                          )}
                        </button>
                      </div>
                      <p
                        className={`text-2xl font-bold ${
                          bank.linked ? "text-green-600" : "text-gray-400"
                        }`}
                      >
                        Rs. {bank.balance.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {bank.linked ? "Linked" : "Unlinked"}
                      </p>
                      <button
                        onClick={() => removeBank(bank.id)}
                        className="px-2 py-1 mt-2 text-sm text-white bg-red-500 rounded"
                      >
                        Remove Bank
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Add New Bank</h2>
                <div className="flex gap-4">
                  <select
                    value={newBankName}
                    onChange={(e) => setNewBankName(e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="">Select a bank</option>
                    {nepaliBanks.map((bank, index) => (
                      <option key={index} value={bank}>
                        {bank}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={addNewBank}
                    className="px-4 py-2 text-white bg-green-500 rounded"
                  >
                    Add Bank
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
                <div>
                  <h2 className="mb-4 text-2xl font-bold">Bank Distribution</h2>
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

export default BankPage;
