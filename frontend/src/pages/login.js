import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post('http://localhost:8000/users/login', {
            email,
            password,
        },
            { withCredentials: true }
        );
        //console.log(response.data);
        
        if(response.data.data.permission === 'admin' && response.data.status === 'success') {
            window.location.href = '/dashboard';
            alert('Login successful');
        } else if (response.data.data.permission === 'user' && response.data.status === 'success') {
            alert('Login successful');
            window.location.href = '/ ';
        } else {
            alert('Login failed');
        }
    };

    const logout = async () => {
        try {
            const response = await axios.post(
                'http://localhost:8000/users/logout',
                {}, // ไม่มี payload
                { withCredentials: true } // เปิดใช้งาน cookies
            );
            console.log(response.data); // แสดงผลลัพธ์จากเซิร์ฟเวอร์
        } catch (error) {
            console.error('Logout failed:', error.response?.data || error.message);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            <button onClick={logout}>Logout</button>
        </div>
    );
}

export default Login;
