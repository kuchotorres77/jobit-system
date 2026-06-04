type JobitPlusSectionProps = {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  bgColor?: string;
  titleColor?: string;
  textColor?: string;
  buttonColor?: string;
  imageSrc?: string;
};

export const JobitPlusSection = ({
  title = "Estos son los Jobers mejores calificados por nuestros usuarios.",
  description = "Encontrá los recomendados por la comunidad Jobit.",
  buttonText = "Más información",
  buttonLink = "#",
  bgColor = "#E8E8E8",
  titleColor = "#FAAB30",
  textColor = "#78499A",
  buttonColor = "#78499A",
  imageSrc = "/src/assets/img/MujerOK.png",
}:JobitPlusSectionProps) => {
  return (
    <section
      id="jobit-plus"
      className="sticky top-0 h-screen flex flex-col items-center justify-center text-black"
      style={{ backgroundColor: bgColor }}
    >
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between p-6">
        {/* Columna: Imagen */}
        <div className="relative w-full md:w-1/2 overflow-hidden group mb-6 md:mb-0">
          <img
            src={imageSrc}
            alt="Jobit Plus"
            className="w-full h-auto max-h-40 sm:max-h-56 md:max-h-96 lg:max-h-full object-contain transition-transform duration-500 rounded-lg"
          />
        </div>

        {/* Columna: Contenido */}
        <div className="w-full md:w-1/2 p-6 text-center md:text-left mb-6 md:mb-0">
          <h2
            className="mb-6 text-[30px] md:text-[45px] leading-[50px] font-[450]"
            style={{
              fontFamily: "AtkinsonBold, sans-serif",
              color: titleColor,
            }}
          >
            {title}
          </h2>

          <p
            className="mb-6 text-[25px] md:text-[30px] md:leading-[50px] leading-[35px] font-[450]"
            style={{
              fontFamily: "AtkinsonBold, sans-serif",
              color: textColor,
            }}
          >
            {description}
          </p>

          <a
            href={buttonLink}
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
