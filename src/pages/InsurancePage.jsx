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

const InsurancePage = () => {
  const [user, setUser] = useState(null);
  const [insurances, setInsurances] = useState([]);
  const [totalPremium, setTotalPremium] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [nextPaymentDate, setNextPaymentDate] = useState(null);
  const [nextPaymentAmount, setNextPaymentAmount] = useState(0);
  const [newInsuranceType, setNewInsuranceType] = useState("");
  const [newInsuranceSubtype, setNewInsuranceSubtype] = useState("");
  const [newInsurancePremium, setNewInsurancePremium] = useState("");
  const [newInsuranceTerm, setNewInsuranceTerm] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newInsuranceStartDate, setNewInsuranceStartDate] = useState(
    new Date()
  );
  const [newInsuranceRate, setNewInsuranceRate] = useState("");
  const [upcomingPayments, setUpcomingPayments] = useState([]);

  const findUpcomingPayments = (insurances) => {
    const today = new Date();
    const payments = insurances.map((insurance) => ({
      date: insurance.nextPaymentDate,
      amount: insurance.premium,
      insuranceName: `${
        insuranceTypes.find((type) => type.id === insurance.typeId)?.name ||
        "Unknown"
      } - ${
        insuranceSubtypes[insurance.typeId]?.find(
          (subtype) => subtype.id === insurance.subtypeId
        )?.name || "Unknown"
      }`,
    }));

    // Sort payments by date
    payments.sort((a, b) => a.date - b.date);

    // Filter out past payments
    const upcomingPayments = payments.filter((payment) => payment.date > today);

    setUpcomingPayments(upcomingPayments);
  };

  const insuranceTypes = [
    { id: "life", name: "Life Insurance" },
    { id: "nonlife", name: "Non-Life Insurance" },
  ];

  const insuranceSubtypes = {
    life: [
      { id: "term", name: "Term Life Insurance" },
      { id: "whole", name: "Whole Life Insurance" },
      { id: "endowment", name: "Endowment Insurance" },
      { id: "ulip", name: "Unit Linked Insurance Plan (ULIP)" },
    ],
    nonlife: [
      { id: "health", name: "Health Insurance" },
      { id: "motor", name: "Motor Insurance" },
      { id: "home", name: "Home Insurance" },
      { id: "travel", name: "Travel Insurance" },
      { id: "property", name: "Property Insurance" },
      { id: "liability", name: "Liability Insurance" },
    ],
  };

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
      fetchInsurances();
    }
  }, [user]);

  const addNewInsurance = async () => {
    if (
      newInsuranceType &&
      newInsuranceSubtype &&
      newInsurancePremium &&
      newInsuranceTerm &&
      newInsuranceStartDate &&
      newInsuranceRate &&
      user &&
      user.uid
    ) {
      const premium = parseFloat(newInsurancePremium);
      const termYears = parseInt(newInsuranceTerm);
      const rate = parseFloat(newInsuranceRate);

      const totalReturnAmount = premium * termYears * (1 + rate / 100);

      const newInsurance = {
        typeId: newInsuranceType,
        subtypeId: newInsuranceSubtype,
        premium: premium,
        term: termYears,
        startDate: Timestamp.fromDate(newInsuranceStartDate),
        nextPaymentDate: Timestamp.fromDate(
          new Date(
            newInsuranceStartDate.getFullYear(),
            newInsuranceStartDate.getMonth() + 1,
            newInsuranceStartDate.getDate()
          )
        ),
        maturityDate: Timestamp.fromDate(
          new Date(
            newInsuranceStartDate.getFullYear() + termYears,
            newInsuranceStartDate.getMonth(),
            newInsuranceStartDate.getDate()
          )
        ),
        paidAmount: 0,
        fine: 0,
        userId: user.uid,
        rate: rate,
        totalReturnAmount: totalReturnAmount,
      };

      await addDoc(collection(db, "insurances"), newInsurance);
      fetchInsurances();
      setNewInsuranceType("");
      setNewInsuranceSubtype("");
      setNewInsurancePremium("");
      setNewInsuranceTerm("");
      setNewInsuranceStartDate(new Date());
      setNewInsuranceRate("");
    } else {
      console.error("Missing required data for adding a new insurance");
    }
  };

  const fetchInsurances = async () => {
    if (!user || !user.uid) return;
    const insurancesCollection = collection(db, "insurances");
    const q = query(insurancesCollection, where("userId", "==", user.uid));
    const insurancesSnapshot = await getDocs(q);
    const insurancesList = insurancesSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startDate: data.startDate.toDate(),
        nextPaymentDate: data.nextPaymentDate.toDate(),
        maturityDate: data.maturityDate.toDate(),
      };
    });
    setInsurances(insurancesList);
    calculateTotals(insurancesList);
    findUpcomingPayments(insurancesList);
  };

  const calculateTotals = (insurances) => {
    const totalPremium = insurances.reduce(
      (sum, insurance) => sum + insurance.premium,
      0
    );
    const totalPaid = insurances.reduce(
      (sum, insurance) => sum + insurance.paidAmount,
      0
    );
    setTotalPremium(totalPremium);
    setTotalPaid(totalPaid);
  };

  const findNextPayment = (insurances) => {
    const today = new Date();
    let nextDate = null;
    let nextAmount = 0;

    insurances.forEach((insurance) => {
      const paymentDate = insurance.nextPaymentDate;
      if (!nextDate || paymentDate < nextDate) {
        nextDate = paymentDate;
        nextAmount = insurance.premium;
      }
    });

    setNextPaymentDate(nextDate);
    setNextPaymentAmount(nextAmount);
  };

  const removeInsurance = async (insuranceId) => {
    await deleteDoc(doc(db, "insurances", insuranceId));
    fetchInsurances();
  };

  const pieChartData = {
    labels: insurances.map(
      (insurance) =>
        insuranceTypes.find((type) => type.id === insurance.typeId)?.name ||
        "Unknown"
    ),
    datasets: [
      {
        data: insurances.map((insurance) => insurance.premium),
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
    labels: insurances.map(
      (insurance) =>
        insuranceTypes.find((type) => type.id === insurance.typeId)?.name ||
        "Unknown"
    ),
    datasets: [
      {
        label: "Premium Amount",
        data: insurances.map((insurance) => insurance.premium),
        backgroundColor: "#36A2EB",
      },
      {
        label: "Paid Amount",
        data: insurances.map((insurance) => insurance.paidAmount),
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
              <h1 className="mb-6 text-3xl font-bold">
                Your Insurance Dashboard
              </h1>

              {upcomingPayments.length > 0 && (
                <div className="p-4 mb-6 text-white bg-blue-500 rounded-lg">
                  <h2 className="mb-2 text-xl font-semibold">
                    Upcoming Premium Payments
                  </h2>
                  {upcomingPayments.map((payment, index) => (
                    <div key={index} className="mb-2">
                      <p>{payment.insuranceName}</p>
                      <p>Date: {payment.date.toLocaleDateString()}</p>
                      <p>Amount: Rs. {payment.amount.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-2">
                <div className="p-4 bg-white rounded-lg shadow">
                  <h2 className="mb-2 text-xl font-semibold">
                    Total Premium Amount
                  </h2>
                  <p className="text-3xl font-bold text-blue-600">
                    Rs. {totalPremium.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow">
                  <h2 className="mb-2 text-xl font-semibold">Total Paid</h2>
                  <p className="text-3xl font-bold text-green-600">
                    Rs. {totalPaid.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Insurance Details</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {insurances.map((insurance) => (
                    <div
                      key={insurance.id}
                      className="p-4 bg-white rounded-lg shadow"
                    >
                      <h3 className="mb-2 text-xl font-semibold">
                        {insuranceTypes.find(
                          (type) => type.id === insurance.typeId
                        )?.name || "Unknown"}
                      </h3>
                      <p>
                        Subtype:{" "}
                        {insuranceSubtypes[insurance.typeId]?.find(
                          (subtype) => subtype.id === insurance.subtypeId
                        )?.name || "Unknown"}
                      </p>
                      <p>Premium: Rs. {insurance.premium.toFixed(2)}</p>
                      <p>Paid Amount: Rs. {insurance.paidAmount.toFixed(2)}</p>
                      <p>Term: {insurance.term} years</p>
                      <p>
                        Start Date: {insurance.startDate.toLocaleDateString()}
                      </p>
                      <p>
                        Maturity Date:{" "}
                        {insurance.maturityDate.toLocaleDateString()}
                      </p>
                      <p>
                        Next Payment:{" "}
                        {insurance.nextPaymentDate.toLocaleDateString()}
                      </p>
                      <p>Fine: Rs. {insurance.fine.toFixed(2)}</p>
                      <p>Rate: {insurance.rate}%</p>
                      <p>
                        Total Return Amount: Rs.{" "}
                        {insurance.totalReturnAmount.toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeInsurance(insurance.id)}
                        className="px-2 py-1 mt-2 text-sm text-white bg-red-500 rounded"
                      >
                        Remove Insurance
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Add New Insurance</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <select
                    value={newInsuranceType}
                    onChange={(e) => setNewInsuranceType(e.target.value)}
                    className="p-2 border rounded"
                  >
                    <option value="">Select Insurance Type</option>
                    {insuranceTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={newInsuranceSubtype}
                    onChange={(e) => setNewInsuranceSubtype(e.target.value)}
                    className="p-2 border rounded"
                    disabled={!newInsuranceType}
                  >
                    <option value="">Select Insurance Subtype</option>
                    {newInsuranceType &&
                      insuranceSubtypes[newInsuranceType].map((subtype) => (
                        <option key={subtype.id} value={subtype.id}>
                          {subtype.name}
                        </option>
                      ))}
                  </select>
                  <input
                    type="number"
                    value={newInsurancePremium}
                    onChange={(e) => setNewInsurancePremium(e.target.value)}
                    placeholder="Premium Amount"
                    className="p-2 border rounded"
                  />
                  <input
                    type="number"
                    value={newInsuranceTerm}
                    onChange={(e) => setNewInsuranceTerm(e.target.value)}
                    placeholder="Term (years)"
                    className="p-2 border rounded"
                  />
                  <DatePicker
                    selected={newInsuranceStartDate}
                    onChange={(date) => setNewInsuranceStartDate(date)}
                    className="p-2 border rounded"
                    placeholderText="Start Date"
                  />
                  <input
                    type="number"
                    value={newInsuranceRate}
                    onChange={(e) => setNewInsuranceRate(e.target.value)}
                    placeholder="Rate (%)"
                    className="p-2 border rounded"
                  />
                  <button
                    onClick={addNewInsurance}
                    className="px-4 py-2 text-white bg-green-500 rounded"
                  >
                    Add Insurance
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
                <div>
                  <h2 className="mb-4 text-2xl font-bold">
                    Insurance Overview
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
                    Insurance Comparison
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

export default InsurancePage;
