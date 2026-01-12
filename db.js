const fs = require('fs');

const DB_FILE = './database.json';

// Initialize DB if missing
if (!fs.existsSync(DB_FILE)) {
    const initialData = {
        users: [],
        reviews: [],
        partnerships: [],
        support: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
}

const getDb = () => {
    try {
        return JSON.parse(fs.readFileSync(DB_FILE));
    } catch (err) {
        return { users: [], reviews: [], partnerships: [], support: [] };
    }
};

const saveDb = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
};

module.exports = {
    getDb,
    saveDb,
    generateId
};
