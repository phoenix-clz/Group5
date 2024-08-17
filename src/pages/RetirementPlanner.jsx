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
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
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

const RetirementPlanner = () => {
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    navigate("/login");
  }

  const [retirementPlan, setRetirementPlan] = useState(null);
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [monthlyContribution, setMonthlyContribution] = useState(1000);
  const [currentSavings, setCurrentSavings] = useState(10000);
  const [expectedReturn, setExpectedReturn] = useState(7);
  const [inflationRate, setInflationRate] = useState(2);
  const [desiredMonthlyIncome, setDesiredMonthlyIncome] = useState(50000);
  const [projectionData, setProjectionData] = useState(null);

  useEffect(() => {
    fetchRetirementPlan();
  }, [user]);

  const fetchRetirementPlan = async () => {
    if (user) {
      const q = query(
        collection(db, "retirementPlans"),
        where("userId", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const planData = querySnapshot.docs[0].data();
        setRetirementPlan({ id: querySnapshot.docs[0].id, ...planData });
        setCurrentAge(planData.currentAge);
        setRetirementAge(planData.retirementAge);
        setMonthlyContribution(planData.monthlyContribution);
        setCurrentSavings(planData.currentSavings);
        setExpectedReturn(planData.expectedReturn);
        setInflationRate(planData.inflationRate);
        setDesiredMonthlyIncome(planData.desiredMonthlyIncome);
      }
    }
  };

  const saveRetirementPlan = async () => {
    const planData = {
      userId: user.uid,
      currentAge,
      retirementAge,
      monthlyContribution,
      currentSavings,
      expectedReturn,
      inflationRate,
      desiredMonthlyIncome,
    };

    if (retirementPlan) {
      await updateDoc(doc(db, "retirementPlans", retirementPlan.id), planData);
    } else {
      await addDoc(collection(db, "retirementPlans"), planData);
    }

    fetchRetirementPlan();
  };

  const calculateProjection = () => {
    const yearsUntilRetirement = retirementAge - currentAge;
    const monthsUntilRetirement = yearsUntilRetirement * 12;
    const monthlyReturnRate = expectedReturn / 100 / 12;
    const monthlyInflationRate = inflationRate / 100 / 12;

    let balance = currentSavings;
    const projectionData = [];

    for (let month = 0; month <= monthsUntilRetirement; month++) {
      const year = currentAge + month / 12;
      balance = balance * (1 + monthlyReturnRate) + monthlyContribution;
      const inflationAdjustedBalance = balance / Math.pow(1 + monthlyInflationRate, month);
      projectionData.push({ year, balance, inflationAdjustedBalance });
    }

    setProjectionData(projectionData);

    const finalBalance = projectionData[projectionData.length - 1].balance;
    const inflationAdjustedFinalBalance = projectionData[projectionData.length - 1].inflationAdjustedBalance;
    const monthlyIncomeFromSavings = (finalBalance * (expectedReturn / 100 / 12)) / (1 - Math.pow(1 + (expectedReturn / 100 / 12), -yearsUntilRetirement * 12));
    const inflationAdjustedMonthlyIncome = monthlyIncomeFromSavings / Math.pow(1 + monthlyInflationRate, monthsUntilRetirement);

    return {
      finalBalance,
      inflationAdjustedFinalBalance,
      monthlyIncomeFromSavings,
      inflationAdjustedMonthlyIncome,
    };
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const projection = calculateProjection();

    doc.setFontSize(20);
    doc.text("Retirement Plan Report", 105, 15, null, null, "center");

    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 25);
    doc.text(`For: ${user.displayName || "User"}`, 20, 32);

    let yPos = 45;

    doc.setFontSize(16);
    doc.text("Retirement Plan Details", 20, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.text(`Current Age: ${currentAge}`, 30, yPos); yPos += 7;
    doc.text(`Retirement Age: ${retirementAge}`, 30, yPos); yPos += 7;
    doc.text(`Monthly Contribution: Rs. ${monthlyContribution.toLocaleString()}`, 30, yPos); yPos += 7;
    doc.text(`Current Savings: Rs. ${currentSavings.toLocaleString()}`, 30, yPos); yPos += 7;
    doc.text(`Expected Annual Return: ${expectedReturn}%`, 30, yPos); yPos += 7;
    doc.text(`Inflation Rate: ${inflationRate}%`, 30, yPos); yPos += 7;
    doc.text(`Desired Monthly Income: Rs. ${desiredMonthlyIncome.toLocaleString()}`, 30, yPos); yPos += 15;

    doc.setFontSize(16);
    doc.text("Projection Results", 20, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.text(`Estimated Final Balance: Rs. ${projection.finalBalance.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 30, yPos); yPos += 7;
    doc.text(`Inflation-Adjusted Final Balance: Rs. ${projection.inflationAdjustedFinalBalance.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 30, yPos); yPos += 7;
    doc.text(`Estimated Monthly Income: Rs. ${projection.monthlyIncomeFromSavings.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 30, yPos); yPos += 7;
    doc.text(`Inflation-Adjusted Monthly Income: Rs. ${projection.inflationAdjustedMonthlyIncome.toLocaleString(undefined, {maximumFractionDigits: 0})}`, 30, yPos); yPos += 15;

    if (projectionData) {
      const tableData = projectionData.filter((data, index) => index % 12 === 0).map(data => [
        Math.round(data.year),
        data.balance.toLocaleString(undefined, {maximumFractionDigits: 0}),
        data.inflationAdjustedBalance.toLocaleString(undefined, {maximumFractionDigits: 0})
      ]);

      autoTable(doc, {
        startY: yPos,
        head: [["Year", "Projected Balance", "Inflation-Adjusted Balance"]],
        body: tableData,
      });
    }

    doc.save("retirement_plan_report.pdf");
  };

  const chartData = projectionData ? {
    labels: projectionData.filter((data, index) => index % 12 === 0).map(data => Math.round(data.year)),
    datasets: [
      {
        label: "Projected Balance",
        data: projectionData.filter((data, index) => index % 12 === 0).map(data => data.balance),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
      },
      {
        label: "Inflation-Adjusted Balance",
        data: projectionData.filter((data, index) => index % 12 === 0).map(data => data.inflationAdjustedBalance),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.1,
      },
    ],
  } : null;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <DashNavbar />
        <div className="p-6">
          <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-semibold">Retirement Planner</h2>
              <button
                onClick={generatePDF}
                className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Generate Report
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Current Age</label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Retirement Age</label>
                <input
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Monthly Contribution (Rs.)</label>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Current Savings (Rs.)</label>
                <input
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Expected Annual Return (%)</label>
                <input
                  type="number"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Inflation Rate (%)</label>
                <input
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Desired Monthly Income (Rs.)</label>
                <input
                  type="number"
                  value={desiredMonthlyIncome}
                  onChange={(e) => setDesiredMonthlyIncome(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={saveRetirementPlan}
                className="px-4 py-2 mr-2 text-white bg-green-500 rounded hover:bg-green-600"
              >
                Save Plan
              </button>
              <button
                onClick={calculateProjection}
                className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              >
                Calculate Projection
              </button>
            </div>
          </div>

          {projectionData && (
            <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
              <h3 className="mb-4 text-xl font-semibold">Retirement Projection</h3>
              <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                <div>
                  <p className="font-semibold">Estimated Final Balance:</p>
                  <p className="text-2xl text-green-600">
                    Rs. {projectionData[projectionData.length - 1].balance.toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Inflation-Adjusted Final Balance:</p>
                  <p className="text-2xl text-blue-600">
                    Rs. {projectionData[projectionData.length - 1].inflationAdjustedBalance.toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </p>
                </div>
              </div>
              {chartData && <Line data={chartData} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RetirementPlanner;