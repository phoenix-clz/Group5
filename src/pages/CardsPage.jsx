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
import {
  PlusCircleIcon,
  MinusCircleIcon,
  BellIcon,
} from "@heroicons/react/24/solid";
import Sidebar from "../components/Sidebar";
import { DashNavbar } from "../components/DashNavbar";
import { db } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
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

const CardsPage = () => {
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [banks, setBanks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [newCardDetails, setNewCardDetails] = useState({
    bank: "",
    number: "",
    expiryDate: "",
  });

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
      fetchCards();
      fetchBanks();
      fetchTransactions();
    }
  }, [user]);

  const fetchCards = async () => {
    if (!user || !user.uid) return;
    const cardsCollection = collection(db, "cards");
    const q = query(cardsCollection, where("userId", "==", user.uid));
    const cardsSnapshot = await getDocs(q);
    const cardsList = cardsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCards(cardsList);
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

  const fetchTransactions = async () => {
    if (!user || !user.uid) return;
    const transactionsCollection = collection(db, "transactions");
    const q = query(
      transactionsCollection,
      where("userId", "==", user.uid),
      where("platform", "==", "cards")
    );
    const transactionsSnapshot = await getDocs(q);
    const transactionsList = transactionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTransactions(transactionsList);
  };

  const pieChartData = {
    labels: cards
      .filter((card) => card.linked)
      .map((card) => `${card.bankName} (*${card.number.slice(-4)})`),
    datasets: [
      {
        data: cards
          .filter((card) => card.linked)
          .map((card) => {
            return transactions
              .filter((t) => t.subPlatform.includes(card.number.slice(-4)))
              .reduce((sum, t) => sum + t.amount, 0);
          }),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#4BC0C0",
          "#9966FF",
          "#FF6384",
          "#36A2EB",
        ],
      },
    ],
  };

  const barChartData = {
    labels: cards
      .filter((card) => card.linked)
      .map((card) => `${card.bankName} (*${card.number.slice(-4)})`),
    datasets: [
      {
        label: "Total Spent",
        data: cards
          .filter((card) => card.linked)
          .map((card) => {
            return transactions
              .filter((t) => t.subPlatform.includes(card.number.slice(-4)))
              .reduce((sum, t) => sum + t.amount, 0);
          }),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#4BC0C0",
          "#9966FF",
          "#FF6384",
          "#36A2EB",
        ],
      },
    ],
  };

  const toggleCardLink = async (cardId) => {
    const cardRef = doc(db, "cards", cardId);
    const card = cards.find((c) => c.id === cardId);
    await updateDoc(cardRef, { linked: !card.linked });
    fetchCards();
  };

  const addNewCard = async () => {
    if (
      newCardDetails.bank &&
      newCardDetails.number &&
      newCardDetails.expiryDate &&
      user &&
      user.uid
    ) {
      const selectedBank = banks.find(
        (bank) => bank.id === newCardDetails.bank
      );
      const newCard = {
        ...newCardDetails,
        bankName: selectedBank.name,
        cardholderName: user.displayName || "User", // Fallback to "User" if displayName is not set
        linked: true,
        userId: user.uid,
      };
      await addDoc(collection(db, "cards"), newCard);
      fetchCards();
      setNewCardDetails({
        bank: "",
        number: "",
        expiryDate: "",
      });
    }
  };

  const removeCard = async (cardId) => {
    await deleteDoc(doc(db, "cards", cardId));
    fetchCards();
  };

  const getExpiringCards = () => {
    const today = new Date();
    const fifteenDaysLater = new Date(today.setDate(today.getDate() + 15));
    return cards.filter((card) => {
      const [month, year] = card.expiryDate.split("/");
      const expiryDate = new Date(parseInt(`20${year}`), parseInt(month) - 1);
      return expiryDate <= fifteenDaysLater;
    });
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
              <h1 className="mb-6 text-3xl font-bold">Your Cards Dashboard</h1>

              {/* Notifications */}
              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Notifications</h2>
                <div className="p-4 bg-yellow-100 rounded-lg">
                  <div className="flex items-center">
                    <BellIcon className="w-6 h-6 mr-2 text-yellow-600" />
                    <span className="font-semibold text-yellow-800">
                      Expiring Cards:
                    </span>
                  </div>
                  <ul className="mt-2 list-disc list-inside">
                    {getExpiringCards().map((card) => (
                      <li key={card.id} className="text-yellow-800">
                        {card.bankName} card ending in {card.number.slice(-4)}{" "}
                        expires on {card.expiryDate}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Details */}
              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Your Cards</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className="p-4 bg-white rounded-lg shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold">
                          {card.bankName}
                        </h3>
                        <button
                          onClick={() => toggleCardLink(card.id)}
                          className={`p-1 rounded Rs. {
                        card.linked
                          ? "bg-red-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                        >
                          {card.linked ? (
                            <MinusCircleIcon className="w-6 h-6" />
                          ) : (
                            <PlusCircleIcon className="w-6 h-6" />
                          )}
                        </button>
                      </div>
                      <p className="mb-1 text-gray-600">{card.number}</p>
                      <p className="mb-1 text-gray-600">
                        {card.cardholderName}
                      </p>
                      <p className="mb-2 text-gray-600">
                        Expires: {card.expiryDate}
                      </p>
                      <p className="mb-2 text-sm text-gray-500">
                        {card.linked ? "Linked" : "Unlinked"}
                      </p>
                      <button
                        onClick={() => removeCard(card.id)}
                        className="px-2 py-1 text-sm text-white bg-red-500 rounded"
                      >
                        Remove Card
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Card */}
              <div className="mb-8">
                <h2 className="mb-4 text-2xl font-bold">Add New Card</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <select
                    value={newCardDetails.bank}
                    onChange={(e) =>
                      setNewCardDetails({
                        ...newCardDetails,
                        bank: e.target.value,
                      })
                    }
                    className="p-2 border rounded"
                  >
                    <option value="">Select Bank</option>
                    {banks.map((bank) => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={newCardDetails.number}
                    onChange={(e) =>
                      setNewCardDetails({
                        ...newCardDetails,
                        number: e.target.value,
                      })
                    }
                    placeholder="Card Number"
                    className="p-2 border rounded"
                  />
                  <input
                    type="text"
                    value={newCardDetails.expiryDate}
                    onChange={(e) =>
                      setNewCardDetails({
                        ...newCardDetails,
                        expiryDate: e.target.value,
                      })
                    }
                    placeholder="Expiry Date (MM/YY)"
                    className="p-2 border rounded"
                  />
                </div>
                <button
                  onClick={addNewCard}
                  className="px-4 py-2 mt-4 text-white bg-green-500 rounded"
                >
                  Add Card
                </button>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-2">
                <div>
                  <h2 className="mb-4 text-2xl font-bold">
                    Card Usage Distribution
                  </h2>
                  <div style={{ width: "100%", height: "300px" }}>
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
                    Total Spent by Card
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

export default CardsPage;
