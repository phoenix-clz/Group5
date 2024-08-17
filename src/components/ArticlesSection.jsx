import FadeIn from "./Animation";

// Share Market Articles
const shareMarketArticles = [
  {
    title: "शेयर बजारमा लगानी कसरी गर्ने?",
    description: "शेयर बजारमा लगानी गर्दा ध्यान दिनुपर्ने कुराहरू र प्रक्रिया।",
    image: "https://plus.unsplash.com/premium_photo-1681487769650-a0c3fbaed85a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2hhcmUlMjBtYXJrZXR8ZW58MHx8MHx8fDA%3D",
    link: "/articles/investment-basics",
  },
  {
    title: "शेयर बजारको उत्थान र पतन: के जान्नुपर्छ?",
    description: "शेयर बजारको उत्थान र पतनको कारण र यो कसरी काम गर्छ।",
    image: "https://plus.unsplash.com/premium_photo-1664476845274-27c2dabdd7f0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2hhcmUlMjBtYXJrZXR8ZW58MHx8MHx8fDA%3D",
    link: "/articles/market-fluctuations",
  },
  {
    title: "कसरी शेयर बजारमा खाता खोल्ने?",
    description: "शेयर बजारमा खाता खोल्नको लागि आवश्यक प्रक्रिया र कागजातहरू।",
    image: "https://images.unsplash.com/photo-1651340981821-b519ad14da7c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNoYXJlJTIwbWFya2V0fGVufDB8fDB8fHww",
    link: "/articles/opening-account",
  },
];

// घर जग्गा Articles
const gharJaggaArticles = [
  {
    title: "नेपालको घर जग्गा बजारमा लगानी गर्नका लागि टिप्स",
    description: "घर जग्गा बजारमा लगानी गर्दा ध्यान दिनुपर्ने केहि कुराहरू।",
    image: "https://images.unsplash.com/photo-1605146769289-440113cc3d00?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVhbCUyMGVzdGF0ZXxlbnwwfHwwfHx8MA%3D%3D",
    link: "/articles/real-estate-tips",
  },
  {
    title: "नेपालमा घर जग्गाको मूल्य र संरचना",
    description: "नेपालमा घर जग्गाको मूल्य निर्धारण कसरी हुन्छ र यसको संरचना।",
    image: "https://img.freepik.com/free-photo/hand-presenting-model-house-home-loan-campaign_53876-104970.jpg?ga=GA1.2.665712432.1723885947&semt=ais_hybrid",
    link: "/articles/price-structure",
  },
  {
    title: "नेपालको घर जग्गामा लगानीको भविष्य",
    description: "नेपालको घर जग्गा बजारमा लगानी गर्ने भविष्य र अवसरहरू।",
    image: "https://img.freepik.com/free-photo/hands-with-luxurious-house_1232-1077.jpg?ga=GA1.2.665712432.1723885947&semt=ais_hybrid",
    link: "/articles/real-estate-future",
  },
];

const ArticlesSection = () => {
  return (
    <section className="py-20 bg-gray-200">
      <div className="container px-4 mx-auto">
        <FadeIn direction="down">
          <h2 className="mb-4 text-3xl font-bold text-center text-gray-800">शेयर बजार र घर जग्गा सिक्नका लागि लेखहरू</h2>
        </FadeIn>
        <FadeIn direction="up">
          <p className="mb-10 text-center text-gray-600">
            यहाँ शेयर बजार र घर जग्गाका बारेमा जान्नको लागि विभिन्न लेखहरू प्रस्तुत गरिएका छन्।
          </p>
        </FadeIn>

        {/* Share Market Articles */}
        <div className="grid gap-8 md:grid-cols-3 mb-12">
          {shareMarketArticles.map((article, index) => (
            <FadeIn key={index} direction="right" delay={index * 0.1}>
              <div className="p-6 text-center bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
                <img
                  src={article.image}
                  alt={article.title}
                  className="mb-4 rounded-t-lg h-48 w-full object-cover"
                />
                <h3 className="mb-2 text-xl font-semibold text-gray-800">{article.title}</h3>
                <p className="text-gray-700 mb-4">{article.description}</p>
                <a
                  href={article.link}
                  className="text-blue-500 hover:underline"
                >
                  थप जानकारी
                </a>
              </div>
            </FadeIn>
          ))}
        </div>

        <div className="mt-6">
          {/* Ghar Jagga Articles */}
          <FadeIn direction="down">
            <h2 className="mb-4 text-3xl font-bold text-center text-gray-800">घर जग्गा सिक्नका लागि लेखहरू</h2>
          </FadeIn>
          <FadeIn direction="up">
            <p className="mb-10 text-center text-gray-600">
              यहाँ घर जग्गाका बारेमा जान्नको लागि विभिन्न लेखहरू प्रस्तुत गरिएका छन्।
            </p>
          </FadeIn>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {gharJaggaArticles.map((article, index) => (
            <FadeIn key={index} direction="right" delay={index * 0.1}>
              <div className="p-6 text-center bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105">
                <img
                  src={article.image}
                  alt={article.title}
                  className="mb-4 rounded-t-lg h-48 w-full object-cover"
                />
                <h3 className="mb-2 text-xl font-semibold text-gray-800">{article.title}</h3>
                <p className="text-gray-700 mb-4">{article.description}</p>
                <a
                  href={article.link}
                  className="text-blue-500 hover:underline"
                >
                  थप जानकारी
                </a>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArticlesSection;