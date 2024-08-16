import FadeIn from "../components/Animation";
import PropTypes from 'prop-types';


const HeroSection = ({ handleLogin }) => {
  return (
    <section
      className="relative flex flex-col items-center justify-center h-screen pt-20 bg-blue-200"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1620228885847-9eab2a1adddc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8dGVjaG5vbG9neSUyMG1vbmV5fGVufDB8fDB8fHww")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-80"></div>
      <FadeIn direction="down">
        <h1 className="text-5xl font-extrabold text-white z-10">
          Take Control of Your Finances
        </h1>
      </FadeIn>
      <FadeIn direction="right">
        <p className="mt-4 text-xl text-white z-10">
          Gather, analyze, and maximize your wealth.
          <br />
          Join us to start your financial journey!
        </p>
      </FadeIn>
      <FadeIn direction="up">
        <button
          onClick={handleLogin}
          className="px-6 py-2 mt-6 text-white bg-blue-600 rounded hover:bg-blue-700 z-10"
        >
          Get Started
        </button>
      </FadeIn>
    </section>
  );
};

HeroSection.propTypes = {
    handleLogin: PropTypes.func.isRequired,
  };
  

export default HeroSection;