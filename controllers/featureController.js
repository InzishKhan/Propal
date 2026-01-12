const prisma = require('../config/db');
const { mapUserToTemplate } = require('../config/utils');

exports.postReview = async (req, res) => {
    if (!req.session.username || req.session.role === 'M' || req.session.role === 'A') {
        return res.redirect('/home');
    }

    const value = req.body.role === "Positive" ? 1 : 0;
    const manid = req.body.manid;

    try {
        const currentUser = await prisma.user.findUnique({ where: { username: req.session.username } });
        const manufacturer = await prisma.user.findUnique({ where: { id: manid } });

        if (currentUser && manufacturer) {
            await prisma.review.create({
                data: { consumerId: currentUser.id, manufacturerId: manufacturer.id, rating: 1 }
            });

            const newRating = manufacturer.rating + value;
            const updateData = { rating: newRating };

            if (newRating >= 4) {
                updateData.isPremium = true;
                updateData.subscriptionType = 'premium';
            } else if (newRating >= 3) {
                updateData.subscriptionType = 'standard';
            } else if (newRating === 2) {
                updateData.subscriptionType = 'basic';
            }

            await prisma.user.update({ where: { id: manid }, data: updateData });
            res.redirect(`/manufacturer/${manid}`);
        } else {
            res.redirect('/home');
        }
    } catch (err) {
        console.error(err);
        res.redirect('/home');
    }
};

exports.postSetPremiumConsumer = async (req, res) => {
    if (!req.session.username) return res.redirect('/home');
    try {
        await prisma.user.update({
            where: { id: req.body.conid },
            data: { isPremium: true, subscriptionType: req.body.role.toLowerCase() }
        });
        res.redirect('/editprofile');
    } catch (err) {
        console.error(err);
        res.redirect('/editprofile');
    }
};

exports.postPartnership = async (req, res) => {
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
};

exports.getEvents = async (req, res) => {
    try {
        const partnerships = await prisma.partnership.findMany({ include: { manufacturer: true } });
        const data = partnerships.map(p => ({
            ...p,
            manufacturer: mapUserToTemplate(p.manufacturer)
        }));
        res.render('events', { data });
    } catch (err) {
        console.error(err);
        res.render('events', { data: [] });
    }
};

exports.postMeeting = async (req, res) => {
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
};

exports.deleteMeeting = async (req, res) => {
    try {
        await prisma.meetingLocation.delete({ where: { id: req.params.id } });
        res.redirect(`/manufacturer/${req.params.ids}`);
    } catch (err) {
        console.error(err);
        res.redirect(`/manufacturer/${req.params.ids}`);
    }
};
