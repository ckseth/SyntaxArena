import Product from '../models/Product.js';

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
    try {
        const { keyword, category, minPrice, maxPrice, availability } = req.query;
        let query = {};

        // Search & Filter Logic
        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }
        if (category) query.category = category;
        if (availability) query.availability = availability;
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const products = await Product.find(query)
            .populate('ownerId', 'name email')
            .sort({ createdAt: -1 });

        // Always return as an object with 'products' key for frontend consistency
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: "Fetch failed", error: error.message });
    }
};

// CREATE PRODUCT
export const createProduct = async (req, res) => {
    try {
        // Capture all fields from your original code
        const imagePaths = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

        const newProduct = new Product({
            ...req.body, // This spreads all fields (title, price, location, etc.) automatically
            images: imagePaths,
            ownerId: req.user._id
        });

        const savedProduct = await newProduct.save();
        res.status(201).json({ success: true, product: savedProduct });
    } catch (error) {
        res.status(400).json({ success: false, message: "Creation failed", error: error.message });
    }
};

// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('ownerId', 'name email');
        if (!product) return res.status(404).json({ message: "Not found" });
        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Not found" });

        if (product.ownerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // If new images were uploaded, use them; otherwise keep existing
        const imagePaths = req.files && req.files.length > 0
            ? req.files.map(f => `/uploads/${f.filename}`)
            : product.images;

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            { ...req.body, images: imagePaths },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, product: updatedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: "Update failed", error: error.message });
    }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Not found" });

        if (product.ownerId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await product.deleteOne();
        res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};