import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { ApiError, login } from "@/api";
import logoIn from "@/assets/img/logo-in.png";
import imgLogin from "@/assets/img/img-inicio-cel.png";

type LoginFormData = {
  email: string;
  password: string;
  remember: boolean;
};

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-10 lg:px-20 xl:px-40 pt-8 mx-auto min-h-screen lg:bg-black bg-white">
      {/* 60/40 como el frame Login: el panel violeta es más angosto que la zona blanca */}
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] w-full bg-white rounded-sm lg:shadow-lg overflow-hidden">
        {/* Columna del Formulario */}
        <div className="p-6 md:p-10">
          {/* Logo: arriba a la izquierda de la zona blanca */}
          <a href="/" className="inline-block">
            <img src={logoIn} width="250" alt="Logo" className="mx-auto lg:mx-0" />
          </a>

          {/* Formulario */}
          <div className="lg:px-4 lg:mx-32">
            <form
              className="mt-8 mb-20 w-full mx-auto sm:mx-0 space-y-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Usuario */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-3 text-lg font-semibold text-[#263A43]"
                >
                  Usuario
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Ingrese aquí su mail de usuario"
                  className={`block w-full h-[57px] px-4 rounded-md bg-white shadow-md border border-gray-100 border-b-[3px] placeholder:text-[#8E8E8E] focus:outline-none ${errors.email ? "border-b-red-600" : "border-b-[#FF5722]"
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
                  className="block mb-3 text-lg font-semibold text-[#263A43]"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Ingrese aquí su contraseña"
                    className={`block w-full h-[57px] px-4 pr-12 rounded-md bg-white shadow-md border border-gray-100 placeholder:text-[#8E8E8E] focus:outline-none ${errors.password ? "border-b-[3px] border-b-red-600" : ""
                      }`}
                    {...register("password", { required: "Campo obligatorio" })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8E8E8E] hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Recuérdame + Olvidé contraseña */}
              <div className="flex items-center text-[#8E8E8E]">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                  {...register("remember")}
                />
                <label htmlFor="remember" className="ml-2 text-sm">
                  Recuerdame?
                </label>
                <a href="#" className="ml-auto hover:underline">
                  Olvidaste tu contraseña?
                </a>
              </div>

              {/* Botón Ingresar */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#78499A] hover:bg-[#653d84] text-white text-lg font-bold rounded-md transition disabled:opacity-60 p-2"
              >
                {loading ? "Ingresando..." : "Ingresar"}
              </button>

              {/* Botón Registrarse (no figura en el frame de Figma; se mantiene a pedido) */}
              <button
                type="button"
                onClick={() => navigate("/register")}
                className="w-full bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 text-lg font-medium rounded-md block p-2 transition"
              >
                Registrarse
              </button>
            </form>
          </div>
        </div>

        {/* Columna de la Imagen: la foto pisa el borde del panel violeta como en el frame Login de Figma */}
        <div className="hidden lg:block relative bg-[#78499A]">
          <img
            src={imgLogin}
            alt="Imagen Login"
            className="absolute top-1/2 -translate-y-1/2 w-[500px] -left-24 max-w-none rounded-[20px] shadow-xl"
          />
        </div>
      </div>
    </div>
  );
};
