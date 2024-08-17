import FadeIn from "./Animation";

const courses = [
  {
    title: "शेयर बजारमा लगानी कसरी गर्ने?",
    description:
      "शेयर बजार एक गतिशील प्लेटफर्म हो जहाँ लगानीकर्ताहरू सार्वजनिक रूपमा कारोबार गरिएका कम्पनीहरूको शेयर किन्छन् र बेच्छन्। यसको आधारभूत कुरा बुझ्नको लागि, स्टकहरू, बजार इन्डेक्सहरू, र व्यापार रणनीतिहरूको बारेमा जान्न महत्त्वपूर्ण छ।",
    link: "/courses/intro-to-stock-market",
  },
];

const CoursesSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-300 to-dark-600 pt-16">
      {/* SVG Curve */}
      <div className="absolute top-0 w-full">
        <svg viewBox="0 0 1440 320" className="absolute -top-40">
          <path
            fill="rgba(255, 255, 255, 0.8)"
            d="M0,128L30,144C60,160,120,192,180,186.7C240,181,300,139,360,122.7C420,107,480,117,540,154.7C600,192,660,256,720,261.3C780,267,840,213,900,202.7C960,192,1020,224,1080,234.7C1140,245,1200,235,1260,202.7C1320,171,1380,117,1410,95.3L1440,74.7L1440,0L1410,0C1380,0,1320,0,1260,0C1200,0,1140,0,1080,0C1020,0,960,0,900,0C840,0,780,0,720,0C660,0,600,0,540,0C480,0,420,0,360,0C300,0,240,0,180,0C120,0,60,0,30,0L0,0Z"
          ></path>
        </svg>
      </div>

      <div className="container relative px-4 mx-auto">
        <FadeIn direction="down">
          <h2 className="mb-10 text-3xl font-bold text-center text-gray-800">
            लगानीका पाठ्यक्रमहरू
          </h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Course Card */}
          <div className="flex flex-col justify-center">
            <FadeIn direction="up" delay={0.5}>
              <div className="p-6 mb-6 text-left duration-300">
                <h3 className="mb-2 text-2xl font-semibold">
                  {courses[0].title}
                </h3>
                <p className="text-black mb-4">{courses[0].description}</p>
                <a
                  href={courses[0].link}
                  className="inline-block px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  पाठ्यक्रम सिक्नुहोस्
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Image Placeholder */}
          <div className="flex justify-center items-center">
            <img
              src="/Growth.svg"
              alt="Investment Graphic"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      <div className="container relative px-4 mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Placeholder */}
          <div className="flex justify-center items-center">
            <img
              src="/House.svg"
              alt="Investment Graphic"
              className="w-full h-auto"
            />
          </div>
          {/* Course Card */}
          <div className="flex flex-col justify-center">
            <FadeIn direction="up" delay={0.5}>
              <div className="p-6 mb-6 text-left duration-300">
                <h3 className="mb-2 text-2xl font-semibold">
                  घर जग्गाको पाठ्यक्रम
                </h3>
                <p className="text-black mb-4">
                  यस समग्र पाठ्यक्रमबाट शेयर बजारमा लगानीको आधारभूत कुरा सिक्नुहोस्। बजारको प्रवृत्तिहरूको विश्लेषण कसरी गर्ने, शेयर इन्डेक्सहरूको महत्व बुझ्ने, र प्रभावकारी व्यापार रणनीतिहरू विकास गर्नको लागि जानकारी प्राप्त गर्नुहोस्। बजारको गतिविधिहरूलाई चलाउने वित्तीय डेटा बुझ्न र सूचित लगानी निर्णयहरू कसरी गर्ने सिक्नुहोस्।
                </p>
                <a
                  href={"/"}
                  className="inline-block px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  पाठ्यक्रम सिक्नुहोस्
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;