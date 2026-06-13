import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ApiError, forgotPassword } from "@/api";
import logoIn from "@/assets/img/logo-in.png";

interface FormData {
  email: string;
}

export default function OlvideContrasena() {
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      await forgotPassword(data.email);
      setEnviado(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "No se pudo conectar con el servidor",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <a href="/" className="mb-8">
        <img src={logoIn} width="200" alt="Logo" />
      </a>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 max-w-md w-full">
        {enviado ? (
          <div className="text-center">
            <div className="text-5xl mb-4">✉</div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Revisá tu correo
            </h1>
            <p className="text-sm text-gray-500">
              Si el email está registrado, te enviamos un enlace para
              restablecer tu contraseña. El enlace vence en 1 hora.
            </p>
            <Link
              to="/login"
              className="inline-block mt-6 text-sm text-jobit-violeta-700 hover:underline"
            >
              Volver al login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-xl font-semibold text-gray-900 mb-1">
              Recuperar contraseña
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Ingresá tu email y te enviamos un enlace para restablecer tu
              contraseña.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  className={`block w-full h-[44px] px-3 rounded-md border focus:outline-none focus:border-blue-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("email", {
                    required: "Campo obligatorio",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Email inválido",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-orange-400 hover:opacity-90 text-white text-sm font-medium rounded-md transition disabled:opacity-60"
              >
                {loading ? "Enviando..." : "Enviar enlace"}
              </button>

              <p className="text-center text-sm text-gray-500">
                <Link to="/login" className="text-jobit-violeta-700 hover:underline">
                  Volver al login
                </Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
