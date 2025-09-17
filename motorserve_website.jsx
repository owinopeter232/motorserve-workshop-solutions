import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { Car, Bike, Cog } from "lucide-react";

function BookingForm() {
  const [form, setForm] = useState({
    customer_name: "",
    customer_phone: "",
    customer_email: "",
    vehicle_type: "Car",
    service_type: "Repair",
    datetime: "",
    notes: "",
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(null);

  const SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || "service_xxx";
  const TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "template_xxx";
  const PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "user_xxx";
  const WA_NUMBER = process.env.REACT_APP_WORKSHOP_WHATSAPP || "254705639260";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const validate = () => {
    if (!form.customer_name.trim()) return "Please enter your name.";
    if (!form.customer_phone.trim()) return "Please enter a phone number.";
    if (!form.datetime.trim()) return "Please choose a date and time.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setStatus({ type: "error", message: err });
      return;
    }

    setSending(true);
    setStatus(null);

    const templateParams = { ...form };

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
      setStatus({ type: "success", message: "Booking sent! Opening WhatsApp..." });

      const waMessage = [
        "MotorServe Booking Request:",
        `Name: ${form.customer_name}`,
        `Phone: ${form.customer_phone}`,
        `Email: ${form.customer_email}`,
        `Vehicle: ${form.vehicle_type}`,
        `Service: ${form.service_type}`,
        `Date/Time: ${form.datetime}`,
        `Notes: ${form.notes}`,
      ].join("\n");

      const waLink = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waMessage)}`;
      window.open(waLink, "_blank");

      setForm({
        customer_name: "",
        customer_phone: "",
        customer_email: "",
        vehicle_type: "Car",
        service_type: "Repair",
        datetime: "",
        notes: "",
      });
    } catch (sendErr) {
      console.error("EmailJS send error:", sendErr);
      setStatus({ type: "error", message: "Could not send booking. Please try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
      <h3 className="text-2xl font-bold mb-4">Book a Service</h3>

      {status && (
        <div className={`mb-4 p-3 rounded ${status.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {status.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="customer_name" value={form.customer_name} onChange={handleChange} placeholder="Full name *" className="p-3 border rounded" />
        <input name="customer_phone" value={form.customer_phone} onChange={handleChange} placeholder="Phone number *" className="p-3 border rounded" />
        <input name="customer_email" value={form.customer_email} onChange={handleChange} placeholder="Email (optional)" className="p-3 border rounded" />
        <select name="vehicle_type" value={form.vehicle_type} onChange={handleChange} className="p-3 border rounded">
          <option>Car</option>
          <option>Motorcycle</option>
          <option>Generator</option>
        </select>
        <select name="service_type" value={form.service_type} onChange={handleChange} className="p-3 border rounded">
          <option>Repair</option>
          <option>Maintenance</option>
          <option>Diagnostics</option>
          <option>Parts Replacement</option>
        </select>
        <input name="datetime" value={form.datetime} onChange={handleChange} type="datetime-local" className="p-3 border rounded" />
      </div>
      <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Extra details" className="w-full mt-4 p-3 border rounded" rows="4" />
      <button type="submit" disabled={sending} className="bg-red-600 text-white px-4 py-2 mt-4 rounded hover:bg-red-700">
        {sending ? "Sending..." : "Send Booking & Open WhatsApp"}
      </button>
    </form>
  );
}

export default function App() {
  return (
    <div className="font-sans text-gray-900">
      <header className="flex justify-between items-center p-6 bg-black text-white">
        <h1 className="text-xl font-bold">MotorServe Workshop Solutions</h1>
        <nav className="space-x-4">
          <a href="#services" className="hover:text-red-500">Services</a>
          <a href="#about" className="hover:text-red-500">About</a>
          <a href="#booking" className="hover:text-red-500">Booking</a>
        </nav>
      </header>

      <section className="bg-gradient-to-r from-black to-red-700 text-white text-center py-20">
        <motion.h2 className="text-4xl font-bold" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Driven by Service, Powered by Trust
        </motion.h2>
        <p className="mt-4">Expert care for Cars, Motorcycles, and Generators</p>
        <a href="#booking" className="mt-6 inline-block bg-red-600 px-6 py-3 rounded text-lg hover:bg-red-700">
          Book Your Service Now
        </a>
      </section>

      <section id="services" className="py-16 px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6 shadow rounded bg-white">
          <Car className="mx-auto text-red-600 w-12 h-12" />
          <h3 className="font-bold mt-4">Car Repairs</h3>
          <p>Diagnostics, repairs, and servicing for all car models.</p>
        </div>
        <div className="p-6 shadow rounded bg-white">
          <Bike className="mx-auto text-red-600 w-12 h-12" />
          <h3 className="font-bold mt-4">Motorcycle Service</h3>
          <p>Fast, reliable, and affordable solutions for bikes and scooters.</p>
        </div>
        <div className="p-6 shadow rounded bg-white">
          <Cog className="mx-auto text-red-600 w-12 h-12" />
          <h3 className="font-bold mt-4">Generator Maintenance</h3>
          <p>Keep your generators running strong with expert care.</p>
        </div>
      </section>

      <section id="about" className="py-16 px-6 bg-gray-50 text-center">
        <h3 className="text-2xl font-bold mb-4">About Us</h3>
        <p>At MotorServe Workshop Solutions, we combine modern technology with years of hands-on experience to deliver reliable repairs and exceptional customer service.</p>
      </section>

      <section id="booking" className="py-16 px-6 bg-gray-100">
        <BookingForm />
      </section>

      <footer className="p-6 bg-black text-white text-center">
        <p>© {new Date().getFullYear()} MotorServe Workshop Solutions. All rights reserved.</p>
      </footer>
    </div>
  );
}
