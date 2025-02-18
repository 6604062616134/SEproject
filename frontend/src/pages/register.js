import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

function Register() {
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

        if (response.data.data.permission === 'admin' && response.data.status === 'success') {
            window.location.href = '/dashboard';
            alert('Login successful');
        } else if (response.data.data.permission === 'user' && response.data.status === 'success') {
            alert('Login successful');
            window.location.href = '/home-login';
        } else {
            alert('Login failed');
        }
    };

    return (
        <div className="flex justify-center min-h-screen items-center bg-[#ececec]">
            <div className='container mx-auto'>
                <div className='flex row justify-center items-center'>
                    <form onSubmit={handleSubmit} className="space-y-4 w-1/3">
                        <div className='text-center'>
                            <NavLink to="/" className="text-black text-3xl font-bold">
                                Boardgames
                            </NavLink>
                            <p className='text-right text-s'>KMUTNB</p>
                        </div>
                        <h2 className="text-2xl font-bold text-left">Welcome !</h2>
                        <p className="text-base font-light text-left">Alredy have an account? <NavLink to="/login" className="text-black font-medium" style={{ textDecoration: 'underline' }}>Sign in<span style={{ textDecoration: 'underline' }}>-{'>'}</span></NavLink></p>
                        <input
                            type="text"
                            placeholder="Student ID"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border border-black rounded-3xl p-2 pl-5 bg-transparent w-full"
                            style={{ borderWidth: '1px' }}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="border border-black rounded-3xl p-2 pl-5 bg-transparent w-full"
                            style={{ borderWidth: '1px' }}
                        />
                        <input
                            type="password"
                            placeholder="confirm password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            <button type="submit" className="btn-search">Register</button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
}

export default Register;
