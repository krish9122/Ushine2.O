import React, { Component } from "react";
import { Hero } from "./components/heroPage/heroPage";
import { Services } from "./components/Services/Services";
import { Gallery } from "./components/Gallery/Gallery";
import { About } from "./components/About/About";
import { Contact } from "./components/Contact/Contact";
import { Footer } from "./components/Footer/footer";

export default function App() {
  return (
    <>
      <Hero />
      <Services />
      <Gallery />
      <About />
      <Contact />
      <Footer />
    </>
  );
}