import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ApiError, verifyEmail } from "@/api";
import logoIn from "@/assets/img/logo-in.png";

export default function VerificarEmail() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";

  const [estado, setEstado] = useState<"verificando" | "ok" | "error">("verificando");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!token) {
      setEstado("error");
      setMensaje("El enlace no contiene un token válido.");
      return;
    }

    verifyEmail(token)
      .then(() => setEstado("ok"))
      .catch((err) => {
        const msg =
          err instanceof ApiError
            ? err.message
            : "No se pudo conectar con el servidor";
        setMensaje(msg);
        setEstado("error");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <a href="/" className="mb-8">
        <img src={logoIn} width="200" alt="Logo" />
      </a>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 max-w-md w-full text-center">
        {estado === "verificando" && (
          <p className="text-gray-500">Verificando tu cuenta...</p>
        )}

        {estado === "ok" && (
          <>
            <div className="text-5xl mb-4">✓</div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              ¡Email verificado!
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Tu cuenta quedó verificada correctamente.
            </p>
            <Link
              to="/login"
              className="inline-block rounded-md bg-orange-400 px-6 py-2 text-sm text-white hover:opacity-90 transition"
            >
              Iniciar sesión
            </Link>
          </>
        )}

        {estado === "error" && (
          <>
            <div className="text-5xl mb-4">✗</div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              Enlace inválido
            </h1>
            <p className="text-sm text-gray-500 mb-6">{mensaje}</p>
            <Link
              to="/"
              className="text-sm text-jobit-violeta-700 hover:underline"
            >
              Volver al inicio
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
