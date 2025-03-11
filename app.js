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

app.get('/products/:id', async (req, res) => {
    try {
      const productId = req.params.id; // Get the product ID from the URL params
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });  // 404 if product not found
      }
  
      res.status(200).json(product);  // 200 and return the product if found
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });  // 500 if server error
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

        // Create an object to store the updates
        const updates = {};

        // Add only the fields that are provided in the request body
        if (name !== undefined) updates.name = name;
        if (description !== undefined) updates.description = description;
        if (quantity !== undefined) updates.quantity = quantity;

        // If no fields are provided to update, return a 400 status
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'At least one field (name, description, quantity) is required to update' });
        }

        // Find and update the product
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
