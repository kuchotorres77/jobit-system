import { ListPlus, Search } from "lucide-react";
import { MenuOpciones } from "./components/MenuOpciones";

export default function AdminMenuServicios() {
  return (
    <MenuOpciones
      titulo="Administrar Servicios"
      opciones={[
        {
          titulo: "Registrar Servicio",
          descripcion: "Crear un rubro nuevo con sus subrubros",
          to: "/admin/servicios/registrar",
          icono: <ListPlus size={28} />,
        },
        {
          titulo: "Buscar Servicio",
          descripcion: "Ver, modificar o eliminar rubros del catálogo",
          to: "/admin/servicios/buscar",
          icono: <Search size={28} />,
        },
      ]}
    />
  );
}
