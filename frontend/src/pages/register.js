import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

function Register() {
    const [studentId, setStudentId] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [permission, setPermission] = useState('user');
    const [name, setName] = useState('');

    const fetchRegister = async () => {
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/users/register', {
                name,
                studentId,
                email,
                password,
            });
            console.log(response.data);
            if (response.data.status === 'success') {
                alert('Registration successful');
                // Redirect to login page or home page
                window.location.href = '/home-login';
            } else {
                alert('Registration failed');
            }
        } catch (error) {
            console.error("Error registering:", error.response?.data || error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        fetchRegister();
    };

    return (
        <div className="flex justify-center min-h-screen items-center bg-[#ececec]">
            <div className='container mx-auto'>
                <div className='flex row justify-center items-center'>
                    <form onSubmit={handleSubmit} className="space-y-4 w-1/4">
                        <div className='w-full flex justify-center'>
                            <div className='w-fit'>
                                <NavLink to="/" className="text-center text-black text-3xl font-bold">
                                    Boardgames
                                </NavLink>
                                <p className='text-right text-s'>KMUTNB</p>
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-left">Welcome !</h2>
                        <p className="text-base font-light text-left">Already have an account? <NavLink to="/login" className="text-black font-medium" style={{ textDecoration: 'underline' }}>Sign in<span style={{ textDecoration: 'underline' }}>-{'>'}</span></NavLink></p>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="border border-black rounded-3xl p-2 pl-5 bg-transparent w-full"
                            style={{ borderWidth: '1px' }}
                        />
                        <input
                            type="text"
                            placeholder="Student ID"
                            value={studentId}
                            onChange={(e) => setStudentId(e.target.value)}
                            className="border border-black rounded-3xl p-2 pl-5 bg-transparent w-full"
                            style={{ borderWidth: '1px' }}
                        />
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
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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