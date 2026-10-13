import express from 'express';
import { getProducts, createProduct, getProductById, updateProduct, deleteProduct } from '../controllers/productController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes (require authentication)
router.post('/', authMiddleware, upload.array('images', 5), createProduct);
router.put('/:id', authMiddleware, upload.array('images', 5), updateProduct);
router.delete('/:id', authMiddleware, deleteProduct);

export default router;
