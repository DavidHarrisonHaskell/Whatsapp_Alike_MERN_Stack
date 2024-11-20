import './signupPage.css';
import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const NewUserRegistration = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const register_link = 'http://127.0.0.1:5000/auth/register';

    const register = async () => {
        try {
            if (!name ||!email ||!password) {
                alert('Please fill in all fields');
                return;
            }
            const response = await axios.post(register_link, {
                "name": name,
                "email": email,
                "password": password
            });
            setName('');
            setEmail('');
            setPassword('');
            alert(response.data.message);
            navigate('/');
        } catch (error) {
            console.error('error: ', error)
            alert(error.response.data.error);
        }
    }

    return (
        <div className="LoginNewUserRegistration">
            <h1>New User Registration</h1>
            <label>Name:</label>
            <input type="text" onChange={e => setName(e.target.value)} />
            <br />
            <label>Email:</label>
            <input type="text" onChange={e => setEmail(e.target.value)} />
            <br />
            <label>Password:</label>
            <input type="password" onChange={e => setPassword(e.target.value)} />
            <br />
            <button className='LoginButtonNewUserRegistration' onClick={register}>Create</button><br /><br />
            <Button variant="secondary" onClick={() => navigate('/')}>Cancel</Button>
        </div>
    );
}
export default NewUserRegistration;