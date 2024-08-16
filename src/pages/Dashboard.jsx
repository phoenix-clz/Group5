import { useState } from "react";
import { Line, Pie } from "react-chartjs-2";
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
  ArcElement,
} from "chart.js";
import Sidebar from "../components/Sidebar";
import { DashNavbar } from "../components/DashNavbar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    navigate("/login");
  }

  const [selectedPlatform, setSelectedPlatform] = useState("all");

  // Mock data - replace with actual data from your backend
  const transactions = [
    {
      id: 1,
      amount: 100,
      type: "credit",
      platform: "bank",
      date: "2023-05-01",
      details: "Salary",
    },
    {
      id: 2,
      amount: 50,
      type: "debit",
      platform: "card",
      date: "2023-05-02",
      details: "Groceries",
    },
    {
      id: 3,
      amount: 200,
      type: "credit",
      platform: "wallet",
      date: "2023-05-03",
      details: "Refund",
    },
    // ... more transactions
  ];

  const calculateBalance = (platform) => {
    return transactions
      .filter((t) => t.platform === platform)
      .reduce(
        (acc, transaction) =>
          transaction.type === "credit"
            ? acc + transaction.amount
            : acc - transaction.amount,
        0
      );
  };

  const totalBankBalance = calculateBalance("bank");
  const totalWalletBalance = calculateBalance("wallet");
  const totalBalance = totalBankBalance + totalWalletBalance;

  // Financial health score
  const totalIncome = transactions
    .filter((t) => t.type === "credit")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalExpenditure = transactions
    .filter((t) => t.type === "debit")
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const financialHealthScore =
    ((totalIncome - totalExpenditure) / totalIncome) * 100;

  const financialHealthScoreData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Financial Health Score",
        data: [80, 85, 78, 82, 90, financialHealthScore],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const monthlyData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Income",
        data: [5000, 5500, 5200, 5800, 6000, 5700],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
      },
      {
        label: "Expenditure",
        data: [1000, 1500, 1200, 1800, 2000, 1700],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.1,
      },
    ],
  };

  const pieChartData = {
    labels: ["Bank", "Card", "Wallet", "Cash", "Loan", "Insurance"],
    datasets: [
      {
        data: [300, 50, 100, 200, 150, 100],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const filteredTransactions =
    selectedPlatform === "all"
      ? transactions
      : transactions.filter((t) => t.platform === selectedPlatform);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Navbar */}
        <DashNavbar />

        {/* Dashboard Content */}
        <div className="p-6">
          {/* User Overview Card */}
          <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-semibold">User Overview</h2>
            <p className="mb-2 text-3xl font-bold text-green-600">
              Rs. {totalBalance.toLocaleString()}
            </p>
            <p className="text-gray-600">Total Balance</p>
            <p className="mt-2">
              Financial Health Score:
              <span
                className={
                  financialHealthScore > 70
                    ? "text-green-500"
                    : financialHealthScore > 40
                    ? "text-yellow-500"
                    : "text-red-500"
                }
              >
                {" "}
                {financialHealthScore.toFixed(2)}%
              </span>
            </p>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="mb-4 text-xl font-semibold">
                Financial Health Score
              </h3>
              <Line data={financialHealthScoreData} />
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="mb-4 text-xl font-semibold">
                Platform Distribution
              </h3>
              <Pie data={pieChartData} />
            </div>
          </div>

          {/* Monthly Income & Expenditure */}
          <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-xl font-semibold">
              Monthly Income & Expenditure
            </h3>
            <Line data={monthlyData} />
          </div>

          {/* Transactions Table */}
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
                <option value="cash">Cash</option>
                <option value="loan">Loan</option>
                <option value="insurance">Insurance</option>
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
                          transaction.type === "credit"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {transaction.type === "credit" ? "+" : "-"}$
                        {transaction.amount}
                      </span>
                    </td>
                    <td className="p-2 capitalize">{transaction.type}</td>
                    <td className="p-2 capitalize">{transaction.platform}</td>
                    <td className="p-2">{transaction.date}</td>
                    <td className="p-2">{transaction.details}</td>
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
