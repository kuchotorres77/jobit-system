import { useEffect, useState } from "react"
import municRivadavia from "@/assets/img/munic.rivadavia1.png"
import rawsonMunci from "@/assets/img/rawsonmunci.png"
import municPocito from "@/assets/img/municpocito1.png"
import gobSanJuan from "@/assets/img/gobsanjuan.png"
import unsj from "@/assets/img/unsj1.png"

const images = [municRivadavia, rawsonMunci, municPocito, gobSanJuan, unsj]

export default function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage()
    }, 6000)
    return () => clearInterval(interval)
  }, [currentIndex])

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl shadow-lg">
      <img
        src={images[currentIndex]}
        alt="Imagen"
        className="object-contain w-full h-64"
      />

      {/* Botón anterior */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 px-3 py-1 rounded-full shadow"
      >
        ‹
      </button>

      {/* Botón siguiente */}
      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-800 px-3 py-1 rounded-full shadow"
      >
        ›
      </button>
    </div>
  )
}
