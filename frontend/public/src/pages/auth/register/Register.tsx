import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import { NavbarUser, Footer, JobitInput, JobitDiaHora, JobitSelect } from "@/components";
import { SubRubroComponent } from "./components/SubRubro";
import { useState } from "react";
interface Disponibilidad {
  dia: string[];
  desde: string;
  hasta: string;
}
interface SubRubro {
  nombre: string;
  zonaCobertura: string[];
  disponibilidad: Disponibilidad[];
}
export default function Register() {
  const { register, handleSubmit, control, watch } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      dni: "",
      sexo: "",
      street_address: "",
      number_address: "",
      postal_code: "",
      provincia: "",
      departamento: "",
      localidad: "",
      email: "",
      telefono: "",
      descripcion: "",
      rubros: "",
      subrubros: [],
    },
  });
  const [subRubros, setSubRubros] = useState<SubRubro[]>([]);
  const onSubmit = (data: any) => {
    console.log("FORM DATA:", data);
  };

  return (
    <Box>
      <NavbarUser />
      <div className="m-10 p-12">
        <h1 className="text-3xl font-medium text-center pb-5">
          Ser un
          <img
            src="src/assets/img/logo-letra.png"
            width="120"
            className="inline-block align-middle"
          />
        </h1>
        <h2 className="text-lg font-semibold text-center">
          Para hacer un Jobit y ofrecer tu servicio, necesitas registrarte y crear tu cuenta.
        </h2>
        <h2 className="text-lg font-semibold text-center">
          ¡Es muy sensillo y solo te llevará un minuto!
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
                    label="Genero"
                    options={["femenino", "masculino", " No Binario"]}
                    onChange={(val: any) => console.log(val)}
                  />
                </div>
                {/* <div className="sm:col-span-3">
                  <JobitSelect
                    label="Zona de Cobertura"
                    multiple
                    limit={2}
                    options={["Capital", "Rawson", "Pocito", "Rivadavia"]}
                    onChange={(v: any) => console.log(v)}
                  />
                </div> */}
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-base text-gray-500 text-right font-semibold" >
              Contacto
            </h2>
            <div className="border-t border-gray-400 pb-12">
              <div className="mt-6 grid sm:grid-cols-6 gap-6">
                <div className="sm:col-span-3">
                  <JobitInput
                    label={"E-mail"}
                    register={register}
                    name={"email"}
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
              </div>
            </div>
          </section>
          <section>
            <h2 className="text-base text-gray-500 text-right font-semibold" >
              Domicilio
            </h2>
            <div className="border-t border-gray-400 pb-12">
              <div className="mt-6 grid sm:grid-cols-6 gap-6">
                {/* Dirección */}
                <div className="sm:col-span-4">
                  <JobitInput
                    label={"Dirección"}
                    register={register}
                    name={"street_address"}
                  />
                </div>
                {/* number_address */}
                <div className="sm:col-span-1">
                  <JobitInput
                    label={"N°"}
                    register={register}
                    name={"number_address"}
                    type="number"
                  />
                </div>
                {/* Código Postal */}
                <div className="sm:col-span-1">
                  <JobitInput
                    label={"Código Postal"}
                    register={register}
                    name={"postal_code"}
                    type="number"
                  />
                </div>
                {/* Provincia */}
                <div className="sm:col-span-2">
                  <JobitSelect
                    label="Provincia"
                    limit={2}
                    options={["San Juan", "Mendoza", "San Luis", "La Rioja"]}
                    onChange={(v: any) => console.log(v)}
                  />
                </div>
                {/* Departamento */}
                <div className="sm:col-span-2">
                  <JobitSelect
                    label="Departamento"
                    limit={2}
                    options={["Capital", "Rawson", "Pocito", "Rivadavia"]}
                    onChange={(v: any) => console.log(v)}
                  />
                </div>
                {/* Localidad */}
                <div className="sm:col-span-2">
                  <JobitSelect
                    label="Localidad"
                    limit={2}
                    options={["Villa Aberastain", "Villa Krause", "Concepción", "Villa Barboza"]}
                    onChange={(v: any) => console.log(v)}
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
                name="descripcion"
                placeholder="Escribe aquí en pocas palabras, tus habilidades y lo que sabes hacer."
                rows={4}
                className="mt-6 w-full border border-gray-300 rounded-md py-1.5 px-3 
                 focus:outline-none focus:border-blue-700"
              />
            </div>
          </section>
          <section>
            <h2 className="text-base text-gray-500 text-right font-semibold" >
              Servicios
            </h2>
            <h3 className="border-t border-gray-400 text-sm text-gray-500 text-center font-semibold pb-10" >
              Si el rubro que desea seleccionar no se encuentra en nuestra lista, informarlo a travez de la opción "Solicitar Registrar Rubro". <br />
              Ingresar al día siguiente intentar registrarse nuevamente.
            </h3>
            <div className="pb-12">
              <SubRubroComponent
                subRubroArray={subRubros}
                onChange={setSubRubros}
              />
              {/* <JobitDiaHora diasOpt={["Lunes", "Martes"]} /> */}
            </div>
          </section>
          <div className="mt-6 flex justify-end gap-6">
            <button type="button" className="text-sm font-semibold">
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-md bg-orange-400 px-3 py-2 text-sm text-white"
            >
              Registrarme
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </Box>
  );
}
