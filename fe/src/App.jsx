import 'bootstrap/dist/css/bootstrap.min.css'
import { Routes, Route, Outlet } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { useEffect } from 'react';
import ChatPage from './pages/chatPage'
import Login from "./pages/loginPage"
import SignupPage from "./pages/signupPage"
function App() {

  
  const ProtectedRoute = () => {
    // Implement your authentication logic here
    // For example, you can check if a user is logged in and redirect to login page if not
    const successfulLogin = sessionStorage.getItem('successfulLogin');
    const token = sessionStorage.getItem('token');
    if (successfulLogin && token) {
      return <Outlet />
    } else {
      return <Navigate to="/login" />
    }
  }


  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="" element={<ChatPage />} />
        </Route>

        {/* <Route path="/chat" element={<ChatPage />} /> */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </>
  )
}

export default App
