const mongoose = require('mongoose');
const Event = require('./models/Event');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/analytics_demo';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB connected for seeding');
        seedData();
    })
    .catch(err => console.error(err));

const EVENTS = ['page_view', 'signup_click', 'signup_success', 'login', 'add_to_cart', 'purchase'];
const URLS = ['/', '/pricing', '/signup', '/dashboard', '/checkout'];

async function seedData() {
    try {
        await Event.deleteMany({}); // Clear existing data
        console.log('Cleared existing events');

        const events = [];
        const now = Date.now();
        const ONE_DAY = 24 * 60 * 60 * 1000;

        // Generate 500 events over the last 7 days
        for (let i = 0; i < 500; i++) {
            const randomTime = now - Math.floor(Math.random() * 7 * ONE_DAY);
            const randomEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
            const randomUrl = URLS[Math.floor(Math.random() * URLS.length)];
            const sessionId = `session_${Math.floor(Math.random() * 50)}`; // 50 unique users

            events.push({
                eventName: randomEvent,
                timestamp: new Date(randomTime),
                sessionId: sessionId,
                url: randomUrl,
                referrer: 'google.com',
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                metadata: {
                    value: Math.floor(Math.random() * 100)
                }
            });
        }

        await Event.insertMany(events);
        console.log(`Seeded ${events.length} events`);
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err);
        process.exit(1);
    }
}
