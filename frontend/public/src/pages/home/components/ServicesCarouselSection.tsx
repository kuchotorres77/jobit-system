import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import municRivadavia from "@/assets/img/munic.rivadavia1.png";
import rawsonMunci from "@/assets/img/rawsonmunci.png";
import municPocito from "@/assets/img/municpocito1.png";
import gobSanJuan from "@/assets/img/gobsanjuan.png";
import unsj from "@/assets/img/unsj1.png";

type ServicesCarouselSectionProps = {
  title?: string;
  buttonText?: string;
  buttonLink?: string;
  bgColor?: string;
  titleColor?: string;
  buttonColor?: string;
  images?: string[];
  autoplay?: boolean;
  delay?: number;
  slidesPerView?: number;
  imageHeight?: string; 
};

export const ServicesCarouselSection = ({
  title = "Servicios de Interés",
  buttonText = "Más información",
  buttonLink = "#",
  bgColor = "#ffffff",
  titleColor = "#FAAB30",
  buttonColor = "#EF933A",
  images = [municRivadavia, rawsonMunci, municPocito, gobSanJuan, unsj],
  autoplay = true,
  delay = 3000,
  slidesPerView = 4,
  imageHeight = "180px",
}: ServicesCarouselSectionProps) => {
  return (
    <section
      id="servicios-interes"
      className="sticky top-0 min-h-screen flex flex-col items-center justify-center text-black px-6"
      style={{ backgroundColor: bgColor }}
    >
      <div className="w-full max-w-[1800px] flex flex-col items-center justify-center relative py-10">
        {/* Título */}
        <h2
          className="mb-10 text-center text-[45px] md:text-[60px] leading-[50px] font-[450]"
          style={{
            fontFamily: "AtkinsonBold, sans-serif",
            color: titleColor,
          }}
        >
          {title}
        </h2>

        {/* Carrusel */}
        <div className="w-full relative z-10 md:mb-36 mb-20"> 
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={slidesPerView}
            loop={true}
            autoplay={autoplay ? { delay, disableOnInteraction: false } : false}
            // pagination={{ clickable: true }}
            // navigation
            className="w-full"
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: slidesPerView },
            }}
          >
            {images.map((img, index) => (
              <SwiperSlide key={index} className="flex justify-center">
                <div
                  className="overflow-hidden transition-transform duration-500  bg-white flex items-center justify-center"
                  style={{ height: imageHeight, width: "auto" }}
                >
                  <img
                    src={img}
                    alt={`Servicio ${index + 1}`}
                    className="object-contain max-h-full max-w-full p-4"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Botón */}
        <div className="absolute bottom-6 right-8 z-20">
          <a
            href={buttonLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 text-white font-bold rounded-lg transition-transform transform hover:scale-105 shadow-md"
            style={{ backgroundColor: buttonColor }}
          >
            {buttonText}
          </a>
        </div>
      </div>
    </section>
  );
};
