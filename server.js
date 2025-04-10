const fs = require('fs');
const https = require('https');
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
const passport = require('passport');
const session = require('express-session');
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

// Add session support
app.use(session({
    secret: process.env.SESSION_SECRET || 'supersecret123',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // set to false since you're using HTTPS locally
}));

// Initialize Passport session
app.use(passport.initialize());
app.use(passport.session());

// Serialize & deserialize user (required for session handling)
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});


// OAuth 2.0 Authentication
passport.use(new OAuth2Strategy({
    authorizationURL: 'https://dev-tlliy8e73gxuyxwg.us.auth0.com/authorize',
    tokenURL: 'https://dev-tlliy8e73gxuyxwg.us.auth0.com/oauth/token',
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'https://localhost:3000/auth/callback'
}, (accessToken, refreshToken, profile, done) => {
    // You can retrieve user info from Auth0 if needed
    return done(null, { accessToken });
}));




// ✅ Add OAuth login and callback routes here:
app.get('/auth/login', passport.authenticate('oauth2'));

app.get('/auth/callback',
    passport.authenticate('oauth2', { failureRedirect: '/' }),
    (req, res) => {
        res.send('✅ Login successful with OAuth!');
    }
);

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
