const express = require('express');
const app = express();
const path = require('path');
const Router = express.Router();
const multer = require('multer');
const session = require('express-session');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// --- Configuration ---

// File Upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './views/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// Session setup
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "itsasecret",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));

// View Engine & Middleware
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));


// --- Helper Functions ---

const mapUserToTemplate = (user) => {
    if (!user) return null;
    return {
        ...user,
        user_id: user.id,
        manufacturer_id: user.id,
        consumer_id: user.id,
        company_name: user.companyName,
        contact_name: user.contactName,
        contact_email: user.contactEmail,
        contact_phone: user.contactPhone,
        website_url: user.websiteUrl,
        raw_materials: user.rawMaterials,
        is_premium: user.isPremium ? 1 : 0,
        subscription_type: user.subscriptionType
    };
};


// --- Routes ---

// Home Page
Router.get(['/', '/home'], async (req, res) => {
    try {
        const manufacturers = await prisma.user.findMany({
            where: {
                role: 'M',
                rating: { gt: 1 }
            },
            orderBy: { rating: 'desc' },
            take: 5
        });

        const datas = manufacturers.map(mapUserToTemplate);
        let check = 0;
        let displayName = null;

        if (req.session.username) {
            check = req.session.role === 'C' ? 1 : (req.session.role === 'M' ? 2 : 0);
            const user = await prisma.user.findUnique({
                where: { username: req.session.username }
            });
            if (user) {
                displayName = user.companyName || user.contactName || user.username;
            }
        }

        res.render('index', {
            data: datas,
            check: check,
            username: req.session.username || null,
            displayName: displayName
        });
    } catch (err) {
        console.error(err);
        res.render('index', { data: [], check: 0, username: null, displayName: null });
    }
});

// Static Pages
Router.get('/about', (req, res) => res.render('about'));
Router.get('/contact', (req, res) => res.render('contact'));

Router.post('/contact', async (req, res) => {
    try {
        await prisma.support.create({
            data: {
                email: req.body.email,
                description: req.body.message
            }
        });
        res.render('contact');
    } catch (err) {
        console.error(err);
        res.render('contact');
    }
});

// Authentication
Router.get('/login', (req, res) => {
    if (req.session.username) return res.redirect('/home');
    res.render('login');
});

Router.post('/login', async (req, res) => {
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
});

Router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/home');
});

Router.get('/signup', (req, res) => {
    if (req.session.username) return res.redirect('/home');
    res.render('signup');
});

