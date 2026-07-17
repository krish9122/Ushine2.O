import { useState } from "react";
import { api } from "../../admin/AuthContext";

export function Contact() {
  const initialForm = {
    username: "",
    phone_no: "",
    email: "",
    category: "haircut",
    date: "",
    message: "",
  };
  const [formData, setFormData] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (formData.phone_no.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/user/register", formData);
      if (response.data?.success) {
        setSuccess("Your appointment request has been submitted successfully.");
        setFormData(initialForm);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to submit your appointment request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && <p className="rounded-lg bg-red-100 p-3 text-red-700">{error}</p>}
          {success && <p className="rounded-lg bg-green-100 p-3 text-green-700">{success}</p>}
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-4 rounded-lg border"
            required
          />
          <div className="flex items-center rounded-lg border border-gray-300 bg-white">
            <span className="px-4 py-4 text-gray-700 border-r border-gray-300">+91</span>
            <input
              type="text"
              name="phone_no"
              value={formData.phone_no}
              onChange={handleChange}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Phone Number"
              className="w-full p-4 rounded-r-lg outline-none text-gray-700"
              maxLength={10}
              required
              onKeyDown={(e) => {
                if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-4 rounded-lg border"
            required
          />
          <select name="category" value={formData.category} onChange={handleChange} className="w-full p-4 rounded-lg border">
            <option value="haircut">Haircut & Styling</option>
            <option value="color">Color Services</option>
            <option value="treatment">Treatments</option>
            <option value="other">Other</option>
          </select>
          <div>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full p-4 rounded-lg border"
              required
            />
          </div>
          <div className="relative">
            <textarea
              rows="4"
              maxLength={500}
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              className="w-full p-4 pr-20 rounded-lg border"
            ></textarea>
            <p className="absolute bottom-3 right-3 text-sm text-gray-500">
              {formData.message.length}/500
            </p>
          </div>
          <button type="submit" disabled={isSubmitting} className="w-full p-4 bg-orange-500 text-white rounded-lg text-lg disabled:cursor-not-allowed disabled:opacity-60">
            {isSubmitting ? "Submitting..." : "Request Appointment"}
          </button>
        </form>
      </div>
    </section>
  );
}

