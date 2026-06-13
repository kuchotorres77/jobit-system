import { Users, Wrench } from "lucide-react";
import { MenuOpciones } from "./components/MenuOpciones";

export default function AdminInicio() {
  return (
    <MenuOpciones
      titulo="¿Qué querés administrar?"
      opciones={[
        {
          titulo: "Jobit",
          descripcion: "Registrar, buscar, modificar o eliminar prestadores",
          to: "/admin/jobits",
          icono: <Users size={28} />,
        },
        {
          titulo: "Servicios",
          descripcion: "Administrar rubros y subrubros del catálogo",
          to: "/admin/servicios",
          icono: <Wrench size={28} />,
        },
      ]}
    />
  );
}
