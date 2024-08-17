import FadeIn from "./Animation"; // Custom animation component

const InvestmentSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container  px-4 mx-auto">
        <FadeIn direction="down">
          <h2 className="mb-4 text-3xl font-bold text-center text-gray-800">Explore Investment Opportunities</h2>
        </FadeIn>
        <FadeIn>
        <p className="mb-10 text-center text-gray-600">
            Discover diverse investment options tailored to your financial goals.
          </p>
        </FadeIn>

        <div className="grid gap-8 md:grid-cols-3">
          <FadeIn direction="up" delay={0.2}>
            <div className="p-6 text-center bg-blue-100 rounded-lg shadow-md">
              <h3 className="mb-2 text-2xl font-semibold text-blue-800">Stocks</h3>
              <p className="text-gray-700">
                Invest in shares of popular companies and watch your portfolio grow over time.
              </p>
            </div>
          </FadeIn>
          <FadeIn direction="up" delay={0.4}>
            <div className="p-6 text-center bg-green-100 rounded-lg shadow-md">
              <h3 className="mb-2 text-2xl font-semibold text-green-800">Real Estate</h3>
              <p className="text-gray-700">
                Explore rental properties and real estate investment trusts (REITs) for steady income.
              </p>
            </div>
          </FadeIn>
          <FadeIn direction="up" delay={0.6}>
            <div className="p-6 text-center bg-yellow-100 rounded-lg shadow-md">
              <h3 className="mb-2 text-2xl font-semibold text-yellow-800">Bonds</h3>
              <p className="text-gray-700">
                Secure your future with government and corporate bonds for fixed returns.
              </p>
            </div>
          </FadeIn>
        </div>

        <FadeIn direction="down" delay={0.8}>
          <div className="mt-10 text-center">
            <h3 className="mb-4 text-2xl font-semibold text-gray-800">Start Investing Today!</h3>
            <p className="text-gray-600 mb-6">Join thousands of satisfied investors like you.</p>
            <button className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
              Get Started
            </button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default InvestmentSection;