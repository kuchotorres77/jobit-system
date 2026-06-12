import mujerConCel from "@/assets/img/mujer-con-cel.png";
import whatsappIconImg from "@/assets/img/whatsapp1.png";

interface AgendameSectionProps {
    phone?: string; // Ejemplo: "549XXXXXXXXXX"
    imageSrc?: string;
    whatsappIcon?: string;
    title?: string;
    description?: string;
    titleColor?: string;
}

export const AgendameSection = ({
    phone = "549XXXXXXXXXX",
    imageSrc = mujerConCel,
    whatsappIcon = whatsappIconImg,
    title = "Agendame",
    description = "Para agilizar tu búsqueda agendá a Jobit y comunicate desde WhatsApp con nuestro asistente virtual.",
    titleColor = "#78499A",
}: AgendameSectionProps) => {
    return (
        <section
            id="agendame"
            className="sticky top-0 h-screen flex flex-col items-center justify-center bg-[#D9D9D9] text-black" >
            <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between p-6 md:gap-x-32">
                {/* Columna: Imagen */}
                <div className="relative w-full md:w-1/2 overflow-hidden group">
                    <img
                        src={imageSrc}
                        alt="Agendame"
                        className="w-full h-auto object-cover transition-transform duration-500 rounded-lg"
                    />
                </div>
                {/* Columna: Contenido */}
                <div className="w-full md:w-1/2 p-6 flex flex-col items-center md:items-start text-center md:text-left">
                    <h2
                        className="mb-6 text-[45px] md:text-[60px] leading-[50px] font-[450]"
                        style={{
                            fontFamily: "AtkinsonBold, sans-serif",
                            color: titleColor,
                            // fontWeight: 700,
                            // fontSize: "60px",
                            // lineHeight: "24px",
                            // letterSpacing: "0px",
                        }}
                    >
                        {title}
                    </h2>


                    <p
                        className="mb-6 text-[25px] md:text-[30px] md:leading-[50px] leading-[35px] font-[450]"
                        style={{
                            fontFamily: "AtkinsonBold",
                            color: titleColor,
                            // fontWeight: 400,
                            // fontSize: "30px",
                            // lineHeight: "50px",
                            // letterSpacing: "0px",
                        }}
                    >
                        {description}
                    </p>


                    <a
                        href={`https://wa.me/${phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-4 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-transform transform hover:scale-105 shadow-md"
                    >
                        <span>Contacto</span>
                        <img src={whatsappIcon} alt="WhatsApp" className="w-6 h-6" />
                    </a>
                </div>
            </div>
        </section>
    );
}