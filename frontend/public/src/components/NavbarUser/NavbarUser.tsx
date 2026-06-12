import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { logout } from "@/api";
import { useSession } from "@/hooks/useSession";
import logo from "@/assets/img/logo.png";

export const NavbarUser = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const user = useSession()
  const navigate = useNavigate()

  const iniciales = user
    ? `${user.nombre.charAt(0)}${user.apellido.charAt(0)}`.toUpperCase()
    : ""

  useEffect(() => {
    if (!menuOpen) return
    const onClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [menuOpen])

  const handleLogout = () => {
    void logout()
    setMenuOpen(false)
    setIsOpen(false)
    navigate("/")
  }

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md shadow z-50 px-4 md:px-8">
      <div className="container mx-auto flex items-center justify-between flex-wrap md:flex-nowrap py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="Logo" width={30} />
          </Link>
        </div>

        {/* Botón hamburguesa (mobile) */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 focus:outline-none"
          >
            {!isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>

        {/* Menú de navegación */}
        <div
          className={`w-full md:flex md:items-center md:justify-end md:w-auto md:space-x-4 mt-4 md:mt-0 ${isOpen ? "block" : "hidden"
            }`}
        >
          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 text-gray-700 font-semibold">
            {/* Secciones del home: con "/#id" funcionan desde cualquier página */}
            <li><Link to="/#inicio" onClick={() => setIsOpen(false)} className="block px-4 py-2 hover:text-orange-600">Inicio</Link></li>
            <li><Link to="/servicios" onClick={() => setIsOpen(false)} className="block px-4 py-2 hover:text-orange-600">Servicios</Link></li>
            <li><Link to="/#agendame" onClick={() => setIsOpen(false)} className="block px-4 py-2 hover:text-orange-600">Agendame</Link></li>
            <li><Link to="/#capacitate" onClick={() => setIsOpen(false)} className="block px-4 py-2 hover:text-orange-600">Capacitate</Link></li>
            <li><Link to="/#contactos" onClick={() => setIsOpen(false)} className="block px-4 py-2 hover:text-orange-600">Contactos</Link></li>
          </ul>

          {!user ? (
            /* Botón Ingresar */
            <div className="mt-4 md:mt-0 md:ml-4">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-jobit-violeta-900 text-white px-4 py-2 rounded hover:opacity-90 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Ingresar</span>
              </Link>
            </div>
          ) : (
            /* Usuario logueado: avatar + nombre + menú */
            <div className="mt-4 md:mt-0 md:ml-4 relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-full md:pr-3 hover:bg-gray-100 transition focus:outline-none"
              >
                <span className="w-9 h-9 rounded-full bg-gradient-to-b from-jobit-violeta-700 to-jobit-violeta-900 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {iniciales}
                </span>
                <span className="text-gray-700 font-semibold">
                  {user.nombre} {user.apellido}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 transition-transform ${menuOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {menuOpen && (
                <div className="md:absolute md:right-0 md:mt-2 md:w-48 bg-white md:rounded-md md:shadow-lg md:border md:border-gray-100 py-1 mt-2">
                  <Link
                    to="/perfil"
                    onClick={() => {
                      setMenuOpen(false)
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 font-semibold hover:bg-gray-100 hover:text-orange-600 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Mi perfil</span>
                  </Link>
                  <Link
                    to="/favoritos"
                    onClick={() => {
                      setMenuOpen(false)
                      setIsOpen(false)
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 font-semibold hover:bg-gray-100 hover:text-orange-600 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Mis favoritos</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-700 font-semibold hover:bg-gray-100 hover:text-orange-600 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
