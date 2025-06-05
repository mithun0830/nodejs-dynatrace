const express = require('express');
const winston = require('winston');
const dynatraceMetrics = require('./dynatraceMetrics');
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
    const tracer = dynatraceMetrics.startTracer('GET /api/items');
    const start = Date.now();
    
    dynatraceMetrics.trackItemCount(items.length);
    res.json(items);
    
    dynatraceMetrics.trackApiCallDuration('get_items', Date.now() - start);
    if (tracer) dynatraceMetrics.endTracer(tracer);
});

// GET specific item by ID
app.get('/api/items/:id', (req, res) => {
    const tracer = dynatraceMetrics.startTracer('GET /api/items/:id');
    const start = Date.now();

    const item = items.find(i => i.id === req.params.id);
    if (!item) {
        dynatraceMetrics.trackApiCallDuration('get_item_by_id', Date.now() - start);
        if (tracer) dynatraceMetrics.endTracer(tracer);
        return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
    dynatraceMetrics.trackApiCallDuration('get_item_by_id', Date.now() - start);
    if (tracer) dynatraceMetrics.endTracer(tracer);
});

// POST new item
app.post('/api/items', (req, res) => {
    const tracer = dynatraceMetrics.startTracer('POST /api/items');
    const start = Date.now();

    const newItem = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    items.push(newItem);
    
    dynatraceMetrics.trackItemCount(items.length);
    res.status(201).json(newItem);
    
    dynatraceMetrics.trackApiCallDuration('create_item', Date.now() - start);
    if (tracer) dynatraceMetrics.endTracer(tracer);
});

// Error handling middleware
app.use((err, req, res, next) => {
    const tracer = dynatraceMetrics.startTracer('Error Handler');
    
    logger.error('Error occurred', {
        error: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    if (sdk) {
        dynatraceMetrics.trackApiCallDuration('error_handler', 0);
        sdk.addCustomRequestAttribute('error_type', err.name || 'Unknown');
        sdk.addCustomRequestAttribute('error_message', err.message);
    }

    res.status(500).json({ error: 'Something went wrong!' });
    
    if (tracer) dynatraceMetrics.endTracer(tracer);
});

// Start the server
app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
