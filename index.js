const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const userRoute = require('./routes/user');
const restaurantRoute = require('./routes/restaurant');
const categoryRoute = require('./routes/category');
const foodRoute = require('./routes/food');
const cartRoute = require('./routes/cart');
const addressRoute = require('./routes/address');
const orderRoute = require('./routes/order');
const driverRoute = require('./routes/driver');
const ratingRoute = require('./routes/rating');
const sendMail = require('./utils/smtp_function');
const generateOtp = require('./utils/otp_generator');
const authRoute = require('./routes/auth');

const cors = require('cors');

dotenv.config();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Cấu hình COR

// Sử dụng middleware cors
app.use(cors());
app.set('port', process.env.PORT || 6000)

// Connect to DB
mongoose.connect(process.env.MONGO_URL)

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


// Use routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/restaurants', restaurantRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/food', foodRoute);
app.use('/api/cart', cartRoute);
app.use('/api/address', addressRoute);
app.use('/api/orders', orderRoute);
app.use('/api/drivers', driverRoute);
app.use('/api/rating', ratingRoute);

const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



