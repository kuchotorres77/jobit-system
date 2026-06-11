import { Link } from "react-router-dom";

type HeroSectionProps = {
    title?: string;
    subtitle?: string;
    ctaText?: string;
    bgSrc?: string;
    logoSrc?: string;
    badgeSrc?: string;
};

export const HeroSection = ({
    title = "Encontrame",
    subtitle = "Busca y encuentra prestadores de servicios calificados.",
    ctaText = "Buscar",
    bgSrc = "/src/assets/img/tecnico_pc.png",
    logoSrc = "/src/assets/img/logo LetrasJobit.png",
    badgeSrc = "/src/assets/img/Vector.png",
}: HeroSectionProps) => {

    return (
        <section
            id="inicio"
            className={"h-screen flex items-center justify-center bg-cover bg-center px-4"}
            style={{ backgroundImage: `url(${bgSrc})` }}>
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10 text-center flex flex-col items-center gap-6 p-8 rounded-lg">
                <h1
                    className="text-white font-bold text-6xl md:text-7xl"
                    style={{
                        fontFamily: "AtkinsonBold, sans-serif",
                        fontWeight: 700
                    }}
                >{title}</h1>
                <p
                    className="text-white text-xl md:text-2xl max-w-xl"
                    style={{
                        fontFamily: "AtkinsonBold, sans-serif"
                    }}
                >{subtitle}</p>
                <Link
                    to="/servicios"
                    className={"mt-4 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white text-xl font-bold rounded-xl transition-transform transform hover:scale-105 shadow-lg"}
                >{ctaText}</Link>
                <div className="flex flex-row gap-4 mt-6">
                    {/* <img src={badgeSrc} alt="App Store" className="h-12" /> */}
                </div>
                <img src={logoSrc} alt="Logo" className="h-12" />
            </div>
        </section>
    );
}
