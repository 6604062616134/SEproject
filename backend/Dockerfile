# ใช้ Node.js เป็น base image
FROM node:16

# ตั้ง working directory
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์ทั้งหมดใน backend ไปยัง container
COPY . .

# เปิดพอร์ตที่ backend ใช้งาน
EXPOSE 8000

# คำสั่งเริ่มต้นสำหรับรัน backend
CMD ["npm", "start"]