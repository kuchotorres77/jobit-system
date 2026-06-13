import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { NavbarUser, Footer, JobitInput, JobitSelect } from "@/components";
import { useSession } from "@/hooks/useSession";
import { SubRubroComponent } from "../auth/register/components/SubRubro";
import {
  ApiError,
  archivoUrl,
  deleteFile,
  getMe,
  getMiPrestador,
  getRubros,
  getToken,
  saveSession,
  updateMe,
  updatePrestador,
  uploadFile,
  DireccionPayload,
  PerfilUsuario,
  Prestador,
  Rubro,
} from "@/api";
import {
  construirServicios,
  ServicioForm,
  serviciosAFormulario,
} from "@/lib/servicios";

interface PerfilFormData {
  nombre: string;
  apellido: string;
  telefono: string;
  calle: string;
  codigoPostal: string;
  descripcion: string;
}

export default function Perfil() {
  const navigate = useNavigate();
  const sessionUser = useSession();

  const [perfil, setPerfil] = useState<PerfilUsuario | null>(null);
  const [prestador, setPrestador] = useState<Prestador | null>(null);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [subRubros, setSubRubros] = useState<ServicioForm[]>([]);
  const [provincia, setProvincia] = useState<string>("");
  const [departamento, setDepartamento] = useState<string>("");
  const [localidad, setLocalidad] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [sinPerfilPrestador, setSinPerfilPrestador] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [eliminandoFoto, setEliminandoFoto] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<PerfilFormData>({
    defaultValues: {
      nombre: "",
      apellido: "",
      telefono: "",
      calle: "",
      codigoPostal: "",
      descripcion: "",
    },
  });

  useEffect(() => {
    if (!getToken()) {
      navigate("/login");
      return;
    }

    const cargar = async () => {
      try {
        const [me, rubrosData] = await Promise.all([getMe(), getRubros()]);
        setPerfil(me);
        setRubros(rubrosData);

        let prestadorData: Prestador | null = null;
        try {
          prestadorData = await getMiPrestador();
        } catch (error) {
          if (error instanceof ApiError && error.statusCode === 404) {
            setSinPerfilPrestador(true);
          } else {
            throw error;
          }
        }

        const direccion = me.direcciones[0];
        const celular = me.contactos.find((c) => c.tipo === "CELULAR");
        reset({
          nombre: me.nombre,
          apellido: me.apellido,
          telefono: celular?.valor ?? "",
          calle: direccion?.calle ?? "",
          codigoPostal: direccion?.codigoPostal ?? "",
          descripcion: prestadorData?.descripcion ?? "",
        });
        setProvincia(direccion?.provincia ?? "");
        setDepartamento(direccion?.departamento ?? "");
        setLocalidad(direccion?.localidad ?? "");

        if (prestadorData) {
          setPrestador(prestadorData);
          setSubRubros(serviciosAFormulario(prestadorData));
        }
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : "No se pudo conectar con el servidor";
        Swal.fire({ title: "Error al cargar el perfil", text: message, icon: "error" });
      } finally {
        setLoading(false);
      }
    };

    void cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const onSubmit = async (data: PerfilFormData) => {
    if (!prestador) return;

    if (!data.nombre || !data.apellido) {
      Swal.fire({
        title: "Faltan datos",
        text: "Nombre y apellido son obligatorios.",
        icon: "warning",
      });
      return;
    }

    const servicios = construirServicios(subRubros, subrubroIdPorEtiqueta);
    if (!servicios) {
      Swal.fire({
        title: "Servicios incompletos",
        text: "Cada servicio necesita subrubro, zona de cobertura y disponibilidad (días y horario).",
        icon: "warning",
      });
      return;
    }

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
      await updateMe({
        nombre: data.nombre,
        apellido: data.apellido,
        telefono: data.telefono.trim() || undefined,
        direccion,
      });

      const actualizado = await updatePrestador(prestador.id, {
        descripcion: data.descripcion || undefined,
        servicios,
      });
      setPrestador(actualizado);
      setSubRubros(serviciosAFormulario(actualizado));

      // Refleja nombre/apellido nuevos en el navbar sin pedir re-login
      const token = getToken();
      if (token && sessionUser) {
        saveSession(token, {
          ...sessionUser,
          nombre: data.nombre,
          apellido: data.apellido,
        });
      }

      Swal.fire({
        title: "Perfil actualizado",
        icon: "success",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo conectar con el servidor";
      Swal.fire({ title: "Error al guardar", text: message, icon: "error" });
    } finally {
      setGuardando(false);
    }
  };

  const onEliminarFoto = async (id: string) => {
    const confirmar = await Swal.fire({
      title: "¿Eliminár esta foto?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#f97316",
    });
    if (!confirmar.isConfirmed) return;

    setEliminandoFoto(id);
    try {
      await deleteFile(id);
      const actualizado = await getMiPrestador();
      setPrestador(actualizado);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo conectar con el servidor";
      Swal.fire({ title: "No se pudo eliminar la foto", text: message, icon: "error" });
    } finally {
      setEliminandoFoto(null);
    }
  };

  const onAgregarFoto = async (file: File | undefined) => {
    if (!file) return;
    setSubiendoFoto(true);
    try {
      await uploadFile(file);
      const actualizado = await getMiPrestador();
      setPrestador(actualizado);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo conectar con el servidor";
      Swal.fire({ title: "No se pudo subir la foto", text: message, icon: "error" });
    } finally {
      setSubiendoFoto(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarUser />

      <main className="flex-1 container mx-auto px-4 md:px-8 pt-28 pb-16">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
          Configuración de perfil
        </h1>

        {loading ? (
          <p className="text-center text-gray-500 py-24">Cargando perfil...</p>
        ) : sinPerfilPrestador ? (
          <div className="text-center py-24 space-y-4">
            <p className="text-gray-600">
              Tu cuenta todavía no tiene un perfil de prestador.
            </p>
            <Link
              to="/register"
              className="inline-block rounded-md bg-orange-400 px-4 py-2 text-white"
            >
              Registrate como Prestador
            </Link>
          </div>
        ) : !perfil || !prestador ? null : (
          <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
            {/* DATOS PERSONALES */}
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
                  <div className="sm:col-span-3">
                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                      E-mail
                    </label>
                    <p className="py-1.5 px-3 rounded-md bg-gray-100 text-gray-500 border border-gray-200">
                      {perfil.email}
                    </p>
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block mb-1 text-sm font-semibold text-gray-700">
                      Documento
                    </label>
                    <p className="py-1.5 px-3 rounded-md bg-gray-100 text-gray-500 border border-gray-200">
                      {perfil.documento ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* CONTACTO Y DOMICILIO */}
            <section>
              <h2 className="text-base text-gray-500 text-right font-semibold">
                Contacto y Domicilio
              </h2>
              <div className="border-t border-gray-400 pb-12">
                <div className="mt-6 grid sm:grid-cols-6 gap-6">
                  <div className="sm:col-span-2">
                    <JobitInput
                      label={"Teléfono"}
                      register={register}
                      name={"telefono"}
                      type="number"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <JobitInput label={"Dirección"} register={register} name={"calle"} />
                  </div>
                  <div className="sm:col-span-1">
                    <JobitInput
                      label={"Código Postal"}
                      register={register}
                      name={"codigoPostal"}
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
              <label
                htmlFor="descripcion"
                className="block text-base text-gray-500 text-right font-semibold"
              >
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
              </div>
            </section>

            {/* FOTOS */}
            <section>
              <h2 className="text-base text-gray-500 text-right font-semibold">
                Fotos
              </h2>
              <div className="border-t border-gray-400 pb-12">
                <div className="mt-6 flex flex-wrap gap-3 items-start">
                  {prestador.user.archivos.map((foto) => (
                    <div key={foto.id} className="relative group h-24 w-24">
                      <img
                        src={archivoUrl(foto.id)}
                        alt="Foto del prestador"
                        className={`h-24 w-24 rounded-lg object-cover transition ${eliminandoFoto === foto.id ? "opacity-40" : ""}`}
                      />
                      <button
                        type="button"
                        disabled={eliminandoFoto !== null}
                        onClick={() => void onEliminarFoto(foto.id)}
                        className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-500 disabled:cursor-not-allowed"
                        aria-label="Eliminar foto"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <label
                    className={`h-24 w-24 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-3xl text-gray-400 cursor-pointer hover:border-orange-400 hover:text-orange-400 transition ${subiendoFoto ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    {subiendoFoto ? "..." : "+"}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={(e) => {
                        void onAgregarFoto(e.target.files?.[0]);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  La primera foto se muestra como foto de perfil en el buscador.
                </p>
              </div>
            </section>

            {/* SERVICIOS */}
            <section>
              <h2 className="text-base text-gray-500 text-right font-semibold">
                Servicios
              </h2>
              <h3 className="border-t border-gray-400 text-sm text-gray-500 text-center font-semibold pb-10">
                Agregá, editá o eliminá los servicios que ofrecés, con su zona de
                cobertura y disponibilidad.
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
                disabled={guardando}
                className="rounded-md bg-orange-400 px-3 py-2 text-sm text-white disabled:opacity-60"
              >
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
