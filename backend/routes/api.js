const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// POST /track
router.post('/track', async (req, res) => {
    try {
        const { event, data } = req.body;

        // Basic validation
        if (!event) {
            return res.status(400).json({ error: 'Event name is required' });
        }

        const newEvent = new Event({
            eventName: event,
            timestamp: new Date(),
            sessionId: data.sessionId || 'anonymous',
            url: data.url,
            referrer: data.referrer,
            userAgent: data.userAgent,
            metadata: data.metadata || {}
        });

        await newEvent.save();
        res.status(200).json({ success: true });
    } catch (err) {
        console.error('Error tracking event:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /stats/summary
router.get('/stats/summary', async (req, res) => {
    try {
        const totalEvents = await Event.countDocuments();

        // Calculate DAU (Unique sessions in last 24h)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const activeUsers = await Event.distinct('sessionId', {
            timestamp: { $gte: oneDayAgo }
        });

        res.json({
            totalEvents,
            dau: activeUsers.length
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /stats/events
router.get('/stats/events', async (req, res) => {
    try {
        const events = await Event.find().sort({ timestamp: -1 }).limit(50);
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /stats/funnel
// Query params: steps=signup,verify,purchase
router.get('/stats/funnel', async (req, res) => {
    try {
        const steps = req.query.steps ? req.query.steps.split(',') : [];
        if (steps.length === 0) {
            return res.json([]);
        }

        const funnelData = [];

        // Simple funnel implementation: Count unique sessions that did each step
        // Note: This is a simplified version. Real funnels require ordering.
        for (const step of steps) {
            const count = await Event.distinct('sessionId', { eventName: step });
            funnelData.push({
                step,
                count: count.length
            });
        }

        res.json(funnelData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /stats/chart
// Returns events per day for the last 7 days
router.get('/stats/chart', async (req, res) => {
    try {
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        const data = await Event.aggregate([
            { $match: { timestamp: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
