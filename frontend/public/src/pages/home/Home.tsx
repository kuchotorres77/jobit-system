import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { ChevronUp } from "lucide-react";
import "./home.css"
import { Footer, NavbarUser } from "@/components";
import { AgendameSection, CapacitateSection, ContactSection, HeroSection, JobitPlusSection, PromocionalosSection, ServicesCarouselSection } from "./components";

const NAVBAR_OFFSET = 80

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop
      setIsVisible(scrollY > 300)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll a la sección indicada en el hash (/#agendame, /#capacitate, etc.)
  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0 })
      return
    }
    const target = document.getElementById(location.hash.slice(1))
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - NAVBAR_OFFSET
      window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" })
    }
  }, [location])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <>
      <main className="relative">
        {/* Navbar */}
        <NavbarUser />

        {/* Hero */}
        <HeroSection />

        {/* Sección Agendame */}
        <AgendameSection />

        {/* Sección Promocionalos */}
        <PromocionalosSection />

        {/* Sección Capacitate */}
        <CapacitateSection />

        {/* Sección ServicesCarousel */}
        <ServicesCarouselSection />

        {/* Sección JobitPlus */}
        <JobitPlusSection />

        {/* Sección Contact */}
        <ContactSection />

        {/* Botón Scroll */}
        {isVisible && (
          <button
            onClick={scrollToTop}
            className="scroll-to-top fixed bottom-6 right-6 bg-[#78499A] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform animate-bounce"
          >
            <ChevronUp size={24} />
          </button>
        )}
      </main>
      <Footer />
    </>
  )
}
