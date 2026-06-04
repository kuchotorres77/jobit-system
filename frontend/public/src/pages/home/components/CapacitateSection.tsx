import React from "react";

type CapacitateSectionProps = {
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

export const CapacitateSection = ({
    title = "Capacitate",
    description = "Formate en las mejores instituciones y mejora tu posicionamiento en Jobit.",
    buttonText = "Más información",
    buttonLink = "#",
    bgColor = "#E8E8E8",
    titleColor = "#FAAB30",
    textColor = "#78499A",
    buttonColor = "#78499A",
    imageSrc = "/src/assets/img/Capacitacion_1.png",
}: CapacitateSectionProps) => {
    return (
        <section
            id="capacitate"
            className="sticky top-0 h-screen flex flex-col items-center justify-center text-black"
            style={{ backgroundColor: bgColor }}
        >
            <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between p-6">
                {/* Columna: Imagen */}
                <div className="relative w-full md:w-1/2 overflow-hidden">
                    <img
                        src={imageSrc}
                        alt={title}
                        className="w-full h-auto object-cover transition-transform duration-500 rounded-lg"
                    />
                </div>

                {/* Columna: Contenido */}
                <div className="w-full md:w-1/2 p-6 text-center md:text-left">
                    <h2
                        className="mb-6 text-[45px] md:text-[60px] leading-[50px] font-[450]"
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
                            fontFamily: "AtkinsonBold",
                            // fontWeight: 400,
                            // fontSize: "30px",
                            // lineHeight: "50px",
                            color: textColor,
                        }}
                    >
                        {description}
                    </p>

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
