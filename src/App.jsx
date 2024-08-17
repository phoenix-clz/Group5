import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BankPage from "./pages/BankPage";
import CardsPage from "./pages/CardsPage";
import WalletPage from "./pages/WalletPage";
import LoanPage from "./pages/LoanPage";
import InsurancePage from "./pages/InsurancePage";
import TransactionsPage from "./pages/TransactionPage";
import RetirementPlanningSimulator from "./pages/RetirementPlanner";
import Calculator from "./pages/Calculator";
import EMICalculator from "./components/EmiCalculator";
import SIPCalculator from "./components/SipCalculator";
import ShareCalculator from "./components/ShareCalculator";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/calculator" element={<Calculator />} />
        <Route path="/calculator/emi" element={<EMICalculator />} />
        <Route path="/calculator/sip" element={<SIPCalculator />} />
        <Route path="/calculator/share" element={<ShareCalculator />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bank" element={<BankPage />} />
        <Route path="/card" element={<CardsPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/loan" element={<LoanPage />} />
        <Route path="/insurance" element={<InsurancePage />} />
        <Route path="/transaction" element={<TransactionsPage />} />
        <Route path="/retirement-planner" element={<RetirementPlanningSimulator />} />
      </Routes>
    </Router>
  );
}

export default App;
