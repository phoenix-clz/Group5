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
import Sidebar from "../components/Sidebar";
import { DashNavbar } from "../components/DashNavbar";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const LoanPage = () => {
  const [user, setUser] = useState(null);
  const [loans, setLoans] = useState([]);
  const [banks, setBanks] = useState([]);
  const [totalLoanAmount, setTotalLoanAmount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalRemaining, setTotalRemaining] = useState(0);
  const [nextPaymentDate, setNextPaymentDate] = useState(null);
  const [nextPaymentAmount, setNextPaymentAmount] = useState(0);
  const [newLoanAmount, setNewLoanAmount] = useState("");
  const [newLoanBank, setNewLoanBank] = useState("");
  const [newLoanInterestRate, setNewLoanInterestRate] = useState("");
  const [newLoanTerm, setNewLoanTerm] = useState("");
  const [newLoanStartDate, setNewLoanStartDate] = useState(new Date());
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
      fetchLoans();
      fetchBanks();
    }
  }, [user]);

  const fetchLoans = async () => {
    if (!user || !user.uid) return;
    const loansCollection = collection(db, "loans");
    const q = query(loansCollection, where("userId", "==", user.uid));
    const loansSnapshot = await getDocs(q);
    const loansList = loansSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startDate: data.startDate.toDate(),
        nextPaymentDate: data.nextPaymentDate.toDate(),
      };
    });
    setLoans(loansList);
    calculateTotals(loansList);
    findNextPayment(loansList);
  };

  const fetchBanks = async () => {
    if (!user || !user.uid) return;
    const banksCollection = collection(db, "banks");
    const q = query(banksCollection, where("userId", "==", user.uid));
    const banksSnapshot = await getDocs(q);
    const banksList = banksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBanks(banksList);
  };

  const calculateTotals = (loans) => {
    const total = loans.reduce((sum, loan) => sum + loan.amount, 0);
    const paid = loans.reduce((sum, loan) => sum + loan.paidAmount, 0);
    const remaining = total - paid;
    setTotalLoanAmount(total);
    setTotalPaid(paid);
    setTotalRemaining(remaining);
  };

  const findNextPayment = (loans) => {
    const today = new Date();
    let nextDate = null;
    let nextAmount = 0;

    loans.forEach((loan) => {
      const paymentDate = loan.nextPaymentDate;
      if (!nextDate || paymentDate < nextDate) {
        nextDate = paymentDate;
        nextAmount = loan.monthlyPayment;
      }
    });

    setNextPaymentDate(nextDate);
    setNextPaymentAmount(nextAmount);
  };

  const addNewLoan = async () => {
    if (
      newLoanAmount &&
      newLoanBank &&
      newLoanInterestRate &&
      newLoanTerm &&
      newLoanStartDate &&
      user &&
      user.uid
    ) {
      const amount = parseFloat(newLoanAmount);
      const interestRate = parseFloat(newLoanInterestRate) / 100 / 12; // Monthly interest rate
      const termMonths = parseInt(newLoanTerm) * 12;
      const monthlyPayment =
        (amount * interestRate * Math.pow(1 + interestRate, termMonths)) /
        (Math.pow(1 + interestRate, termMonths) - 1);

      const newLoan = {
        amount: amount,
        bankId: newLoanBank,
        interestRate: parseFloat(newLoanInterestRate),
        term: parseInt(newLoanTerm),
        startDate: Timestamp.fromDate(newLoanStartDate),
        nextPaymentDate: Timestamp.fromDate(
          new Date(
            newLoanStartDate.getFullYear(),
            newLoanStartDate.getMonth() + 1,
            newLoanStartDate.getDate()
          )
        ),
        paidAmount: 0,
        monthlyPayment: monthlyPayment,
        userId: user.uid,
      };

      await addDoc(collection(db, "loans"), newLoan);
      fetchLoans();
      setNewLoanAmount("");
      setNewLoanBank("");
      setNewLoanInterestRate("");
      setNewLoanTerm("");
      setNewLoanStartDate(new Date());
    } else {
      console.error("Missing required data for adding a new loan");
    }
  };

  const removeLoan = async (loanId) => {
    await deleteDoc(doc(db, "loans", loanId));
    fetchLoans();
  };

  const pieChartData = {
    labels: loans.map((loan) => {
      const bank = banks.find((b) => b.id === loan.bankId);
      return bank ? bank.name : "Unknown Bank";
    }),
    datasets: [
      {
        data: loans.map((loan) => loan.amount),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#FF6384",
          "#C9CBCF",
          "#7BC225",
          "#FFA1B5",
        ],
      },
    ],
  };

  const barChartData = {
    labels: loans.map((loan) => {
      const bank = banks.find((b) => b.id === loan.bankId);
      return bank ? bank.name : "Unknown Bank";
    }),
    datasets: [
      {
        label: "Loan Amount",
        data: loans.map((loan) => loan.amount),
        backgroundColor: "#36A2EB",
      },
      {
        label: "Paid Amount",
        data: loans.map((loan) => loan.paidAmount),
        backgroundColor: "#4BC0C0",
      },
    ],
  };

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
              <h1 className="mb-6 text-3xl font-bold">Your Loan Dashboard</h1>

              {nextPaymentDate && (
                <div className="p-4 mb-6 text-white bg-blue-500 rounded-lg">
                  <h2 className="text-xl font-semibold">Next Payment Due</h2>
                  <p>Date: {nextPaymentDate.toLocaleDateString()}</p>
                  <p>Amount: Rs. {nextPaymentAmount.toFixed(2)}</p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
                <div className="p-4 bg-white rounded-lg shadow">
                  <h2 className="mb-2 text-xl font-semibold">
                    Total Loan Amount
                  </h2>
                  <p className="text-3xl font-bold text-red-600">
                    Rs. {totalLoanAmount.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                  <h2 className="mb-2 text-xl font-semibold">Total Paid</h2>
                  <p className="text-3xl font-bold text-green-600">
                    Rs. {totalPaid.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                  <h2 className="mb-2 text-xl font-semibold">
                    Total Remaining
                  </h2>
                  <p className="text-3xl font-bold text-orange-600">
                    Rs. {totalRemaining.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Loan Details</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {loans.map((loan) => {
                    const bank = banks.find((b) => b.id === loan.bankId);
                    return (
                      <div
                        key={loan.id}
                        className="p-4 bg-white rounded-lg shadow"
                      >
                        <h3 className="mb-2 text-xl font-semibold">
                          {bank ? bank.name : "Unknown Bank"}
                        </h3>
                        <p>Loan Amount: Rs. {loan.amount.toFixed(2)}</p>
                        <p>Paid Amount: Rs. {loan.paidAmount.toFixed(2)}</p>
                        <p>
                          Remaining: Rs.{" "}
                          {(loan.amount - loan.paidAmount).toFixed(2)}
                        </p>
                        <p>Interest Rate: {loan.interestRate}%</p>
                        <p>Term: {loan.term} years</p>
                        <p>
                          Monthly Payment: Rs. {loan.monthlyPayment.toFixed(2)}
                        </p>
                        <p>Start Date: {loan.startDate.toLocaleDateString()}</p>
                        <p>
                          Next Payment:{" "}
                          {loan.nextPaymentDate.toLocaleDateString()}
                        </p>
                        <button
                          onClick={() => removeLoan(loan.id)}
                          className="px-2 py-1 mt-2 text-sm text-white bg-red-500 rounded"
                        >
                          Remove Loan
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Add New Loan</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <input
                    type="number"
                    value={newLoanAmount}
                    onChange={(e) => setNewLoanAmount(e.target.value)}
                    placeholder="Loan Amount"
                    className="p-2 border rounded"
                  />
                  <select
                    value={newLoanBank}
                    onChange={(e) => setNewLoanBank(e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="">Select a bank</option>
                    {banks.map((bank) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={newLoanInterestRate}
                    onChange={(e) => setNewLoanInterestRate(e.target.value)}
                    placeholder="Interest Rate (%)"
                    className="p-2 border rounded"
                  />
                  <input
                    type="number"
                    value={newLoanTerm}
                    onChange={(e) => setNewLoanTerm(e.target.value)}
                    placeholder="Loan Term (years)"
                    className="p-2 border rounded"
                  />
                  <DatePicker
                    selected={newLoanStartDate}
                    onChange={(date) => setNewLoanStartDate(date)}
                    className="p-2 border rounded"
                    placeholderText="Start Date"
                  />
                  <button
                    onClick={addNewLoan}
                    className="px-4 py-2 text-white bg-green-500 rounded"
                  >
                    Add Loan
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
                <div>
                  <h2 className="mb-4 text-2xl font-bold">Loan Overview</h2>
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
                  <h2 className="mb-4 text-2xl font-bold">Loan Comparison</h2>
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

export default LoanPage;
