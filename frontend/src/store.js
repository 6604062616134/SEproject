import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../src/features/auth/authSlice'; // ตัวอย่าง reducer

export const store = configureStore({
    reducer: {
        auth: authReducer, // เพิ่ม reducer ที่คุณใช้
    },
});