import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { ApiError, login, loginConGoogle } from "@/api";
import logoIn from "@/assets/img/logo-in.png";
import imgLogin from "@/assets/img/img-inicio-cel.png";

type LoginFormData = {
  email: string;
  password: string;
  remember: boolean;
};

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as
  | string
  | undefined;
const GOOGLE_GSI_SRC = "https://accounts.google.com/gsi/client";

interface GoogleCredentialResponse {
  credential: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: Record<string, unknown>,
          ) => void;
        };
      };
    };
  }
}

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return;

    const onCredential = async (response: GoogleCredentialResponse) => {
      try {
        const result = await loginConGoogle(response.credential);
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
      }
    };

    let inicializado = false;
    const pintarBotonGoogle = () => {
      const contenedor = googleButtonRef.current;
      if (!window.google || !contenedor) return;
      if (!inicializado) {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: onCredential,
        });
        inicializado = true;
      }
      // GIS no acepta más de 400px de ancho; el stack de botones respeta ese límite
      const ancho = Math.min(Math.round(contenedor.offsetWidth) || 320, 400);
      contenedor.innerHTML = "";
      window.google.accounts.id.renderButton(contenedor, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        width: ancho,
      });
    };

    // Re-renderiza el botón cuando cambia el ancho disponible (responsive)
    let timer: number | undefined;
    const observer = new ResizeObserver(() => {
      window.clearTimeout(timer);
      timer = window.setTimeout(pintarBotonGoogle, 150);
    });
    if (googleButtonRef.current) {
      observer.observe(googleButtonRef.current);
    }

    if (window.google) {
      pintarBotonGoogle();
    } else {
      const script = document.createElement("script");
      script.src = GOOGLE_GSI_SRC;
      script.async = true;
      script.onload = pintarBotonGoogle;
      document.head.appendChild(script);
    }

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                <Link to="/olvide-contrasena" className="ml-auto hover:underline">
                  Olvidaste tu contraseña?
                </Link>
              </div>

              {/* Botones: mismo ancho los tres (máx. 400px, límite del botón de Google)
                  y alto/tipografía del botón de Google: 40px, Roboto 500, 14px */}
              <div className="w-full max-w-[400px] mx-auto space-y-4 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 bg-[#78499A] hover:bg-[#653d84] text-white font-roboto font-medium text-sm rounded-md transition disabled:opacity-60"
                >
                  {loading ? "Ingresando..." : "Ingresar"}
                </button>

                {/* Login con Google (visible solo si hay client ID configurado) */}
                {GOOGLE_CLIENT_ID && (
                  <>
                    <div ref={googleButtonRef} className="w-full h-10" />
                    <div className="flex items-center gap-3 text-[#8E8E8E] font-roboto text-sm">
                      <span className="flex-1 border-t border-gray-200" />
                      o
                      <span className="flex-1 border-t border-gray-200" />
                    </div>
                  </>
                )}

                {/* Botón Registrarse (no figura en el frame de Figma; se mantiene a pedido) */}
                <button
                  type="button"
                  onClick={() => navigate("/register")}
                  className="w-full h-10 bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 font-roboto font-medium text-sm rounded-md block transition"
                >
                  Registrate como Prestador
                </button>
              </div>
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