// Generic Signup
Router.post('/signup', async (req, res) => {
    try {
        const exists = await prisma.user.findUnique({
            where: { username: req.body.username }
        });

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
});

// Consumer Signup
Router.post('/signupcon', upload.single('Picture'), async (req, res) => {
    try {
        const exists = await prisma.user.findUnique({
            where: { username: req.body.username }
        });

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
});

// Manufacturer Signup
Router.post('/signupman', upload.single('Picture'), async (req, res) => {
    try {
        const exists = await prisma.user.findUnique({
            where: { username: req.body.username }
        });

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
});


// Core Features

Router.get('/explore', async (req, res) => {
    try {
        const manufacturers = await prisma.user.findMany({
            where: { role: 'M' }
        });
        const datas = manufacturers.map(mapUserToTemplate);
        res.render('explore', { data: datas, val: 0 });
    } catch (err) {
        console.error(err);
        res.render('explore', { data: [], val: 0 });
    }
});

Router.post('/searchexplore', async (req, res) => {
    try {
        const searchvalue = req.body.searchval.toLowerCase();

        const manufacturers = await prisma.user.findMany({
            where: {
                role: 'M',
                OR: [
                    { companyName: { contains: searchvalue, mode: 'insensitive' } },
                    { rawMaterials: { contains: searchvalue, mode: 'insensitive' } }
                ]
            }
        });

        const datas = manufacturers.map(mapUserToTemplate);
        res.render('explore', { data: datas, val: datas.length > 0 ? 0 : 1 });
    } catch (err) {
        console.error(err);
        res.render('explore', { data: [], val: 1 });
    }
});


// Profile Management

Router.get('/editprofile', async (req, res) => {
    if (!req.session.username) return res.redirect('/home');

    try {
        const user = await prisma.user.findUnique({
            where: { username: req.session.username }
        });

        if (user) {
            res.render('EditProfile', { data: mapUserToTemplate(user) });
        } else {
            res.redirect('/home');
        }
    } catch (err) {
        console.error(err);
        res.redirect('/home');
    }
});

Router.post('/update', upload.single('Picture'), async (req, res) => {
    if (!req.session.username) return res.redirect('/login');

    try {
        const updateData = {
            websiteUrl: req.body.website,
            contactEmail: req.body.email,
            companyName: req.body.companyname,
            contactName: req.body.contactname,
            address: req.body.Address,
            contactPhone: req.body.phone
        };

        if (req.file) updateData.image = req.file.originalname;

        await prisma.user.update({
            where: { username: req.session.username },
            data: updateData
        });

        res.redirect('/editprofile');
    } catch (err) {
        console.error(err);
        res.redirect('/editprofile');
    }
});


// Consumer/Manufacturer Dashboards

Router.get('/consumer', async (req, res) => {
    if (!req.session.username || req.session.role !== 'C') return res.redirect('/home');

    try {
        const user = await prisma.user.findUnique({
            where: { username: req.session.username }
        });

        const manufacturers = await prisma.user.findMany({
            where: { role: 'M' }
        });

        if (user) {
            res.render('ProfileCon1', {
                data: mapUserToTemplate(user),
                manfact: manufacturers.map(mapUserToTemplate)
            });
        } else {
            res.redirect('/home');
        }
    } catch (err) {
        console.error(err);
        res.redirect('/home');
    }
});

Router.get('/manufuacturerp', async (req, res) => {
    if (!req.session.username || req.session.role !== 'M') return res.redirect('/home');

    try {
        const user = await prisma.user.findUnique({
            where: { username: req.session.username },
            include: { meetingLocations: true }
        });

        if (user) {
            const meetings = user.meetingLocations.map(m => ({
                location_id: m.id,
                address: m.address,
                manufacturer_id: user.id
            }));

            res.render('ProfileManu1', {
                data: mapUserToTemplate(user),
                check: 0,
                review: 2,
                premium: 0,
                meet: meetings
            });
        } else {
            res.redirect('/home');
        }
    } catch (err) {
        console.error(err);
        res.redirect('/home');
    }
});

Router.get('/manufacturer/:id', async (req, res) => {
    try {
        const manufacturer = await prisma.user.findUnique({
            where: { id: req.params.id },
            include: { meetingLocations: true }
        });

        const currentUser = req.session.username ? await prisma.user.findUnique({
            where: { username: req.session.username }
        }) : null;

        if (!manufacturer) return res.redirect('/explore');

        const manufData = mapUserToTemplate(manufacturer);
        const meetings = manufacturer.meetingLocations.map(m => ({
            location_id: m.id,
            address: m.address,
            manufacturer_id: manufacturer.id
        }));

        // View own profile
        if (currentUser && currentUser.id === manufacturer.id) {
            return res.render('ProfileManu1', {
                data: manufData,
                check: 0,
                review: 2,
                premium: 0,
                meet: meetings
            });
        }

        // View as consumer/other
        let reviewStats = { review: 1, premium: manufacturer.isPremium ? 1 : 0 };

        if (currentUser && currentUser.role !== 'M') {
            const hasReviewed = await prisma.review.findFirst({
                where: {
                    consumerId: currentUser.id,
                    manufacturerId: manufacturer.id
                }
            });
            if (hasReviewed) reviewStats.review = 0;
        } else {
            reviewStats.review = 2;
        }

        res.render('ProfileManu1', {
            data: manufData,
            check: 1,
            review: reviewStats.review,
            premium: reviewStats.premium,
            meet: 0
        });
    } catch (err) {
        console.error(err);
        res.redirect('/explore');
    }
});


// Actions (Review, Meetings, Premium)

Router.post('/review', async (req, res) => {
    if (!req.session.username || req.session.role === 'M' || req.session.role === 'A') {
        return res.redirect('/home');
    }

    const value = req.body.role === "Positive" ? 1 : 0;
    const manid = req.body.manid;

    try {
        const currentUser = await prisma.user.findUnique({
            where: { username: req.session.username }
        });

        const manufacturer = await prisma.user.findUnique({
            where: { id: manid }
        });

        if (currentUser && manufacturer) {
            // Add Review
            await prisma.review.create({
                data: {
                    consumerId: currentUser.id,
                    manufacturerId: manufacturer.id,
                    rating: 1
                }
            });

            // Update Rating
            const newRating = manufacturer.rating + value;
            const updateData = { rating: newRating };

            // Premium Logic
            if (newRating >= 4) {
                updateData.isPremium = true;
                updateData.subscriptionType = 'premium';
            } else if (newRating >= 3) {
                updateData.subscriptionType = 'standard';
            } else if (newRating === 2) {
                updateData.subscriptionType = 'basic';
            }

            await prisma.user.update({
                where: { id: manid },
                data: updateData
            });

            res.redirect(`/manufacturer/${manid}`);
        } else {
            res.redirect('/home');
        }
    } catch (err) {
        console.error(err);
        res.redirect('/home');
    }
});

Router.post('/setpremconsum', async (req, res) => {
    if (!req.session.username) return res.redirect('/home');

    try {
        await prisma.user.update({
            where: { id: req.body.conid },
            data: {
                isPremium: true,
                subscriptionType: req.body.role.toLowerCase()
            }
        });
        res.redirect('/editprofile');
    } catch (err) {
        console.error(err);
        res.redirect('/editprofile');
    }
});

Router.post('/cevent', async (req, res) => {
    try {
        await prisma.partnership.create({
            data: {
                manufacturerId: req.body.id,
                partnerCompanyName: req.body.company,
                partnerBenefits: req.body.benefit
            }
        });
        res.redirect('/event');
    } catch (err) {
        console.error(err);
        res.redirect('/event');
    }
});

Router.get('/event', async (req, res) => {
    try {
        const partnerships = await prisma.partnership.findMany({
            include: { manufacturer: true }
        });

        const data = partnerships.map(p => ({
            ...p,
            manufacturer: mapUserToTemplate(p.manufacturer)
        }));

        res.render('events', { data });
    } catch (err) {
        console.error(err);
        res.render('events', { data: [] });
    }
});

Router.post('/meeting', async (req, res) => {
    try {
        await prisma.meetingLocation.create({
            data: {
                manufacturerId: req.body.select,
                address: req.body.address
            }
        });
        res.redirect('/consumer');
    } catch (err) {
        console.error(err);
        res.redirect('/home');
    }
});

Router.get('/del/:id/:ids', async (req, res) => {
    try {
        await prisma.meetingLocation.delete({
            where: { id: req.params.id }
        });
        res.redirect(`/manufacturer/${req.params.ids}`);
    } catch (err) {
        console.error(err);
        res.redirect(`/manufacturer/${req.params.ids}`);
    }
});

// Start Server
app.use('/', Router);
app.listen(5000, () => {
    console.log('Server is listening on port 5000');
    console.log('PostgreSQL database connected via Prisma');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});