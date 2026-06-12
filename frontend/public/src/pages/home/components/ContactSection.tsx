import { useForm } from "react-hook-form";
import { useState } from "react";
import contactameImg from "@/assets/img/contactame.png";

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

type ContactSectionProps = {
  title?: string;
  highlightColor?: string;
  buttonColor?: string;
  imageSrc?: string;
};

export const ContactSection = ({
  title = "Contactanos",
  highlightColor = "#FAAB30",
  buttonColor = "#EA580C",
  imageSrc = contactameImg,
}: ContactSectionProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (data: ContactFormData) => {
    console.log("📨 Datos enviados:", data);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      reset();
    }, 2500);
  };

  return (
    <section
      id="contactos"
      className="sticky top-0 h-screen flex flex-col items-center justify-center bg-white"
    >
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center justify-between p-6">
        {/* Columna: Contenido */}
        <div className="w-full md:w-1/2 p-6 text-center md:text-left mb-6 md:mb-0">
          <h2
            className="mb-6 font-bold text-[45px] leading-[24px]"
            style={{
              fontFamily: "AtkinsonBold, sans-serif",
              color: highlightColor,
            }}
          >
            {title}
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 mt-6 max-w-md mx-auto md:mx-0"
          >
            <input
              type="text"
              placeholder="Escriba su nombre"
              {...register("name", { required: "El nombre es obligatorio" })}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}

            <input
              type="email"
              placeholder="Escriba su e-mail"
              {...register("email", {
                required: "El e-mail es obligatorio",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Formato de e-mail inválido",
                },
              })}
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}

            <textarea
              placeholder="Escriba su mensaje"
              {...register("message", { required: "El mensaje es obligatorio" })}
              className="w-full h-32 px-4 py-3 rounded-md border border-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.message && (
              <p className="text-red-500 text-sm">{errors.message.message}</p>
            )}

            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-md"
              style={{ backgroundColor: buttonColor }}
            >
              Enviar
            </button>

            {submitted && (
              <p className="text-green-600 mt-4 font-semibold">
                ✅ Mensaje enviado correctamente
              </p>
            )}
          </form>
        </div>

        {/* Columna: Imagen */}
        <div className="relative w-full md:w-1/2 overflow-hidden">
          <img
            src={imageSrc}
            alt="Email"
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
      </div>
    </section>
  );
};
