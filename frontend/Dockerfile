# ใช้ Node.js เป็น base image
FROM node:16

# ตั้ง working directory
WORKDIR /app

# คัดลอกไฟล์ package.json และ package-lock.json
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์ทั้งหมดใน frontend ไปยัง container
COPY . .

# สร้าง production build
RUN npm run build

# ใช้ nginx สำหรับเสิร์ฟไฟล์ static
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# เปิดพอร์ตที่ frontend ใช้งาน
EXPOSE 80

# คำสั่งเริ่มต้นสำหรับรัน nginx
CMD ["nginx", "-g", "daemon off;"]