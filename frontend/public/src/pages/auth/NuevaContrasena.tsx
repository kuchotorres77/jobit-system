import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { ApiError, resetPassword } from "@/api";
import logoIn from "@/assets/img/logo-in.png";

interface FormData {
  password: string;
  confirmar: string;
}

export default function NuevaContrasena() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    if (!token) {
      setError("El enlace no contiene un token válido.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await resetPassword(token, data.password);
      await navigate("/login");
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
        <h1 className="text-xl font-semibold text-gray-900 mb-1">
          Nueva contraseña
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Elegí una contraseña de al menos 8 caracteres.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 8 caracteres"
                className={`block w-full h-[44px] px-3 pr-10 rounded-md border focus:outline-none focus:border-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                {...register("password", {
                  required: "Campo obligatorio",
                  minLength: { value: 8, message: "Mínimo 8 caracteres" },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmar"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Confirmar contraseña
            </label>
            <input
              id="confirmar"
              type={showPassword ? "text" : "password"}
              placeholder="Repetí la contraseña"
              className={`block w-full h-[44px] px-3 rounded-md border focus:outline-none focus:border-blue-500 ${
                errors.confirmar ? "border-red-500" : "border-gray-300"
              }`}
              {...register("confirmar", {
                required: "Campo obligatorio",
                validate: (val) =>
                  val === watch("password") || "Las contraseñas no coinciden",
              })}
            />
            {errors.confirmar && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmar.message}</p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-orange-400 hover:opacity-90 text-white text-sm font-medium rounded-md transition disabled:opacity-60"
          >
            {loading ? "Guardando..." : "Guardar nueva contraseña"}
          </button>

          <p className="text-center text-sm text-gray-500">
            <Link to="/login" className="text-jobit-violeta-700 hover:underline">
              Cancelar
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
