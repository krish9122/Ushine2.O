import hair1 from "../../assets/hair_1.png";
import hair2 from "../../assets/hair_2.png";
import hair3 from "../../assets/hair_3.png";

const galleryImages = [hair1, hair2, hair3, hair1];

export function Gallery() {
  return (
    <section id="gallery" className="py-24 px-[10%] text-center bg-[#faf4f0]">
      <h2 className="text-3xl">Our Work</h2>
      <p className="text-lg text-gray-500 mt-4">
        Explore our transformations
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8 mt-14">
        {galleryImages.map((img, i) => (
          <img
            key={i}
            src={img}
            alt="Hair style"
            className="h-[300px] object-cover rounded-xl"
          />
        ))}
      </div>
    </section>
  );
}