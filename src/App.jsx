import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BankPage from "./pages/BankPage";
import CardsPage from "./pages/CardsPage";
import WalletPage from "./pages/WalletPage";
import LoanPage from "./pages/LoanPage";
import InsurancePage from "./pages/InsurancePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bank" element={<BankPage />} />
        <Route path="/card" element={<CardsPage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/loan" element={<LoanPage />} />
        <Route path="/insurance" element={<InsurancePage />} />
      </Routes>
    </Router>
  );
}

export default App;
