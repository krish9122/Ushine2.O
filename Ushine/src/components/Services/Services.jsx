export function Services() {
  return (
    <section id="services" className="py-24 px-[10%] text-center bg-[#faf0f3]">
      <h2 className="text-3xl">Our Services</h2>
      <p className="text-lg text-gray-500 mt-4">
        Professional hair services tailored to you
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-10 mt-14">
        {[
          {
            title: "Haircut & Styling",
            desc: "Expert cuts designed for your lifestyle",
            price: "From ₹400",
          },
          {
            title: "Color Services",
            desc: "Highlights, balayage & correction",
            price: "From ₹3500",
          },
          {
            title: "Treatments",
            desc: "Keratin, conditioning & restoration",
            price: "From ₹2200",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white p-10 rounded-2xl shadow-lg"
          >
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="mt-3">{item.desc}</p>
            <span className="block mt-4 text-orange-500 font-bold">
              {item.price}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}