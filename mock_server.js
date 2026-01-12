const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');

// Setup view engine
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));

// Mock session setup
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "itsasecret",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));

// Mock Data
const mockManufacturers = [
    {
        MID: 1,
        manufacturer_id: 101,
        company_name: "ABC Manufacturing",
        contact_name: "John Smith",
        contact_email: "jsmith@abc.com",
        contact_phone: "555-1234",
        website_url: "http://www.abcmfg.com",
        address: "123 Main St, Anytown USA",
        rating: 4.5,
        is_premium: 1,
        raw_materials: "wood",
        image: "testimonial-4.jpg"
    },
    {
        MID: 2,
        manufacturer_id: 102,
        company_name: "Starlight Manufacturing LLC",
        contact_name: "Olivia Davis",
        contact_email: "oliviadavis@email.com",
        contact_phone: "521-9876",
        website_url: "http://www.starlightMac.com",
        address: "2021 Oakwood Dr, Anytown, USA",
        rating: 3.8,
        is_premium: 0,
        raw_materials: "steel",
        image: "testimonial-1.jpg"
    },
    {
        MID: 3,
        manufacturer_id: 103,
        company_name: "TechParts Inc",
        contact_name: "Alan Turing",
        contact_email: "alan@techparts.com",
        contact_phone: "555-0101",
        website_url: "http://www.techparts.com",
        address: "Silicon Valley, CA",
        rating: 5.0,
        is_premium: 1,
        raw_materials: "microchips",
        image: "testimonial-2.jpg"
    }
];

// Routes
app.get('/', (req, res) => {
    res.render('index', { data: mockManufacturers, check: 0 }); // check: 0 for guest
});

app.get('/home', (req, res) => {
    res.render('index', { data: mockManufacturers, check: 0 });
});

app.get('/explore', (req, res) => {
    res.render('explore', { data: mockManufacturers, val: 0 });
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.post('/contact', (req, res) => {
    console.log("Mock contact form submitted:", req.body);
    res.render('contact');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    console.log("Mock login attempted:", req.body);
    // For demo, just redirect to home or simulate login
    res.redirect('/home'); 
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

// Manufacturer Detail Mock
app.get('/manufacturer/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const manuf = mockManufacturers.find(m => m.manufacturer_id === id) || mockManufacturers[0];
    res.render('ProfileManu1', { 
        data: manuf, 
        check: 1, // Simulate user view
        review: 0, 
        premium: 0, 
        meet: [] 
    });
});

app.listen(5000, () => {
    console.log('Mock Server is running on port 5000');
    console.log('Access at http://localhost:5000');
});
