// app.js
const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const app = express();

app.use(express.json());
const cors = require('cors');
app.use(cors());

// Middleware
app.use(express.json()); // for parsing JSON bodies

// Connect to MongoDB
mongoose.connect('mongodb+srv://shubha:shubha@mernapp.jupbm.mongodb.net/E-commerce?retryWrites=true&w=majority&appName=Mernapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB successfully sh'))
.catch(err => console.log(err));

// Routes
// Get all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Add product
app.post('/products', async (req, res) => {
    try {
        const { name, description, quantity } = req.body;

        if (!name || !description || quantity === undefined) {
            return res.status(400).json({ error: 'Name, description, and quantity are required' });
        }

        const product = new Product({ name, description, quantity });
        await product.save();
        res.status(201).json({ message: 'Product added successfully!', product });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add product' });
    }
});

// Update product
app.patch('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, quantity } = req.body;

        if (!name && !description && quantity === undefined) {
            return res.status(400).json({ error: 'At least one field (name, description, quantity) is required to update' });
        }

        const updates = { name, description, quantity };
        // Remove any undefined values (to avoid updating with null or undefined values)
        Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

        const product = await Product.findByIdAndUpdate(id, updates, { new: true });
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ message: 'Product updated successfully!', product });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// Delete product
app.delete('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
