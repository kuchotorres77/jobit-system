import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { JobitInput, JobitSelect } from "@/components";
import { SubRubroComponent } from "../auth/register/components/SubRubro";
import {
  adminCrearJobit,
  ApiError,
  getRubros,
  DireccionPayload,
  Rubro,
  Sexo,
} from "@/api";
import { construirServicios, ServicioForm } from "@/lib/servicios";

interface FormData {
  nombre: string;
  apellido: string;
  documento: string;
  email: string;
  password: string;
  telefono: string;
  calle: string;
  codigoPostal: string;
  descripcion: string;
}

export default function AdminRegistrarJobit() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<FormData>({
    defaultValues: {
      nombre: "",
      apellido: "",
      documento: "",
      email: "",
      password: "",
      telefono: "",
      calle: "",
      codigoPostal: "",
      descripcion: "",
    },
  });

  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [subRubros, setSubRubros] = useState<ServicioForm[]>([]);
  const [sexo, setSexo] = useState("");
  const [provincia, setProvincia] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    getRubros()
      .then(setRubros)
      .catch(() => undefined);
  }, []);

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

  const onSubmit = async (data: FormData) => {
    if (!data.nombre || !data.apellido || !data.documento || !data.email) {
      Swal.fire({
        title: "Faltan datos",
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
    const servicios = construirServicios(subRubros, subrubroIdPorEtiqueta);
    if (!servicios) {
      Swal.fire({
        title: "Servicios incompletos",
        text: "Cada servicio necesita subrubro, zona y disponibilidad.",
        icon: "warning",
      });
      return;
    }

    const sexoPayload: Sexo | undefined =
      sexo === "femenino" ? "FEMENINO" : sexo === "masculino" ? "MASCULINO" : undefined;
    const direccion: DireccionPayload | undefined =
      data.calle.trim() && data.codigoPostal.trim() && provincia
        ? {
            calle: data.calle.trim(),
            codigoPostal: data.codigoPostal.trim(),
            provincia,
            departamento: departamento || undefined,
            localidad: localidad || undefined,
          }
        : undefined;

    setGuardando(true);
    try {
      const prestador = await adminCrearJobit({
        nombre: data.nombre,
        apellido: data.apellido,
        documento: data.documento,
        email: data.email,
        password: data.password,
        sexo: sexoPayload,
        telefono: data.telefono.trim() || undefined,
        direccion,
        descripcion: data.descripcion || undefined,
        servicios,
      });
      await Swal.fire({
        title: "Jobit registrado",
        text: `${prestador.user.nombre} ${prestador.user.apellido} ya está dado de alta.`,
        icon: "success",
      });
      navigate("/admin/jobits/buscar");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo conectar con el servidor";
      Swal.fire({ title: "Error al registrar", text: message, icon: "error" });
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Registrar Jobit</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <section>
          <h2 className="text-base text-gray-500 text-right font-semibold">
            Datos Personales
          </h2>
          <div className="border-t border-gray-400 pb-12">
            <div className="mt-6 grid sm:grid-cols-6 gap-6">
              <div className="sm:col-span-3">
                <JobitInput label={"Nombre"} register={register} name={"nombre"} />
              </div>
              <div className="sm:col-span-3">
                <JobitInput label={"Apellido"} register={register} name={"apellido"} />
              </div>
              <div className="sm:col-span-2">
                <JobitInput label={"Documento"} register={register} name={"documento"} />
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

        <section>
          <h2 className="text-base text-gray-500 text-right font-semibold">
            Cuenta y Contacto
          </h2>
          <div className="border-t border-gray-400 pb-12">
            <div className="mt-6 grid sm:grid-cols-6 gap-6">
              <div className="sm:col-span-3">
                <JobitInput label={"E-mail"} register={register} name={"email"} type="email" />
              </div>
              <div className="sm:col-span-3">
                <JobitInput label={"Teléfono"} register={register} name={"telefono"} type="number" />
              </div>
              <div className="sm:col-span-3">
                <JobitInput label={"Contraseña"} register={register} name={"password"} type="password" />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base text-gray-500 text-right font-semibold">Domicilio</h2>
          <div className="border-t border-gray-400 pb-12">
            <div className="mt-6 grid sm:grid-cols-6 gap-6">
              <div className="sm:col-span-4">
                <JobitInput label={"Dirección"} register={register} name={"calle"} />
              </div>
              <div className="sm:col-span-2">
                <JobitInput label={"Código Postal"} register={register} name={"codigoPostal"} type="number" />
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

        <section>
          <label htmlFor="descripcion" className="block text-base text-gray-500 text-right font-semibold">
            Descripción de Perfil
          </label>
          <div className="border-t border-gray-400 pb-12 mt-1">
            <textarea
              id="descripcion"
              rows={4}
              placeholder="Habilidades y experiencia del prestador."
              className="mt-6 w-full border border-gray-300 rounded-md py-1.5 px-3 focus:outline-none focus:border-blue-700"
              {...register("descripcion")}
            />
          </div>
        </section>

        <section>
          <h2 className="text-base text-gray-500 text-right font-semibold">Servicios</h2>
          <div className="border-t border-gray-400 pt-10 pb-12">
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
            onClick={() => navigate("/admin/jobits")}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={guardando}
            className="rounded-md bg-orange-400 px-3 py-2 text-sm text-white disabled:opacity-60"
          >
            {guardando ? "Registrando..." : "Registrar Jobit"}
          </button>
        </div>
      </form>
    </div>
  );
}
