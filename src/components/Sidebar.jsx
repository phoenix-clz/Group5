import { Link } from "react-router-dom";

const Sidebar = () => {
  const sidebarItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Bank", path: "/bank" },
    { name: "Card", path: "/card" },
    { name: "Wallet", path: "/wallet" },
    { name: "Loan", path: "/loan" },
    { name: "Insurance", path: "/insurance" },
  ];

  return (
    <>
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-800">Smart Paisa</h2>
        </div>
        <nav className="mt-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
