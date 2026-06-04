import { Outlet, NavLink } from 'react-router-dom'
import Footer from '../components/Footer'

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <nav className="container mx-auto flex gap-6 p-4">
          <NavLink to="/" className="font-semibold">Inicio</NavLink>
          <NavLink to="/login">Ingresar</NavLink>
          <NavLink to="/register" className="text-orange-600">Registrarme</NavLink>
        </nav>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
