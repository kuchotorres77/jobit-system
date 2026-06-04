import { Navigate, createBrowserRouter } from "react-router-dom";
import Home from '../pages/home/Home'
import Login from '../pages/auth/login/Login'
import Register from '../pages/auth/register/Register'
import AppLayout from '../shared/AppLayout'

export const router = createBrowserRouter([
    {
      path: '/',
      // element: <AppLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: "*", element: <Navigate to="/" replace /> },
      ]
    }
  ])