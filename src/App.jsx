import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BankPage from "./pages/BankPage";
import CardsPage from "./pages/CardsPage";
import WalletPage from "./pages/WalletPage";

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
      </Routes>
    </Router>
  );
}

export default App;
