import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { JobitInput, JobitSelect } from "@/components";
import { SubRubroComponent } from "../auth/register/components/SubRubro";
import {
  adminActualizarUsuario,
  adminEliminarUsuario,
  adminGetUsuario,
  ApiError,
  getPrestador,
  getRubros,
  updatePrestador,
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

interface FormData {
  nombre: string;
  apellido: string;
  telefono: string;
  calle: string;
  codigoPostal: string;
  descripcion: string;
}

export default function AdminModifJobit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [prestador, setPrestador] = useState<Prestador | null>(null);
  const [usuario, setUsuario] = useState<PerfilUsuario | null>(null);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [subRubros, setSubRubros] = useState<ServicioForm[]>([]);
  const [provincia, setProvincia] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormData>({
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
    if (!id) return;
    const cargar = async () => {
      try {
        const [prestadorData, rubrosData] = await Promise.all([
          getPrestador(id),
          getRubros(),
        ]);
        const usuarioData = await adminGetUsuario(prestadorData.userId);

        setPrestador(prestadorData);
        setUsuario(usuarioData);
        setRubros(rubrosData);
        setSubRubros(serviciosAFormulario(prestadorData));

        const direccion = usuarioData.direcciones[0];
        const celular = usuarioData.contactos.find((c) => c.tipo === "CELULAR");
        reset({
          nombre: usuarioData.nombre,
          apellido: usuarioData.apellido,
          telefono: celular?.valor ?? "",
          calle: direccion?.calle ?? "",
          codigoPostal: direccion?.codigoPostal ?? "",
          descripcion: prestadorData.descripcion ?? "",
        });
        setProvincia(direccion?.provincia ?? "");
        setDepartamento(direccion?.departamento ?? "");
        setLocalidad(direccion?.localidad ?? "");
      } catch (error) {
        const message =
          error instanceof ApiError
            ? error.message
            : "No se pudo conectar con el servidor";
        Swal.fire({ title: "Error al cargar", text: message, icon: "error" }).then(
          () => navigate("/admin/jobits/buscar"),
        );
      } finally {
        setLoading(false);
      }
    };
    void cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
    if (!prestador || !usuario) return;

    if (!data.nombre || !data.apellido) {
      Swal.fire({ title: "Nombre y apellido son obligatorios", icon: "warning" });
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
      await adminActualizarUsuario(usuario.id, {
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
      Swal.fire({
        title: "Jobit actualizado",
        icon: "success",
        timer: 1500,
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

  const eliminar = async () => {
    if (!prestador) return;
    const respuesta = await Swal.fire({
      title: `¿Eliminar a ${prestador.user.nombre} ${prestador.user.apellido}?`,
      text: "Se elimina la cuenta completa. Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc2626",
    });
    if (!respuesta.isConfirmed) return;

    try {
      await adminEliminarUsuario(prestador.userId);
      await Swal.fire({
        title: "Jobit eliminado",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
      navigate("/admin/jobits/buscar");
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "No se pudo conectar con el servidor";
      Swal.fire({ title: "No se pudo eliminar", text: message, icon: "error" });
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 py-24">Cargando Jobit...</p>;
  }
  if (!prestador || !usuario) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Modificar Jobit — {usuario.nombre} {usuario.apellido}
        </h1>
        <button
          type="button"
          onClick={eliminar}
          className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition shrink-0"
        >
          Eliminar Jobit
        </button>
      </div>

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
              <div className="sm:col-span-3">
                <label className="block mb-1 text-sm font-semibold text-gray-700">E-mail</label>
                <p className="py-1.5 px-3 rounded-md bg-gray-100 text-gray-500 border border-gray-200">
                  {usuario.email}
                </p>
              </div>
              <div className="sm:col-span-3">
                <label className="block mb-1 text-sm font-semibold text-gray-700">Documento</label>
                <p className="py-1.5 px-3 rounded-md bg-gray-100 text-gray-500 border border-gray-200">
                  {usuario.documento ?? "—"}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base text-gray-500 text-right font-semibold">
            Contacto y Domicilio
          </h2>
          <div className="border-t border-gray-400 pb-12">
            <div className="mt-6 grid sm:grid-cols-6 gap-6">
              <div className="sm:col-span-2">
                <JobitInput label={"Teléfono"} register={register} name={"telefono"} type="number" />
              </div>
              <div className="sm:col-span-3">
                <JobitInput label={"Dirección"} register={register} name={"calle"} />
              </div>
              <div className="sm:col-span-1">
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
            onClick={() => navigate("/admin/jobits/buscar")}
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
    </div>
  );
}
