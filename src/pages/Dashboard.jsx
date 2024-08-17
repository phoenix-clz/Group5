import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Sidebar from "../components/Sidebar";
import { DashNavbar } from "../components/DashNavbar";
import { db } from "../firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    navigate("/login");
  }

  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [advice, setAdvice] = useState("");
  const [userData, setUserData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [monthlyData, setMonthlyData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const generatePDF = () => {
    const doc = new jsPDF();

    const safeGet = (obj, path, defaultValue = "N/A") => {
      return (
        path.split(".").reduce((acc, part) => acc && acc[part], obj) ??
        defaultValue
      );
    };

    const formatCurrency = (value) => {
      if (typeof value === "number") {
        return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
      }
      return "N/A";
    };

    doc.setFontSize(20);
    doc.text("Comprehensive Financial Report", 105, 15, null, null, "center");

    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 25);
    doc.text(`For: ${safeGet(user, "displayName", "User")}`, 20, 32);

    let yPos = 45;

    doc.setFontSize(16);
    doc.text("Financial Overview", 20, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.text(`Total Balance: Rs. ${formatCurrency(totalBalance)}`, 30, yPos);
    yPos += 7;
    doc.text(`Financial Health Score: ${financialHealthScore}`, 30, yPos);
    yPos += 7;
    doc.text(`Total Banks: ${safeGet(userData, "banks.length", 0)}`, 30, yPos);
    yPos += 7;
    doc.text(`Total Cards: ${safeGet(userData, "cards.length", 0)}`, 30, yPos);
    yPos += 7;
    doc.text(
      `Total Wallets: ${safeGet(userData, "wallets.length", 0)}`,
      30,
      yPos
    );
    yPos += 7;
    doc.text(`Total Loans: ${safeGet(userData, "loans.length", 0)}`, 30, yPos);
    yPos += 7;
    doc.text(
      `Total Insurances: ${safeGet(userData, "insurances.length", 0)}`,
      30,
      yPos
    );
    yPos += 15;

    // Add sections for banks, cards, wallets, loans, and insurances here
    // Similar to the previous version, but use formatCurrency for amounts

    // Transactions History
    doc.addPage();
    doc.setFontSize(16);
    doc.text("Transaction History", 20, 20);

    const transactionData = transactions.map((t) => [
      `Rs. ${formatCurrency(t.amount)}`,
      safeGet(t, "type"),
      safeGet(t, "platform"),
      safeGet(t, "date"),
      safeGet(t, "details"),
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["Amount", "Type", "Platform", "Date", "Details"]],
      body: transactionData,
    });

    // Financial Advice
    doc.addPage();
    doc.setFontSize(16);
    doc.text("Personalized Financial Advice", 20, 20);

    doc.setFontSize(12);
    const adviceLines = doc.splitTextToSize(
      advice || "No advice available at this time.",
      170
    );
    doc.text(adviceLines, 20, 30);

    doc.save("comprehensive_financial_report.pdf");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userDataObj = {
          banks: [],
          cards: [],
          insurances: [],
          loans: [],
          wallets: [],
        };

        const collections = [
          "banks",
          "cards",
          "insurances",
          "loans",
          "wallets",
        ];

        for (const collectionName of collections) {
          const q = query(
            collection(db, collectionName),
            where("userId", "==", user.uid)
          );
          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            userDataObj[collectionName].push({ id: doc.id, ...doc.data() });
          });
        }

        setUserData(userDataObj);

        // Fetch transactions
        const transactionsQuery = query(
          collection(db, "transactions"),
          where("userId", "==", user.uid)
        );
        const transactionsSnapshot = await getDocs(transactionsQuery);
        const transactionsData = transactionsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTransactions(transactionsData);
      }
    };

    fetchUserData();
  }, [user]);

  const calculateTotalBalance = () => {
    if (!userData) return 0;
    const bankBalance = userData.banks.reduce(
      (sum, bank) => sum + bank.balance,
      0
    );
    const walletBalance = userData.wallets.reduce(
      (sum, wallet) => sum + wallet.balance,
      0
    );
    return bankBalance + walletBalance;
  };

  const calculateFinancialHealthScore = () => {
    if (!transactions.length) return 0;

    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);

    if (totalIncome === 0) return "Poor";

    const score = ((totalIncome - totalExpense) / totalIncome) * 100;

    return score < 0 ? "Poor" : score.toFixed(2);
  };

  const calculateExpenditureHabit = () => {
    if (!transactions.length) return "No transaction data available";

    const expenses = transactions.filter((t) => t.type === "expense");
    const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

    // Group expenses by platform
    const platformExpenses = expenses.reduce((acc, t) => {
      acc[t.platform] = (acc[t.platform] || 0) + t.amount;
      return acc;
    }, {});

    // Calculate percentages and sort by highest expense
    const habitAnalysis = Object.entries(platformExpenses)
      .map(([platform, amount]) => ({
        platform,
        percentage: ((amount / totalExpense) * 100).toFixed(2),
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);

    const topExpenses = habitAnalysis.slice(0, 3);

    let recommendation = "Based on your spending habits:\n";
    topExpenses.forEach((expense) => {
      recommendation += `- You spend ${expense.percentage}% on ${expense.platform}. `;
      if (parseFloat(expense.percentage) > 30) {
        recommendation += `Consider reducing expenses in this category.\n`;
      } else if (parseFloat(expense.percentage) < 10) {
        recommendation += `This seems well-managed.\n`;
      } else {
        recommendation += `This is a moderate expense.\n`;
      }
    });

    return recommendation;
  };

  const getMonthlyData = (month) => {
    const [year, monthIndex] = month.split("-");
    const startDate = new Date(year, monthIndex - 1, 1);
    const endDate = new Date(year, monthIndex, 0);

    const dailyIncome = {};
    const dailyExpense = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);
      if (date >= startDate && date <= endDate) {
        const day = date.getDate();
        if (t.type === "income") {
          dailyIncome[day] = (dailyIncome[day] || 0) + t.amount;
        } else {
          dailyExpense[day] = (dailyExpense[day] || 0) + t.amount;
        }
      }
    });

    const labels = Array.from({ length: endDate.getDate() }, (_, i) => i + 1);
    const incomeData = labels.map((day) => dailyIncome[day] || 0);
    const expenseData = labels.map((day) => dailyExpense[day] || 0);

    return {
      labels,
      datasets: [
        {
          label: "Income",
          data: incomeData,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.1,
        },
        {
          label: "Expenditure",
          data: expenseData,
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          tension: 0.1,
        },
      ],
    };
  };

  const totalBalance = calculateTotalBalance();
  const financialHealthScore = calculateFinancialHealthScore();
  const expenditureHabit = calculateExpenditureHabit();

  useEffect(() => {
    if (transactions.length > 0) {
      setMonthlyData(getMonthlyData(selectedMonth));
    }
  }, [transactions, selectedMonth]);

  const getFinancialAdvice = async () => {
    try {
      const userFinancialData = {
        totalBalance,
        financialHealthScore,
        userData,
      };

      const response = await fetch(
        "http://localhost:3001/api/get-financial-advice",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userFinancialData),
        }
      );

      const data = await response.json();
      setAdvice(data.advice);
    } catch (error) {
      console.error("Error fetching financial advice:", error);
    }
  };

  useEffect(() => {
    if (userData) {
      getFinancialAdvice();
    }
  }, [userData]);

  const filteredTransactions =
    selectedPlatform === "all"
      ? transactions
      : transactions.filter((t) => t.platform === selectedPlatform);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <DashNavbar />
        <div className="p-6">
          <div className="p-6 mb-6 bg-white rounded-lg shadow-md ">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-semibold">User Overview</h2>
              <button
                onClick={generatePDF}
                className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Generate Report
              </button>
            </div>
            <p className="mb-2 text-3xl font-bold text-green-600">
              Rs. {totalBalance.toLocaleString()}
            </p>
            <p className="text-gray-600">Total Balance</p>
            <p className="mt-2">
              Financial Health Score:
              <span
                className={
                  financialHealthScore === "Poor"
                    ? "text-red-500"
                    : parseFloat(financialHealthScore) > 70
                    ? "text-green-500"
                    : parseFloat(financialHealthScore) > 40
                    ? "text-yellow-500"
                    : "text-red-500"
                }
              >
                {" "}
                {financialHealthScore === "Poor"
                  ? "Poor"
                  : `${financialHealthScore}%`}
              </span>
            </p>
          </div>

          <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-xl font-semibold">Personalized Advice</h3>
            <p className="text-gray-800">{advice || "Loading advice..."}</p>
          </div>

          <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-xl font-semibold">Expenditure Habit</h3>
            <p className="text-gray-800">{expenditureHabit}</p>
          </div>

          <div className="flex-1 p-6 bg-white rounded-lg shadow-md mb-b">
            <h3 className="mb-4 text-xl font-semibold">
              Monthly Income & Expenditure
            </h3>
            <div className="mb-4">
              <label htmlFor="month-filter" className="mr-2">
                Select Month:
              </label>
              <input
                type="month"
                id="month-filter"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-2 py-1 border rounded"
              />
            </div>
            {monthlyData && <Line data={monthlyData} height={80} />}
          </div>

          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-xl font-semibold">Recent Transactions</h3>
            <div className="mb-4">
              <label htmlFor="platform-filter" className="mr-2">
                Filter by Platform:
              </label>
              <select
                id="platform-filter"
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="px-2 py-1 border rounded"
              >
                <option value="all">All</option>
                <option value="bank">Bank</option>
                <option value="card">Card</option>
                <option value="wallet">Wallet</option>
              </select>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Type</th>
                  <th className="p-2 text-left">Platform</th>
                  <th className="p-2 text-left">Date</th>
                  <th className="p-2 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b">
                    <td className="p-2">
                      <span
                        className={
                          transaction.type === "income"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        Rs. {transaction.amount}
                      </span>
                    </td>
                    <td className="p-2 capitalize">{transaction.type}</td>
                    <td className="p-2 capitalize">{transaction.platform}</td>
                    <td className="p-2">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="p-2">{transaction.remarks}</td>
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

export default Dashboard;
