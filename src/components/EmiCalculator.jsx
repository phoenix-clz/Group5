import { useState } from 'react';

const EMICalculator = () => {
  const [principal, setPrincipal] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [emi, setEmi] = useState(null);
  const [error, setError] = useState(null);

  const calculateEMI = (principal, rate, tenure) => {
    const monthlyInterestRate = rate / (12 * 100);
    const emi =
      (principal * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, tenure)) /
      (Math.pow(1 + monthlyInterestRate, tenure) - 1);
    return emi;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const principalAmount = parseFloat(principal);
    const annualRate = parseFloat(interestRate);
    const loanTenure = parseInt(tenure);

    if (
      isNaN(principalAmount) ||
      isNaN(annualRate) ||
      isNaN(loanTenure) ||
      principalAmount <= 0 ||
      annualRate < 0 ||
      loanTenure <= 0
    ) {
      setError('Please enter valid inputs.');
      setEmi(null);
      return;
    }

    const calculatedEMI = calculateEMI(principalAmount, annualRate, loanTenure);
    setEmi(calculatedEMI.toFixed(2)); // Format to 2 decimal places
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-lg w-full mx-auto p-4 border rounded-lg shadow-md bg-white">
        <h2 className="text-2xl font-bold text-center mb-4">EMI Calculator</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="principal" className="block text-gray-700">
              Principal Loan Amount ($):
            </label>
            <input
              type="number"
              id="principal"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full p-2 border rounded"
              required
              placeholder="Enter principal amount"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="interestRate" className="block text-gray-700">
              Annual Interest Rate (%):
            </label>
            <input
              type="number"
              id="interestRate"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              className="w-full p-2 border rounded"
              required
              placeholder="Enter interest rate"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="tenure" className="block text-gray-700">
              Loan Tenure (months):
            </label>
            <input
              type="number"
              id="tenure"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              className="w-full p-2 border rounded"
              required
              placeholder="Enter tenure in months"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Calculate EMI
          </button>
        </form>

        {emi && (
          <div className="mt-4 text-center">
            <h3 className="text-lg font-semibold">Your Monthly EMI:</h3>
            <p className="text-xl font-bold">Rs. {emi}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EMICalculator;