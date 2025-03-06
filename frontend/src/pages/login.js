import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/users/login', {
                email,
                password,
            },
                { withCredentials: true }
            );

            if (response.data.status === 'success') {
                const userId = response.data.data.id; // สมมติว่าไอดีของผู้ใช้ถูกส่งกลับมาใน response
                localStorage.setItem('userId', userId); // เก็บไอดีของผู้ใช้ใน localStorage
            
                if (response.data.data.permission === 'admin') {
                    alert('Login successful');
                    window.location.href = '/dashboard';
                } else if (response.data.data.permission === 'user') {
                    alert('Login successful');
                    window.location.href = '/home-login';
                }
            } else {
                alert('Login failed');
            }
        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <div className="flex justify-center min-h-screen items-center bg-[#ececec]">
            <div className='container mx-auto'>
                <div className='flex col justify-center items-center'>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className='w-full flex justify-center'>
                            <div className='w-fit'>
                                <NavLink to="/" className="text-center text-black text-3xl font-bold">
                                    Boardgames
                                </NavLink>
                                <p className='text-right text-s'>KMUTNB</p>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-left">Welcome back !</h2>
                        <p className="text-base font-light">Enter your email and password</p>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-black rounded-3xl p-2 pl-5 bg-transparent w-full"
                            style={{ borderWidth: '1px' }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-black rounded-3xl p-2 pl-5 bg-transparent w-full"
                            style={{ borderWidth: '1px' }}
                        />
                        <div className='flex justify-center'>
                            <button type="submit" className="btn-search">Sign in</button>
                        </div>
                        <div>
                            <p className="text-base font-light text-center">Don't have an account? <NavLink to="/register" className="text-black" style={{ textDecoration: 'underline' }}>Register<span style={{ textDecoration: 'underline' }}>-{'>'}</span></NavLink></p>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
}

export default Login;