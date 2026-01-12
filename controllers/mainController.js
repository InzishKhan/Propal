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

        const accordionData = [
            {
                title: "Where shall we begin?",
                content: "Start by creating an account. Manufacturers can list their raw materials, and consumers can browse these listings to find bulk deals."
            },
            {
                title: "How do we work together?",
                content: "We provide a verified platform where businesses connects. Our streamlined messaging and quote system ensures transparent communication."
            },
            {
                title: "Why ProPal is the best?",
                content: "ProPal focuses exclusively on B2B raw material sourcing, ensuring you find high-quality additives and bulk supplies without the retail noise."
            },
            {
                title: "Do we get the best support?",
                content: "Yes! Our support team is available 24/7 to assist with disputes, verification, and platform navigation."
            }
        ];

        const testimonialData = [
            {
                text: "ProPal revolutionized how we source our raw timber. The direct connection to manufacturers saved us 20% in overhead.",
                author: "Claude David",
                role: "Supply Chain Manager"
            },
            {
                text: "Finally, a platform that understands bulk logistics. Listing our steel surplus was easy and we found a buyer in days.",
                author: "Thomas Jefferson",
                role: "Manufacturing Lead"
            },
            {
                text: "The verification process gave us peace of mind. We know we are dealing with legitimate suppliers every time.",
                author: "Stella Blair",
                role: "Procurement Officer"
            }
        ];

        res.render('index', {
            data: datas,
            check: check,
            username: req.session.username || null,
            displayName: displayName,
            accordionData: accordionData,
            testimonialData: testimonialData
        });
    } catch (err) {
        console.error(err);
        res.render('index', {
            data: [],
            check: 0,
            username: null,
            displayName: null,
            accordionData: [],
            testimonialData: []
        });
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
