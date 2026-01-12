const express = require('express');
const router = express.Router();
const multer = require('multer');

const authController = require('../controllers/authController');
const mainController = require('../controllers/mainController');
const profileController = require('../controllers/profileController');
const featureController = require('../controllers/featureController');

// File Upload Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './views/uploads'),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

// --- Home & Static Pages ---
router.get(['/', '/home'], mainController.getHome);
router.get('/about', mainController.getAbout);
router.get('/contact', mainController.getContact);
router.post('/contact', mainController.postContact);

// --- Authentication ---
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);
router.post('/signupcon', upload.single('Picture'), authController.postSignupConsumer);
router.post('/signupman', upload.single('Picture'), authController.postSignupManufacturer);

// --- Exploration ---
router.get('/explore', mainController.getExplore);
router.post('/searchexplore', mainController.postSearchExplore);

// --- Profile & Dashboards ---
router.get('/editprofile', profileController.getEditProfile);
router.post('/update', upload.single('Picture'), profileController.postUpdateProfile);
router.get('/consumer', profileController.getConsumerProfile);
router.get('/manufuacturerp', profileController.getManufacturerProfileSelf);
router.get('/manufacturer/:id', profileController.getManufacturerProfilePublic);

// --- Features ---
router.post('/review', featureController.postReview);
router.post('/setpremconsum', featureController.postSetPremiumConsumer);
router.post('/cevent', featureController.postPartnership);
router.get('/event', featureController.getEvents);
router.post('/meeting', featureController.postMeeting);
router.get('/del/:id/:ids', featureController.deleteMeeting);

module.exports = router;
