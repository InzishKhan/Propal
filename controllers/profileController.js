const prisma = require('../config/db');
const { mapUserToTemplate } = require('../config/utils');

exports.getEditProfile = async (req, res) => {
    if (!req.session.username) return res.redirect('/home');
    try {
        const user = await prisma.user.findUnique({ where: { username: req.session.username } });
        if (user) {
            res.render('EditProfile', { data: mapUserToTemplate(user) });
        } else {
            res.redirect('/home');
        }
    } catch (err) {
        console.error(err);
        res.redirect('/home');
    }
};

exports.postUpdateProfile = async (req, res) => {
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
};

exports.getConsumerProfile = async (req, res) => {
    if (!req.session.username || req.session.role !== 'C') return res.redirect('/home');
    try {
        const user = await prisma.user.findUnique({ where: { username: req.session.username } });
        const manufacturers = await prisma.user.findMany({ where: { role: 'M' } });
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
};

exports.getManufacturerProfileSelf = async (req, res) => {
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
};

exports.getManufacturerProfilePublic = async (req, res) => {
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

        if (currentUser && currentUser.id === manufacturer.id) {
            return res.render('ProfileManu1', { data: manufData, check: 0, review: 2, premium: 0, meet: meetings });
        }

        let reviewStats = { review: 1, premium: manufacturer.isPremium ? 1 : 0 };
        if (currentUser && currentUser.role !== 'M') {
            const hasReviewed = await prisma.review.findFirst({
                where: { consumerId: currentUser.id, manufacturerId: manufacturer.id }
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
};
