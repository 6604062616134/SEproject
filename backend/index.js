require('dotenv').config();
const express = require('express')
const app = express()
const PORT = process.env.PORT || 8000;
const cors = require('cors');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const userRoutes = require('./src/routes/userRoutes'); 
app.use('/users', userRoutes)

const boardgamesRoutes = require('./src/routes/boardgamesRoutes');
app.use('/boardgames', boardgamesRoutes);

const categoryRoutes = require('./src/routes/categoryRoutes');
app.use('/categories', categoryRoutes);

const borrowReturnRoutes = require('./src/routes/borrowReturnRoutes');
app.use('/br', borrowReturnRoutes);

const notificationRoutes = require('./src/routes/notificationRoutes');
app.use('/notifications', notificationRoutes);

const reportRoutes = require('./src/routes/reportRoutes');
app.use('/reports', reportRoutes);

const historyRoutes = require('./src/routes/historyRoutes');
app.use('/history', historyRoutes);

const reserveRoutes = require('./src/routes/reserveRoutes');
app.use('/reserve', reserveRoutes);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
  })