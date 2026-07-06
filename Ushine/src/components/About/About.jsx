import hair3 from "../../assets/hair_3.png";

export function About() {
  return (
    <section
      id="about"
      className="py-24 px-[10%] bg-[#faf0f3] grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-12 items-center"
    >
      <div>
        <h2 className="text-3xl">About Ushine</h2>
        <p className="text-lg text-gray-500 mt-4">
          Award-winning stylists dedicated to enhancing your natural beauty.
        </p>
      </div>

      <img src={hair3} alt="Salon work" />
    </section>
  );
}
