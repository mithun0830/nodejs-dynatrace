const express = require('express');
const winston = require('winston');
const app = express();
const port = process.env.PORT || 3000;

// Configure Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'simple-nodejs-api' },
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: '/var/log/nodejs/api.log' })
    ]
});

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('API Request', {
            method: req.method,
            path: req.path,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            userAgent: req.get('user-agent') || 'unknown'
        });
    });
    next();
});

// Middleware for parsing JSON bodies
app.use(express.json());

// In-memory storage for items
let items = [];

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// GET all items
app.get('/api/items', (req, res) => {
    res.json(items);
});

// GET specific item by ID
app.get('/api/items/:id', (req, res) => {
    const item = items.find(i => i.id === req.params.id);
    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
});

// POST new item
app.post('/api/items', (req, res) => {
    const newItem = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    items.push(newItem);
    res.status(201).json(newItem);
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Error occurred', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
