const prisma = require('../config/db');

exports.getLogin = (req, res) => {
    if (req.session.username) return res.redirect('/home');
    res.render('login');
};

exports.postLogin = async (req, res) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                username: req.body.username,
                password: req.body.password
            }
        });

        if (user) {
            req.session.username = user.username;
            req.session.role = user.role;
            req.session.userId = user.id;

            if (user.role === 'C') return res.redirect('/consumer');
            if (user.role === 'M') return res.redirect('/manufuacturerp');
            return res.redirect('/home');
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        console.error(err);
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
        if (exists) return res.redirect('/login');

        await prisma.user.create({
            data: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                role: 'A'
            }
        });
        res.redirect('/signup');
    } catch (err) {
        console.error(err);
        res.redirect('/signup');
    }
};

exports.postSignupConsumer = async (req, res) => {
    try {
        const exists = await prisma.user.findUnique({ where: { username: req.body.username } });
        if (exists) return res.redirect('/login');

        await prisma.user.create({
            data: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                role: 'C',
                contactName: req.body.contactname,
                contactEmail: req.body.contactemail,
                companyName: req.body.companyname,
                websiteUrl: req.body.website,
                address: req.body.Address,
                contactPhone: req.body.contactphone,
                image: req.file ? req.file.originalname : null
            }
        });
        res.redirect('/signup');
    } catch (err) {
        console.error(err);
        res.redirect('/signup');
    }
};

exports.postSignupManufacturer = async (req, res) => {
    try {
        const exists = await prisma.user.findUnique({ where: { username: req.body.username } });
        if (exists) return res.redirect('/login');

        await prisma.user.create({
            data: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                role: 'M',
                contactName: req.body.contactname,
                contactEmail: req.body.contactemail,
                companyName: req.body.companyname,
                websiteUrl: req.body.website,
                address: req.body.Address,
                contactPhone: req.body.contactphone,
                rawMaterials: req.body.material,
                image: req.file ? req.file.originalname : null
            }
        });
        res.redirect('/signup');
    } catch (err) {
        console.error(err);
        res.redirect('/signup');
    }
};
