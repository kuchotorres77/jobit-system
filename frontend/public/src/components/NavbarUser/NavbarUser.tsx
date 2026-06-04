import { useState } from "react"
import { Link } from "react-router-dom"
import logo from "@/assets/img/logo.png";

export const NavbarUser = () => {
  const [isOpen, setIsOpen] = useState(false)

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
            <li><a href="#inicio" className="block px-4 py-2 hover:text-orange-600">Inicio</a></li>
            <li><a href="#agendame" className="block px-4 py-2 hover:text-orange-600">Agendame</a></li>
            <li><a href="#capacitate" className="block px-4 py-2 hover:text-orange-600">Capacitate</a></li>
            <li><a href="#contactos" className="block px-4 py-2 hover:text-orange-600">Contactos</a></li>
          </ul>

          {/* Botón Ingresar */}
          <div className="mt-4 md:mt-0 md:ml-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
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
        </div>
      </div>
    </nav>
  )
}
