const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
const app = express();
const jwt = require('jsonwebtoken');
// Set up view engine and middleware
app.set('view engine', 'ejs');
const secretKey = 'awt';
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'awt', // Use environment variable for production
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/oottpp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Define User Schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    secret: String
});

const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
    res.render('index', { message: req.flash('message') });
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.post('/signup', async (req, res) => {
    try {
        console.log(req.body)
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const secret = speakeasy.generateSecret({ length: 20 });

        const user = new User({
            email: req.body.email,
            password: hashedPassword,
            secret: secret.base32
        });

        await user.save();

        req.flash('message', 'Account created successfully. Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Signup error:', error);
        req.flash('message', 'Error creating account. Please try again.');
        res.redirect('/');
    }
});

const nodemailer = require('nodemailer'); // Import nodemailer

// ... (your existing code)

app.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            req.flash('message', 'Email not found.');
            return res.redirect('/');
        }

        // Generate OTP token
        const secret = user.secret; // Fetch the secret from the user data in the database
        const token = speakeasy.totp({
            secret: secret,
            encoding: 'base32',
            window: 1
        });

        // Send OTP via email
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'engrdawoodisrar@gmail.com', // Replace with your Gmail email
                pass: 'ynxvngcwoyhpcpxv' // Replace with your Gmail password or app password
            }
        });

        let mailOptions = {
            from: 'engrdawoodisrar@gmail.com', // Replace with your Gmail email
            to: user.email,
            subject: 'Login OTP Verification',
            text: `Your OTP: ${token}`
        };

        await transporter.sendMail(mailOptions);

        req.flash('message', 'OTP sent to your email. Please check your email for the OTP.');
        res.redirect(`/otp/${user.id}`);
    } catch (error) {
        console.error('Login error:', error);
        req.flash('message', 'Login error. Please try again.');
        res.redirect('/');
    }
});


app.get('/otp/:userId', (req, res) => {
    res.render('otp', { userId: req.params.userId, message: req.flash('message') });
});

app.post('/otp/verify/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log('Received userId:', userId);

        // Ensure userId is in the correct format (ObjectId or string)
        const user = await User.findOne({ _id: userId });

        if (!user) {
            console.log('User not found.');
            req.flash('message', 'User not found.');
            return res.redirect('/');
        }

        // Generate JWT token
        const secretKey = 'yourSecretKey'; // Replace with your secret key
        const payload = { userId: user._id.toString() }; // Convert ObjectId to string
        const jwttoken = jwt.sign(payload, secretKey, { expiresIn: '1h' });

        const tokenValidates = speakeasy.totp.verify({
            secret: user.secret,
            encoding: 'base32',
            token: req.body.token,
            window: 1
        });

        if (tokenValidates) {
            req.flash('message', 'OTP verified successfully.');
            return res.status(200).json({
                message: 'OTP verified successfully.',
                token: jwttoken
            });
        } else {
            req.flash('message', 'Invalid OTP.');
            return res.redirect(`/otp/${userId}`);
        }
    } catch (error) {
        console.error('OTP verification error:', error);
        req.flash('message', 'OTP verification error. Please try again.');
        res.redirect(`/otp/${req.params.userId}`);
    }
});


app.listen(6000, () => {
    console.log('Server started on port 6000');
});
