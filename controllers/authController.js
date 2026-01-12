const prisma = require('../config/db');
const bcrypt = require('bcryptjs');
const path = require('path');

exports.getLogin = (req, res) => {
    if (req.session.username) return res.redirect('/home');
    res.render('login');
};

exports.postLogin = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { username: req.body.username }
        });

        if (user) {
            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (isMatch) {
                req.session.username = user.username;
                req.session.role = user.role;
                req.session.userId = user.id;

                req.flash('success', `Welcome back, ${user.username}!`);
                if (user.role === 'C') return res.redirect('/consumer');
                if (user.role === 'M') return res.redirect('/manufacturerp');
                return res.redirect('/home');
            }
        }

        req.flash('error', 'Invalid username or password.');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong. Please try again.');
        res.redirect('/login');
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/home');
};

exports.getSignup = (req, res) => {
    if (req.session.username) return res.redirect('/home');
    res.render('signup');
};

exports.postSignup = async (req, res) => {
    try {
        const exists = await prisma.user.findUnique({ where: { username: req.body.username } });
        if (exists) {
            req.flash('error', 'Username is already taken.');
            return res.redirect('/signup');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        await prisma.user.create({
            data: {
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                role: 'A'
            }
        });
        req.flash('success', 'Account created! Please login.');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong during signup.');
        res.redirect('/signup');
    }
};

exports.postSignupConsumer = async (req, res) => {
    try {
        const exists = await prisma.user.findUnique({ where: { username: req.body.username } });
        if (exists) {
            req.flash('error', 'Username is already taken.');
            return res.redirect('/signup');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        await prisma.user.create({
            data: {
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                role: 'C',
                contactName: req.body.contactname,
                contactEmail: req.body.contactemail,
                companyName: req.body.companyname,
                websiteUrl: req.body.website,
                address: req.body.Address,
                contactPhone: req.body.contactphone,
                image: req.file ? req.file.filename : null // Assuming multer is config to save filename
            }
        });
        req.flash('success', 'Account created! Please login.');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong during signup.');
        res.redirect('/signup');
    }
};

exports.postSignupManufacturer = async (req, res) => {
    try {
        const exists = await prisma.user.findUnique({ where: { username: req.body.username } });
        if (exists) {
            req.flash('error', 'Username is already taken.');
            return res.redirect('/signup');
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        await prisma.user.create({
            data: {
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                role: 'M',
                contactName: req.body.contactname,
                contactEmail: req.body.contactemail,
                companyName: req.body.companyname,
                websiteUrl: req.body.website,
                address: req.body.Address,
                contactPhone: req.body.contactphone,
                rawMaterials: req.body.material,
                image: req.file ? req.file.filename : null
            }
        });
        req.flash('success', 'Account created! Please login.');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Something went wrong during signup.');
        res.redirect('/signup');
    }
};
