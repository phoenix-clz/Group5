import FadeIn from "./Animation";

const features = [
  {
    title: "AI-powered personalized financial advisor",
    description:
      "Store and track all your financial information in one place, from bank accounts to investments.",
    image: "https://plus.unsplash.com/premium_photo-1682124651258-410b25fa9dc0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YXJ0aWZpY2lhbCUyMGludGVsbGlnZW5jZXxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    title: "Personalized Mentor for financial advice",
    description:
      "Analyze your spending habits, investment opportunities, and receive personalized recommendations.",
    image: "https://plus.unsplash.com/premium_photo-1661342428515-5ca8cee4385a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWVudG9yJTIwZmluYW5jaWFsfGVufDB8fDB8fHww",
  },
  {
    title: "Retirement planning simulator",
    description:
      "Receive monthly and annual financial reports to keep you informed and on track.",
    image: "https://plus.unsplash.com/premium_photo-1667509334553-d289509e472a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmV0aXJlbWVudCUyMHBsYW5uaW5nfGVufDB8fDB8fHww",
  },
  {
    title: "Income expense reports",
    description:
      "Receive monthly and annual financial reports to keep you informed and on track.",
    image: "https://nairametrics.com/wp-content/uploads/2017/08/WhatsApp-Image-2017-08-10-at-2.50.09-PM.jpeg",
  },
  {
    title: "Determine expenditure habits",
    description:
      "Evaluate your spending patterns to help control finances.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJH_UDrw0MyjnJpExCwBacYOPaVJTyOUQjXg&s",
  },
  {
    title: "Interest rate evaluation",
    description:
      "Analyze and compare interest rates on various financial products.",
    image: "https://plus.unsplash.com/premium_photo-1682309743711-a8f84f47fef6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW50ZXJlc3QlMjByYXRlfGVufDB8fDB8fHww",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container px-4 mx-auto">
        <FadeIn direction="down">
          <h2 className="mb-10 text-3xl font-bold text-center">Our Features</h2>
        </FadeIn>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((item, index) => (
            <FadeIn key={index} direction="right" delay={index * 0.5}>
              <div className="flex flex-col p-6 text-center bg-white rounded-lg shadow-md h-full">
                <img
                  src={item.image}
                  alt={item.title}
                  className="mb-4 mx-auto object-cover w-full h-48 rounded-md" // Ensure the image fits well
                />
                <div className="flex flex-col flex-grow">
                  <h3 className="mb-2 text-2xl font-semibold">{item.title}</h3>
                  <p className="text-gray-700 flex-grow">{item.description}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
