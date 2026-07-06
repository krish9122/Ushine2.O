export function Contact() {
  return (
    <section id="contact" className="py-24 px-[10%] bg-[#faf4f0]">
      <h2 className="text-3xl text-center">Book an Appointment</h2>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-14 mt-14">
        <div>
          <p>
            <strong>Location:</strong> 123 Beauty Boulevard, New York
          </p>
          <p>
            <strong>Phone:</strong> +91 8986117514
          </p>
          <p>
            <strong>Email:</strong> hello@ushine.com
          </p>
        </div>

        <form className="space-y-5">
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-4 rounded-lg border"
          />
          <div className="flex items-center rounded-lg border border-gray-300 bg-white">
            <span className="px-4 py-4 text-gray-700 border-r border-gray-300">+91</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Phone Number"
              className="w-full p-4 rounded-r-lg outline-none text-gray-700"
              maxLength={10}
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </div>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 rounded-lg border"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 rounded-lg border"
          />
          <select className="w-full p-4 rounded-lg border">
            <option>Haircut & Styling</option>
            <option>Color Services</option>
            <option>Treatments</option>
          </select>
          <textarea
            rows="4"
            placeholder="Message"
            className="w-full p-4 rounded-lg border"
          ></textarea>
          <button className="w-full p-4 bg-orange-500 text-white rounded-lg text-lg">
            Request Appointment
          </button>
        </form>
      </div>
    </section>
  );
}

