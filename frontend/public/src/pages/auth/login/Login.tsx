import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { ApiError, login } from "@/api";

type LoginFormData = {
  email: string;
  password: string;
  remember: boolean;
};

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const result = await login({ email: data.email, password: data.password });
      await Swal.fire({
        title: `¡Bienvenido, ${result.user.nombre}!`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo conectar con el servidor";
      Swal.fire({ title: "Error al iniciar sesión", text: message, icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 pt-8 mx-auto h-screen lg:bg-black bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-screen-lg bg-white rounded-sm lg:shadow-lg overflow-hidden">
        {/* Columna del Formulario */}
        <div className="p-6 md:p-10 lg:p-16 space-y-8">
          {/* Logo */}
          <div className="text-center lg:text-left">
            <a href="/">
              <img
                src="/src/assets/img/logo-in.png"
                width="250"
                className="mx-auto lg:mx-0"
                alt="Logo"
              />
            </a>
          </div>

          {/* Formulario */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-lg text-gray-900 font-semibold"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                placeholder="Ingrese aquí su e-mail"
                className={`border border-gray-300 rounded-md block w-full p-3 hover:border-b-red-400 hover:border-b-4 focus:outline-none ${errors.email ? "border-red-500" : ""
                  }`}
                {...register("email", {
                  required: "Campo obligatorio",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Ingrese un e-mail válido",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-lg text-gray-900 font-semibold"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                placeholder="Ingrese aquí su contraseña"
                className={`border border-gray-300 rounded-md block w-full p-3 hover:border-b-red-400 hover:border-b-4 focus:outline-none ${errors.password ? "border-red-500" : ""
                  }`}
                {...register("password", { required: "Campo obligatorio" })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Recuérdame + Olvidé contraseña */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                  {...register("remember")}
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="remember" className="text-gray-600">
                  Recuérdame
                </label>
              </div>
              <a href="#" className="ml-auto text-gray-600 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* Botón Ingresar */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#78499A] text-white text-xl font-medium rounded-md block p-3 hover:bg-[#653d84] transition disabled:opacity-60"
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>

            {/* Línea divisoria */}
            <div className="flex items-center gap-4">
              <hr className="flex-grow border-gray-300" />
              <span className="text-gray-500 font-medium">o</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Botón Registrarse */}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-full bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 text-xl font-medium rounded-md block p-3 transition"
            >
              Registrarse
            </button>
          </form>
        </div>

        {/* Columna de la Imagen */}
        <div className="hidden lg:flex items-center justify-center bg-[#78499A]">
          <img
            src="/src/assets/img/img-inicio-cel.png"
            alt="Imagen Login"
            className="rounded-md max-h-full"
          />
        </div>
      </div>
    </div>
  );
};
