import 'bootstrap/dist/css/bootstrap.min.css'
import { Routes, Route, Outlet} from 'react-router-dom'
import { Navigate } from 'react-router-dom'

import ChatPage from './pages/chatPage'
import Login from "./pages/loginPage"
function App() {

  return ( 
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route path="/chat" element={<ChatPage />} /> */}
        <Route path="*" element={<Navigate to="/chat" />} />
      </Routes>
    </>
  )
}

export default App
