import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import Swal from "sweetalert2";
import { NavbarUser, Footer, JobitInput, JobitSelect } from "@/components";
import logoLetra from "@/assets/img/logo-letra.png";
import { SubRubroComponent } from "./components/SubRubro";
import {
  ApiError,
  createPrestador,
  getRubros,
  login,
  registerUser,
  uploadFile,
  DireccionPayload,
  Rubro,
  Sexo,
} from "@/api";
import { construirServicios, ServicioForm } from "@/lib/servicios";

interface RegisterFormData {
  first_name: string;
  last_name: string;
  dni: string;
  street_address: string;
  number_address: string;
  postal_code: string;
  email: string;
  phone: string;
  password: string;
  password_confirm: string;
  descripcion: string;
}

export default function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<RegisterFormData>({
    defaultValues: {
      first_name: "",
      last_name: "",
      dni: "",
      street_address: "",
      number_address: "",
      postal_code: "",
      email: "",
      phone: "",
      password: "",
      password_confirm: "",
      descripcion: "",
    },
  });

  const [subRubros, setSubRubros] = useState<ServicioForm[]>([]);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [sexo, setSexo] = useState<string>("");
  const [provincia, setProvincia] = useState<string>("");
  const [departamento, setDepartamento] = useState<string>("");
  const [localidad, setLocalidad] = useState<string>("");
  const [foto, setFoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRubros()
      .then(setRubros)
      .catch(() => {
        Swal.fire({
          title: "No se pudieron cargar los rubros",
          text: "Verifique que el servidor esté disponible.",
          icon: "warning",
        });
      });
  }, []);

  // Opciones "Rubro — Subrubro" y mapa etiqueta → subrubroId
  const { subrubroOptions, subrubroIdPorEtiqueta } = useMemo(() => {
    const opciones: string[] = [];
    const mapa = new Map<string, string>();
    for (const rubro of rubros) {
      for (const subrubro of rubro.subrubros) {
        const etiqueta = `${rubro.nombre} — ${subrubro.nombre}`;
        opciones.push(etiqueta);
        mapa.set(etiqueta, subrubro.id);
      }
    }
    return { subrubroOptions: opciones, subrubroIdPorEtiqueta: mapa };
  }, [rubros]);

  const onSubmit = async (data: RegisterFormData) => {
    if (!data.first_name || !data.last_name || !data.dni || !data.email) {
      Swal.fire({
        title: "Faltan datos personales",
        text: "Nombre, apellido, documento y e-mail son obligatorios.",
        icon: "warning",
      });
      return;
    }

    if (data.password.length < 8) {
      Swal.fire({
        title: "Contraseña muy corta",
        text: "Debe tener al menos 8 caracteres.",
        icon: "warning",
      });
      return;
    }

    if (data.password !== data.password_confirm) {
      Swal.fire({
        title: "Las contraseñas no coinciden",
        icon: "warning",
      });
      return;
    }

    const servicios = construirServicios(subRubros, subrubroIdPorEtiqueta);
    if (!servicios) {
      Swal.fire({
        title: "Servicios incompletos",
        text: "Seleccione al menos un subrubro con zona de cobertura y disponibilidad (días y horario).",
        icon: "warning",
      });
      return;
    }

    const sexoPayload: Sexo | undefined =
      sexo === "femenino" ? "FEMENINO" : sexo === "masculino" ? "MASCULINO" : undefined;

    const calle = [data.street_address.trim(), data.number_address.trim()]
      .filter(Boolean)
      .join(" ");

    const direccion: DireccionPayload | undefined =
      calle && data.postal_code && provincia
        ? {
            calle,
            codigoPostal: data.postal_code,
            provincia,
            departamento: departamento || undefined,
            localidad: localidad || undefined,
          }
        : undefined;

    setLoading(true);
    try {
      await registerUser({
        nombre: data.first_name,
        apellido: data.last_name,
        documento: data.dni,
        email: data.email,
        password: data.password,
        sexo: sexoPayload,
        telefono: data.phone.trim() || undefined,
        direccion,
      });

      await login({ email: data.email, password: data.password });

      await createPrestador({
        descripcion: data.descripcion || undefined,
        servicios,
      });

      let avisoFoto = "";
      if (foto) {
        try {
          await uploadFile(foto);
        } catch {
          avisoFoto = " La foto no se pudo subir; podés intentarlo más adelante.";
        }
      }

      await Swal.fire({
        title: "¡Registro exitoso!",
        text: `Tu perfil de prestador ya está creado.${avisoFoto}`,
        icon: avisoFoto ? "warning" : "success",
      });
      navigate("/");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo conectar con el servidor";
      Swal.fire({ title: "Error en el registro", text: message, icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <NavbarUser />
      <div className="m-10 p-12">
        <h1 className="text-3xl font-medium text-center pb-5">
          Ser un
          <img
            src={logoLetra}
            width="120"
            className="inline-block align-middle"
          />
        </h1>
        <h2 className="text-lg font-semibold text-center">
          Para hacer un Jobit y ofrecer tu servicio, necesitas registrarte y crear tu cuenta.
        </h2>
        <h2 className="text-lg font-semibold text-center">
          ¡Es muy sencillo y solo te llevará un minuto!
        </h2>
      </div>

      <div className="m-10 md:px-5 lg:px-14 2xl:px-80">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* DATOS PERSONALES */}
          <section>
            <h2 className="text-base text-gray-500 text-right font-semibold" >
              Datos Personales
            </h2>
            <div className="border-t border-gray-400 pb-12">
              <div className="mt-6 grid sm:grid-cols-6 gap-6">
                <div className="sm:col-span-3">
                  <JobitInput
                    label={"Nombre"}
                    register={register}
                    name={"first_name"}
                  />
                </div>
                <div className="sm:col-span-3">
                  <JobitInput
                    label={"Apellido"}
                    register={register}
                    name={"last_name"}
                  />
                </div>
                <div className="sm:col-span-2">
                  <JobitInput
                    label={"Documento"}
                    register={register}
                    name={"dni"}
                  />
                </div>
                <div className="sm:col-span-1">
                  <JobitSelect
                    label="Género"
                    options={["femenino", "masculino"]}
                    value={sexo}
                    onChange={(val) => setSexo(val as string)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* CUENTA Y CONTACTO */}
          <section>
            <h2 className="text-base text-gray-500 text-right font-semibold" >
              Cuenta y Contacto
            </h2>
            <div className="border-t border-gray-400 pb-12">
              <div className="mt-6 grid sm:grid-cols-6 gap-6">
                <div className="sm:col-span-3">
                  <JobitInput
                    label={"E-mail"}
                    register={register}
                    name={"email"}
                    type="email"
                  />
                </div>
                <div className="sm:col-span-3">
                  <JobitInput
                    label={"Teléfono"}
                    register={register}
                    name={"phone"}
                    type="number"
                  />
                </div>
                <div className="sm:col-span-3">
                  <JobitInput
                    label={"Contraseña"}
                    register={register}
                    name={"password"}
                    type="password"
                  />
                </div>
                <div className="sm:col-span-3">
                  <JobitInput
                    label={"Repetir Contraseña"}
                    register={register}
                    name={"password_confirm"}
                    type="password"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* DOMICILIO */}
          <section>
            <h2 className="text-base text-gray-500 text-right font-semibold" >
              Domicilio
            </h2>
            <div className="border-t border-gray-400 pb-12">
              <div className="mt-6 grid sm:grid-cols-6 gap-6">
                <div className="sm:col-span-4">
                  <JobitInput
                    label={"Dirección"}
                    register={register}
                    name={"street_address"}
                  />
                </div>
                <div className="sm:col-span-1">
                  <JobitInput
                    label={"N°"}
                    register={register}
                    name={"number_address"}
                    type="number"
                  />
                </div>
                <div className="sm:col-span-1">
                  <JobitInput
                    label={"Código Postal"}
                    register={register}
                    name={"postal_code"}
                    type="number"
                  />
                </div>
                <div className="sm:col-span-2">
                  <JobitSelect
                    label="Provincia"
                    options={["San Juan", "Mendoza", "San Luis", "La Rioja"]}
                    value={provincia}
                    onChange={(val) => setProvincia(val as string)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <JobitSelect
                    label="Departamento"
                    options={["Capital", "Rawson", "Pocito", "Rivadavia"]}
                    value={departamento}
                    onChange={(val) => setDepartamento(val as string)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <JobitSelect
                    label="Localidad"
                    options={["Villa Aberastain", "Villa Krause", "Concepción", "Villa Barboza"]}
                    value={localidad}
                    onChange={(val) => setLocalidad(val as string)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* DESCRIPCIÓN */}
          <section>
            <label htmlFor="descripcion" className="block text-base text-gray-500 text-right font-semibold">
              Descripción de Perfil
            </label>

            <div className="border-t border-gray-400 pb-12 mt-1">
              <textarea
                id="descripcion"
                placeholder="Escribe aquí en pocas palabras, tus habilidades y lo que sabes hacer."
                rows={4}
                className="mt-6 w-full border border-gray-300 rounded-md py-1.5 px-3
                 focus:outline-none focus:border-blue-700"
                {...register("descripcion")}
              />

              <div className="mt-4">
                <label htmlFor="foto" className="block text-sm font-semibold text-gray-700 mb-1">
                  Foto de perfil (opcional)
                </label>
                <input
                  id="foto"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
                  className="block text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0
                   file:bg-orange-400 file:px-3 file:py-1.5 file:text-sm file:text-white file:cursor-pointer"
                />
              </div>
            </div>
          </section>

          {/* SERVICIOS */}
          <section>
            <h2 className="text-base text-gray-500 text-right font-semibold" >
              Servicios
            </h2>
            <h3 className="border-t border-gray-400 text-sm text-gray-500 text-center font-semibold pb-10" >
              Si el rubro que desea seleccionar no se encuentra en nuestra lista, informarlo a través de la opción "Solicitar Registrar Rubro". <br />
              Ingresar al día siguiente e intentar registrarse nuevamente.
            </h3>
            <div className="pb-12">
              <SubRubroComponent
                subRubroArray={subRubros}
                subrubrosOptions={subrubroOptions}
                onChange={setSubRubros}
              />
            </div>
          </section>

          <div className="mt-6 flex justify-end gap-6">
            <button
              type="button"
              className="text-sm font-semibold"
              onClick={() => navigate("/")}
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-orange-400 px-3 py-2 text-sm text-white disabled:opacity-60"
            >
              {loading ? "Registrando..." : "Registrarme"}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </Box>
  );
}
