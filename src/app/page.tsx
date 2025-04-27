"use client";

// import { Navbar } from "@/components/Navbar";
import { Navbar } from "@/components/Navbar";
import Hero from "@/components/Hero";
import Work from "@/components/Work";
import Why from "@/components/Why";
import Footer from "@/components/Footer";
import SneakPeek from "@/components/SneakPeak";
import CTA from "@/components/CTA";
export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Work />
      <Why />
      <SneakPeek />
      <CTA />
      <Footer />
    </main>
  );
}
