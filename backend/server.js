const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { Sequelize, DataTypes } = require('sequelize');
const speakeasy = require('speakeasy');
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 5000; // Choose a port for your backend server

app.use(cors());
// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Configure session middleware
const sessionStore = new MySQLStore({
  // Replace with your MySQL database configuration
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Parkar@123',
  database: 'hrms'
});

app.use(session({
  secret: 'your_secret_key', // Replace with a secret key for session encryption
  store: sessionStore,
  resave: false,
  saveUninitialized: false
}));

// Connect to MySQL database
const sequelize = new Sequelize('hrms', 'root', 'Parkar@123', {
  host: 'localhost',
  dialect: 'mysql'
});

// Define Login model to match the existing Login table
const Login = sequelize.define('Login', {
  empid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  secret: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'Login', // Specify the table name explicitly to match the existing Login table
  timestamps: false // If the table does not have createdAt and updatedAt columns, disable timestamps
});

// API route to handle login
app.post('/api/login', async (req, res) => {
   console.log(req.body);
   const { empid, password } = req.body;
   
  try {
    const user = await Login.findOne({ where: { empid, password } });
    if (user) {
      // Store user's role in session
      req.session.empid = user.empid;
      req.session.role = user.role;
      console.log('Session empid set:', req.session.empid);
      res.status(200).json({ message: 'Login successful', role: user.role });
    } else {
      res.status(401).json({ error: 'Invalid empid or password' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// API route to setup 2FA and return QR code data and secret key
app.get('/api/2fa/setup', async (req, res) => {
  console.log('Empid stored in the session:',req.session.empid);
  try {
    // Generate a new secret key for the user
    const secret = speakeasy.generateSecret({ length: 20 });

    // Update the user's record with the secret key
    await Login.update({ secret: secret.base32 }, { where: { empid: req.session.empid } });

    // Generate QR code data URL
    const qrCodeDataUrl = `otpauth://totp/HRMS:${req.session.empid}?secret=${encodeURIComponent(secret.base32)}`;

    // Return the QR code data URL and the secret key
    res.status(200).json({ qrCodeDataUrl, secret: secret.base32 });
  } catch (error) {
    console.error('Error setting up 2FA:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API route to verify OTP
app.post('/api/2fa/verify', async (req, res) => {
  const { otp } = req.body;

  try {
    const user = await Login.findOne({secret: secret.base32}, { where: { empid: req.session.empid } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const verified = speakeasy.totp.verify({
      secret: user.secret,
      encoding: 'base32',
      token: otp,
      window: 1 // Allow for time drift of up to 30 seconds
    });

    if (verified) {
      await Login.update({ otpVerified: true }, { where: { empid: req.session.empid } });
      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      res.status(401).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/debug/session', (req, res) => {
  console.log('Session:', req.session);
  // res.send('Session content logged to console.');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
