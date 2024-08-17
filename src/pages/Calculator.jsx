import { Link } from 'react-router-dom';

const Calculator = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-7xl flex flex-col justify-center items-center p-6">
        <h1 className="text-3xl font-bold text-center mb-8">Calculator Options</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border rounded-lg shadow-md p-4 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-center">EMI Calculator</h2>
            <p className="flex-grow text-gray-600 text-center">Calculate your Equated Monthly Installment for different loan scenarios.</p>
            <Link to="/calculator/emi" className="mt-4">
              <button className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                Go to EMI Calculator
              </button>
            </Link>
          </div>

          <div className="bg-white border rounded-lg shadow-md p-4 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-center">SIP Calculator</h2>
            <p className="flex-grow text-gray-600 text-center">Calculate your potential returns from Systematic Investment Plans.</p>
            <Link to="/calculator/sip" className="mt-4">
              <button className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                Go to SIP Calculator
              </button>
            </Link>
          </div>
          
          <div className="bg-white border rounded-lg shadow-md p-4 flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-center">Share Calculator</h2>
            <p className="flex-grow text-gray-600 text-center">Calculate costs and profits for buying and selling shares.</p>
            <Link to="/calculator/share" className="mt-4">
              <button className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                Go to Share Calculator
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;