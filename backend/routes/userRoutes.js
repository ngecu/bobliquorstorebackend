import express from 'express'
const router = express.Router()
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  addToWish,
  removeFromWish,
  userWishlist,
  sendRestPassword,
} from '../controllers/userController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').post(registerUser).get(protect, admin, getUsers)
router.route('/reset-password').post(sendRestPassword)

router.post('/login', authUser)
router.post('/addToWish/:id',addToWish)
router.post('/removeFromWish/:id',removeFromWish)
router.post('/userWishlist/:id',userWishlist)




router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
router
  .route('/:id')
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)

export default router
