import Hero from "@/features/landing/Hero";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";
import About from "@/features/landing/About";

export default function LandingTemplate() {
    return (
        <div>
        <Navbar/>
        <Hero/>
        <About/>
        <Footer/>
        </div>
    );
}