const FeaturesSection = () => {
    return (
      <section className="py-20 bg-gray-100">
        <div className="container px-4 mx-auto">
          <h2 className="mb-10 text-3xl font-bold text-center">Our Features</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
              <h3 className="mb-4 text-2xl font-semibold">
                Personal Finance Management
              </h3>
              <p className="text-gray-700">
                Store and track all your financial information in one place,
                from bank accounts to investments.
              </p>
            </div>
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
              <h3 className="mb-4 text-2xl font-semibold">Data Analysis</h3>
              <p className="text-gray-700">
                Analyze your spending habits, investment opportunities, and
                receive personalized recommendations.
              </p>
            </div>
            <div className="p-6 text-center bg-white rounded-lg shadow-md">
              <h3 className="mb-4 text-2xl font-semibold">Monthly Reports</h3>
              <p className="text-gray-700">
                Receive monthly and annual financial reports to keep you
                informed and on track.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default FeaturesSection;