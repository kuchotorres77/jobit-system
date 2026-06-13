import { Navigate, createBrowserRouter } from "react-router-dom";
import Home from '../pages/home/Home'
import Login from '../pages/auth/login/Login'
import Register from '../pages/auth/register/Register'
import Servicios from '../pages/servicios/Servicios'
import PrestadorDetalle from '../pages/servicios/PrestadorDetalle'
import Perfil from '../pages/perfil/Perfil'
import Favoritos from '../pages/favoritos/Favoritos'
import AdminLayout from '../pages/admin/AdminLayout'
import AdminInicio from '../pages/admin/AdminInicio'
import AdminMenuJobit from '../pages/admin/AdminMenuJobit'
import AdminMenuServicios from '../pages/admin/AdminMenuServicios'
import AdminRegistrarJobit from '../pages/admin/AdminRegistrarJobit'
import AdminBuscarJobit from '../pages/admin/AdminBuscarJobit'
import AdminModifJobit from '../pages/admin/AdminModifJobit'
import AdminRegistrarServicio from '../pages/admin/AdminRegistrarServicio'
import AdminBuscarServicio from '../pages/admin/AdminBuscarServicio'
import AdminServicioDetalle from '../pages/admin/AdminServicioDetalle'
import AppLayout from '../shared/AppLayout'

export const router = createBrowserRouter([
    {
      path: '/',
      // element: <AppLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'servicios', element: <Servicios /> },
        { path: 'servicios/:id', element: <PrestadorDetalle /> },
        { path: 'perfil', element: <Perfil /> },
        { path: 'favoritos', element: <Favoritos /> },
        {
          path: 'admin',
          element: <AdminLayout />,
          children: [
            { index: true, element: <AdminInicio /> },
            { path: 'jobits', element: <AdminMenuJobit /> },
            { path: 'jobits/registrar', element: <AdminRegistrarJobit /> },
            { path: 'jobits/buscar', element: <AdminBuscarJobit /> },
            { path: 'jobits/:id', element: <AdminModifJobit /> },
            { path: 'servicios', element: <AdminMenuServicios /> },
            { path: 'servicios/registrar', element: <AdminRegistrarServicio /> },
            { path: 'servicios/buscar', element: <AdminBuscarServicio /> },
            { path: 'servicios/:id', element: <AdminServicioDetalle /> },
          ],
        },
        { path: "*", element: <Navigate to="/" replace /> },
      ]
    }
  ])
