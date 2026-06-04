interface PromocionalosSectionProps {
    linkRef?: string; // link de referencia
    imageSrc?: string;
    title?: string;
    description?: string;
    buttonText?: string;
}

export const PromocionalosSection = ({
    linkRef = "#",
    imageSrc = "/src/assets/img/Herramientas_1.png",
    title = "Promocionalos",
    description =
    "Registrá tus servicios totalmente gratis y promocionales. Mucha gente te está buscando.",
    buttonText = "Se un Jobit",
}: PromocionalosSectionProps) => {
    return (
        <section
            id="promo"
            className="sticky top-0 h-screen flex flex-col items-center justify-center bg-[#78499A]">
            <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between p-6">
                {/* Columna: Contenido */}
                <div className="w-full md:w-1/2 p-6 text-center md:text-left">
                    <h2
                        className="mb-6 text-[45px] md:text-[60px] leading-[50px] font-[450]"
                        style={{
                            fontFamily: "AtkinsonBold, sans-serif",
                            color: "#fafafa",
                            // fontWeight: 700,
                            // fontSize: "60px",
                            // lineHeight: "24px",
                        }}>
                        {title}
                    </h2>
                    <p
                        className="mb-6 text-[25px] md:text-[30px] md:leading-[50px] leading-[35px] font-[450]"
                        style={{
                            fontFamily: "AtkinsonBold",
                            color: "#f8f8f8",
                            // fontWeight: 400,
                            // fontSize: "30px",
                            // lineHeight: "50px",
                            // letterSpacing: "0px",
                            // verticalAlign: "middle",
                        }}>
                        {description}
                    </p>
                    <a
                        href={linkRef}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-transform transform hover:scale-105 shadow-md">
                        <span>{buttonText}</span>
                    </a>
                </div>
                {/* Columna: Imagen */}
                <div className="relative w-full md:w-1/2 overflow-hidden group">
                    <img
                        src={imageSrc}
                        alt="Herramientas"
                        className="w-full h-auto object-cover transition-transform duration-500 rounded-lg"
                    />
                </div>
            </div>
        </section>
    );
}