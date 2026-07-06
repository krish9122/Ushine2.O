import heroImage from "../../assets/hero_image.png";

export function Hero() {
  return (
    <header
      className="min-h-screen bg-cover bg-center relative text-white"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="absolute inset-0 bg-black/45"></div>

      <div className="relative z-10">
        <nav className="flex justify-between items-center px-12 py-5">
          <button
            onClick={() => window.location.reload()}
            className="text-2xl cursor-pointer"
          >
            ✂ Ushine
          </button>

          <div className="space-x-6 text-lg">
            <a href="#services">Services</a>
            <a href="#gallery">Gallery</a>
            <a href="#about">About</a>
            <a href="#contact" className="bg-orange-500 px-3 py-2 rounded-lg">
              Book Now
            </a>
          </div>
        </nav>

        <div className="text-center mt-[30vh] px-5">
          <h1 className="text-6xl mb-5 drop-shadow-lg">
            Your beauty, our passion
          </h1>
          <p className="text-2xl text-gray-200">
            Premium hair care in a luxurious atmosphere
          </p>
        </div>
      </div>
    </header>
  );
}
