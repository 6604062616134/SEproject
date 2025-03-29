import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

function NavbarAdmin({ isMenuOpen, toggleMenu }) {
    const navigate = useNavigate();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reports, setReports] = useState([]);
    const [selectedReports, setSelectedReports] = useState([]);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/users/logout', {}, { withCredentials: true });
            localStorage.removeItem('userId');
            window.location.href = '/';
        } catch (error) {
            console.error('Error logging out:', error);
            alert('Error logging out. Please try again.');
        }
    };

    const toggleReportSelection = (reportId) => {
        setSelectedReports((prevSelected) => {
            if (prevSelected.includes(reportId)) {
                return prevSelected.filter((id) => id !== reportId);
            } else {
                return [...prevSelected, reportId];
            }
        });
    };

    const handleDone = () => {
        if (selectedReports.length === 0) {
            alert('Please select at least one report before clicking Done.');
            return;
        }

        // ลบรายงานที่เลือกออกจากรายการที่แสดง
        setReports((prevReports) => prevReports.filter((report) => !selectedReports.includes(report.id)));
        // ล้างรายการที่เลือก
        setSelectedReports([]);
        alert('Selected reports have been cleared from the list.');
    };

    const openLogoutModal = () => setIsLogoutModalOpen(true);
    const closeLogoutModal = () => setIsLogoutModalOpen(false);

    const openReportModal = () => {
        fetchReports(); // เรียก fetchReports เพื่อดึงข้อมูลรีพอร์ต
        setIsReportModalOpen(true); // เปิด Modal
    };
    const closeReportModal = () => setIsReportModalOpen(false);

    const fetchReports = async () => {
        try {
            const response = await axios.get('http://localhost:8000/reports/getReports', { withCredentials: true });
            setReports(response.data.data);
        } catch (error) {
            console.error('Error fetching reports:', error);
            alert('Failed to fetch reports. Please try again.');
        }
    };

    const copyToClipboard = (email) => {
        navigator.clipboard.writeText(email)
            .then(() => {
                alert(`Copied to clipboard: ${email}`);
            })
            .catch((error) => {
                console.error('Failed to copy email:', error);
                alert('Failed to copy email. Please try again.');
            });
    };

    return (
        <div className="font-sans">
            <div className="bg-black text-white p-5 fixed top-0 left-0 w-full z-50">
                <div className="flex items-center justify-between p-5">
                    <div className='text-center z-10' style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                        <NavLink to="/" className="text-white text-2xl font-bold">
                            Boardgames
                        </NavLink>
                        <p className='text-right text-xs'>KMUTNB</p>
                    </div>
                    <div className='flex gap-5 items-center p-4' style={{ position: 'absolute', right: '0' }}>
                        <p className='font-bold text-white cursor-pointer'>Admin</p>
                        <button onClick={openReportModal} className="underline text-white font-light cursor-pointer">
                            View Reports
                        </button>
                        <button onClick={openLogoutModal} className="underline text-white font-light cursor-pointer">
                            Logout
                        </button>
                    </div>
                </div>
                {isLogoutModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg w-[300px]" style={{ borderRadius: '20px', zIndex: 50 }}>
                            <h3 className="font-bold text-xl text-black">Confirm Logout</h3>
                            <p className="mt-4 text-black">Are you sure you want to log out?</p>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    className="btn-custom bg-gray-300 text-black px-4 py-2 rounded"
                                    onClick={closeLogoutModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn-search"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isReportModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg w-[400px]" style={{ borderRadius: '25px', border: '1px solid black', zIndex: 50 }}>
                            <h3 className="font-bold text-xl text-black">User Reports</h3>
                            <ul className="mt-4">
                                {reports.length > 0 ? (
                                    reports.map((report, index) => (
                                        <li key={index} className="border-b py-2 flex items-center">
                                            <input
                                                type="checkbox"
                                                className="mr-2"
                                                checked={selectedReports.includes(report.id)}
                                                onChange={() => toggleReportSelection(report.id)}
                                            />
                                            <div>
                                                <p className="font-semibold text-black">
                                                    Email : {report.email}
                                                    <button
                                                        className="ml-2 text-black underline text-sm"
                                                        onClick={() => copyToClipboard(report.email)}
                                                    >
                                                        Copy
                                                    </button>
                                                </p>
                                                <p className="text-sm text-black">{report.message}</p>
                                                <p className="text-xs text-gray-400">Date: {new Date(report.created).toLocaleString()}</p>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500">No reports</p>
                                )}
                            </ul>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    className="btn-custom bg-gray-300 text-black px-4 py-2 rounded"
                                    onClick={closeReportModal}
                                >
                                    Close
                                </button>
                                <button
                                    className="btn-search"
                                    onClick={handleDone}
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NavbarAdmin;
