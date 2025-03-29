import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userId: null, // เก็บ userId ของผู้ใช้
    isAuthenticated: false, // สถานะการเข้าสู่ระบบ
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userId = action.payload.userId; // อัปเดต userId
            state.isAuthenticated = true; // ตั้งสถานะเป็นเข้าสู่ระบบ
        },
        logout: (state) => {
            state.userId = null; // ล้าง userId
            state.isAuthenticated = false; // ตั้งสถานะเป็นออกจากระบบ
        },
    },
});

export const { setUser, logout } = authSlice.actions; // ส่งออก actions
export default authSlice.reducer; // ส่งออก reducer