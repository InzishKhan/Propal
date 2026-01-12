const prisma = require('../config/db');
const { mapUserToTemplate } = require('../config/utils');

exports.getHome = async (req, res) => {
    try {
        const manufacturers = await prisma.user.findMany({
            where: { role: 'M', rating: { gt: 1 } },
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
};

exports.getAbout = (req, res) => res.render('about');

exports.getContact = (req, res) => res.render('contact');

exports.postContact = async (req, res) => {
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
};

exports.getExplore = async (req, res) => {
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
};

exports.postSearchExplore = async (req, res) => {
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
};
