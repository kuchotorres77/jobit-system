import { Search, UserPlus } from "lucide-react";
import { MenuOpciones } from "./components/MenuOpciones";

export default function AdminMenuJobit() {
  return (
    <MenuOpciones
      titulo="Administrar Jobit"
      opciones={[
        {
          titulo: "Registrar Jobit",
          descripcion: "Dar de alta un prestador con su cuenta y servicios",
          to: "/admin/jobits/registrar",
          icono: <UserPlus size={28} />,
        },
        {
          titulo: "Buscar Jobit",
          descripcion: "Buscar prestadores para modificarlos o eliminarlos",
          to: "/admin/jobits/buscar",
          icono: <Search size={28} />,
        },
      ]}
    />
  );
}
