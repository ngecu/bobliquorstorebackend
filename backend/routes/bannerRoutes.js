import express from 'express';
import {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
} from '../controllers/bannerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new banner
router.route('/').post(createBanner);

// Get all banners
router.route('/').get(getAllBanners);

// Get a single banner by ID
router.route('/:id').get(getBannerById);

// Update a banner
router.route('/:id').put(protect, admin, updateBanner);

// Delete a banner
router.route('/:id').delete(protect, admin, deleteBanner);

export default router;
