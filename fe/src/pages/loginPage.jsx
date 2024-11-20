import './loginPage.css'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {

    const login_URL = 'http://127.0.0.1:5000/auth/login'
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const login = async () => {
        try {
            const response = await axios.post(login_URL, {
                email: email,
                password: password
            })
            if (response.data.success) {
                setEmail('')
                setPassword('')
                sessionStorage.setItem('successfulLogin', response.data.success)
                sessionStorage.setItem('token', response.data.token)
                sessionStorage.setItem('admin', response.data.admin)
                sessionStorage.setItem('name', response.data.name)
                sessionStorage.setItem('id', response.data.id)
                console.log("Login Successful")
                console.log("response.data", response.data)
                navigate('/')
            } else {
                alert(response.data.error)
            }
        } catch (error) {
            if (error.response) {
                console.error("success: ", error.response.data.success, "error: ", error.response.data.error)
                alert(error.response.data.error)
            } else if (error.request) {
                console.error("error: ", error.request)
                alert(error.request)
            }
        }
    }

    return (
        <div className='Login'>
            <label className="heading">Messenger Application</label>
            <br />
            <label>email:</label>
            <input type="text" value={email} onChange={e => setEmail(e.target.value)} /><br />
            <label>password:</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} /><br />
            <button className='LoginButton' onClick={login}>Login</button>
            <label className="newUser"> New User?
                <a className="register" href="/register" > Register</a>
            </label>
        </div>
    )
}
export default Login
