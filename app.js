require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const prisma = require('./config/db');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'itsasecret',
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
    resave: false
}));

app.use(flash());

// Pass flash messages to all templates
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// View Engine
app.set('view engine', 'ejs');

// --- Routes ---
app.use('/', routes);

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log('PostgreSQL database connected via Prisma');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});
