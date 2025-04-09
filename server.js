const fs = require('fs');
const https = require('https');
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const { query, validationResult } = require('express-validator');

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

const app = express();

// Security Headers (Helmet)
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:"],
            scriptSrc: ["'self'"]
        }
    },
    frameguard: { action: 'deny' },
    xssFilter: true
}));

// Enable CORS
app.use(cors());

// Serve static files
app.use(express.static('public'));

// OAuth 2.0 Authentication
passport.use(new OAuth2Strategy({
    authorizationURL: 'https://auth.example.com/auth',
    tokenURL: 'https://auth.example.com/token',
    clientID: 'CLIENT_ID',
    clientSecret: 'CLIENT_SECRET',
    callbackURL: '/auth/callback'
}, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
}));

app.use(passport.initialize());

// Mock user database
const users = {
    admin: { role: 'admin' },
    user1: { role: 'user' }
};

// Role-Based Access Control (RBAC)
function authorize(role) {
    return (req, res, next) => {
        const user = users[req.query.username];
        if (!user || user.role !== role) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
}

// Item details
const items = {
    apple: { image: 'apple.jpg', description: 'A red, juicy fruit.' },
    banana: { image: 'banana.jpg', description: 'A yellow, soft fruit rich in potassium.' },
    orange: { image: 'orange.jpg', description: 'A citrus fruit rich in Vitamin C.' }
};

// Secure API Endpoint with Input Validation
app.get('/item', [
    query('name').isAlpha().withMessage('Invalid item name')
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const item = req.query.name;
    res.json(items[item] || { image: '', description: 'Item not found.' });
});

// Admin-only route
app.get('/admin', authorize('admin'), (req, res) => {
    res.send('Admin Access Granted');
});

// Start HTTPS server
https.createServer(options, app).listen(3000, () => {
    console.log('Secure server running on port 3000');
});
