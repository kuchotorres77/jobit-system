interface FooterProps {
  logoSrc?: string;
  facebookSrc?: string;
  instagramSrc?: string;
  xSrc?: string;
  whatsappSrc?: string;
  email?: string;
  whatsappNumber?: string;
  companyDescription?: string;
}


export const Footer = ({
  logoSrc = "/src/assets/img/logo LetrasJobit.png",
  facebookSrc = "/src/assets/img/Facebook1.png",
  instagramSrc = "/src/assets/img/Instagram1.png",
  xSrc = "/src/assets/img/X1.png",
  whatsappSrc = "/src/assets/img/Whatsapp1.png",
  email = "info@jobit.com",
  whatsappNumber = "+54 9 11 1234-5678",
  companyDescription = "Somos una empresa dedicada a ofrecer soluciones innovadoras.",
}: FooterProps) => {
  return (
    <footer className="w-full bg-[#3E4244] text-white px-6 md:px-12 py-10">
      <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row justify-between gap-10 md:h-[409px]">
        {/* Columna: Acerca de */}
        <div className="md:w-1/3">
          <h3 className="text-xl font-semibold mb-4">Acerca de</h3>
          <img
            src={logoSrc}
            alt="Logo Jobit"
            className="w-[135px] h-[40px] ml-[50px] opacity-80 mb-4"
          />
          <p className="text-gray-300">{companyDescription}</p>
        </div>


        {/* Columna: Contacto y redes */}
        <div className="md:w-1/3 ml-auto">
          <h3 className="text-xl font-semibold mb-4">Jobit</h3>
          <p className="text-gray-300 mb-4">{email}</p>


          <h3 className="text-xl font-semibold mb-4">Síguenos</h3>
          <div className="flex gap-4 mb-4">
            <img
              src={facebookSrc}
              alt="Facebook"
              className="w-10 h-10 rounded-full transition-transform duration-300 hover:scale-110 cursor-pointer"
            />
            <img
              src={instagramSrc}
              alt="Instagram"
              className="w-10 h-10 rounded-full transition-transform duration-300 hover:scale-110 cursor-pointer"
            />
            <img
              src={xSrc}
              alt="X"
              className="w-10 h-10 rounded-full transition-transform duration-300 hover:scale-110 cursor-pointer"
            />
          </div>


          <h3 className="text-xl font-semibold mb-4">WhatsApp</h3>
          <div className="flex items-center gap-4 mb-2">
            <img
              src={whatsappSrc}
              alt="WhatsApp"
              className="w-10 h-10 rounded-full transition-transform duration-300 hover:scale-110 cursor-pointer"
            />
            <p className="text-gray-300">{whatsappNumber}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}