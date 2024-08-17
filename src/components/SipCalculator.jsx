import { useState } from 'react';

const SIPCalculator = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState('');
  const [annualReturn, setAnnualReturn] = useState('');
  const [years, setYears] = useState('');
  const [finalAmount, setFinalAmount] = useState(null);
  const [error, setError] = useState(null);

  const calculateSIP = (monthlyInvestment, annualReturn, years) => {
    const months = years * 12;
    const rate = annualReturn / 100 / 12; // Monthly interest rate

    let futureValue = 0;
    for (let i = 1; i <= months; i++) {
      futureValue = futureValue * (1 + rate) + monthlyInvestment;
    }
    return futureValue;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const investmentAmount = parseFloat(monthlyInvestment);
    const expectedReturn = parseFloat(annualReturn);
    const investmentYears = parseInt(years);

    if (
      isNaN(investmentAmount) ||
      isNaN(expectedReturn) ||
      isNaN(investmentYears) ||
      investmentAmount <= 0 ||
      expectedReturn < 0 ||
      investmentYears <= 0
    ) {
      setError('Please enter valid inputs.');
      setFinalAmount(null);
      return;
    }

    const calculatedAmount = calculateSIP(investmentAmount, expectedReturn, investmentYears);
    setFinalAmount(calculatedAmount.toFixed(2)); // Format to 2 decimal places
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-lg w-full mx-auto p-6 border rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-bold text-center mb-4">SIP Calculator</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="monthlyInvestment" className="block text-gray-700">
              Monthly Investment Amount ($):
            </label>
            <input
              type="number"
              id="monthlyInvestment"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="annualReturn" className="block text-gray-700">
              Expected Annual Return (%):
            </label>
            <input
              type="number"
              id="annualReturn"
              value={annualReturn}
              onChange={(e) => setAnnualReturn(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="years" className="block text-gray-700">
              Investment Period (Years):
            </label>
            <input
              type="number"
              id="years"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Calculate SIP
          </button>
        </form>

        {finalAmount && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Total Amount After Investment:</h3>
            <p className="text-xl font-bold">Rs. {finalAmount}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SIPCalculator;