const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

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
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
