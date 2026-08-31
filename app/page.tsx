import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Standard from "@/components/Standard";
import Work from "@/components/Work";
import WhyUs from "@/components/WhyUs";
import About from "@/components/About";
import Offer from "@/components/Offer";
import FAQ from "@/components/FAQ";
import IntakeForm from "@/components/IntakeForm";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidgetLoader";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Standard />
        <Work />
        <WhyUs />
        <About />
        <Offer />
        <FAQ />
        <IntakeForm />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}