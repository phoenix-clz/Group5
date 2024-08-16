import { useState, useEffect } from "react";
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MinusCircleIcon, PlusCircleIcon } from "@heroicons/react/16/solid";
import Sidebar from "../components/Sidebar";
import { Navbar } from "../components/Navbar";

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
  const [banks, setBanks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedBank, setSelectedBank] = useState("all");
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [transactionType, setTransactionType] = useState("all");
  const [newBankName, setNewBankName] = useState("");
  const [newBankBalance, setNewBankBalance] = useState("");

  useEffect(() => {
    fetchBanks();
    fetchTransactions();
  }, []);

  const fetchBanks = async () => {
    // Replace with your API call
    const mockedBanks = [
      { id: 1, name: "Bank A", balance: 5000, linked: true },
      { id: 2, name: "Bank B", balance: 3000, linked: true },
      { id: 3, name: "Bank C", balance: 2000, linked: false },
    ];
    setBanks(mockedBanks);
    calculateTotalAmount(mockedBanks);
  };

  const fetchTransactions = async () => {
    // Replace with your API call
    const mockedTransactions = [
      {
        id: 1,
        bankId: 1,
        amount: 100,
        type: "income",
        description: "Salary",
        date: "2023-05-01",
      },
      {
        id: 2,
        bankId: 1,
        amount: -50,
        type: "expense",
        description: "Groceries",
        date: "2023-05-02",
      },
      {
        id: 3,
        bankId: 2,
        amount: -30,
        type: "expense",
        description: "Restaurant",
        date: "2023-05-03",
      },
      {
        id: 4,
        bankId: 2,
        amount: 200,
        type: "income",
        description: "Freelance",
        date: "2023-05-04",
      },
    ];
    setTransactions(mockedTransactions);
    calculateTotals(mockedTransactions);
  };

  const calculateTotalAmount = (banks) => {
    const total = banks.reduce((sum, bank) => sum + bank.balance, 0);
    setTotalAmount(total);
  };

  const calculateTotals = (transactions) => {
    const income = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = Math.abs(
      transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0)
    );
    setTotalIncome(income);
    setTotalExpenses(expenses);
  };

  const toggleBankLink = (bankId) => {
    const updatedBanks = banks.map((bank) =>
      bank.id === bankId ? { ...bank, linked: !bank.linked } : bank
    );
    setBanks(updatedBanks);
    calculateTotalAmount(updatedBanks);
  };

  const addNewBank = () => {
    if (newBankName && newBankBalance) {
      const newBank = {
        id: banks.length + 1,
        name: newBankName,
        balance: parseFloat(newBankBalance),
        linked: true,
      };
      const updatedBanks = [...banks, newBank];
      setBanks(updatedBanks);
      calculateTotalAmount(updatedBanks);
      setNewBankName("");
      setNewBankBalance("");
    }
  };

  const removeBank = (bankId) => {
    const updatedBanks = banks.filter((bank) => bank.id !== bankId);
    setBanks(updatedBanks);
    calculateTotalAmount(updatedBanks);
  };

  const filteredTransactions = transactions.filter((t) => {
    const bankMatch =
      selectedBank === "all" || t.bankId === parseInt(selectedBank);
    const typeMatch = transactionType === "all" || t.type === transactionType;
    const dateMatch =
      (!startDate || new Date(t.date) >= startDate) &&
      (!endDate || new Date(t.date) <= endDate);
    return bankMatch && typeMatch && dateMatch;
  });

  const pieChartData = {
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

  const barChartData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Amount",
        data: [totalIncome, totalExpenses],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 overflow-y-auto">
        <Navbar />
        <div className="container p-4 mx-auto">
          <h1 className="mb-6 text-3xl font-bold">Your Bank Dashboard</h1>

          <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-4">
            <div className="col-span-1 p-4 bg-white rounded-lg shadow md:col-span-2">
              <h2 className="mb-2 text-xl font-semibold">Total Balance</h2>
              <p className="text-3xl font-bold text-green-600">
                ${totalAmount.toFixed(2)}
              </p>
            </div>
            <div className="col-span-1 p-4 bg-white rounded-lg shadow md:col-span-2">
              <h2 className="mb-2 text-xl font-semibold">Linked Banks</h2>
              <ul>
                {banks
                  .filter((bank) => bank.linked)
                  .map((bank) => (
                    <li key={bank.id} className="mb-1">
                      {bank.name}: ${bank.balance.toFixed(2)}
                    </li>
                  ))}
              </ul>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-4 text-2xl font-bold">Bank Details</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {banks.map((bank) => (
                <div key={bank.id} className="p-4 bg-white rounded-lg shadow">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{bank.name}</h3>
                    <button
                      onClick={() => toggleBankLink(bank.id)}
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
                    ${bank.balance.toFixed(2)}
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
              <input
                type="text"
                value={newBankName}
                onChange={(e) => setNewBankName(e.target.value)}
                placeholder="Bank Name"
                className="p-2 border rounded"
              />
              <input
                type="number"
                value={newBankBalance}
                onChange={(e) => setNewBankBalance(e.target.value)}
                placeholder="Initial Balance"
                className="p-2 border rounded"
              />
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
                {" "}
                {/* Adjust these values as needed */}
                <Pie
                  data={pieChartData}
                  width={300}
                  height={300}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </div>
            <div>
              <h2 className="mb-4 text-2xl font-bold">Income vs Expenses</h2>
              <Bar data={barChartData} />
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold">Transactions</h2>
            <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-4">
              <div>
                <label htmlFor="bankFilter" className="block mb-1">
                  Bank:
                </label>
                <select
                  id="bankFilter"
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="all">All Banks</option>
                  {banks
                    .filter((bank) => bank.linked)
                    .map((bank) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label htmlFor="typeFilter" className="block mb-1">
                  Type:
                </label>
                <select
                  id="typeFilter"
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="all">All Types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Start Date:</label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-1">End Date:</label>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="overflow-hidden bg-white rounded-lg shadow">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Bank
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Description
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {banks.find((b) => b.id === transaction.bankId)?.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {transaction.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.type === "income"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.type}
                        </span>
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap font-medium ${
                          transaction.type === "income"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ${Math.abs(transaction.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankPage;
