import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { protect, staffOnly, adminOnly, customerOnly, can } from '../middleware/auth.js';
import { uploadCover } from '../middleware/upload.js';
import * as auth from '../controllers/authController.js';
import * as books from '../controllers/bookController.js';
import * as genres from '../controllers/genreController.js';
import * as reviews from '../controllers/reviewController.js';
import * as wishlist from '../controllers/wishlistController.js';
import * as rentals from '../controllers/rentalController.js';
import * as pay from '../controllers/paymentController.js';
import * as admin from '../controllers/adminController.js';
import * as users from '../controllers/userController.js';

const router = Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50, message: { message: 'Too many attempts, try again later' } });
const staff = [protect, staffOnly];

// ---- auth ----
router.post('/auth/register', authLimiter, auth.register);
router.post('/auth/login', authLimiter, auth.login);
router.get('/auth/me', protect, auth.me);
router.put('/auth/me', protect, auth.updateMe);
router.put('/auth/password', protect, auth.changePassword);

// ---- public storefront ----
router.get('/books', books.listBooks);
router.get('/books/facets', books.facets);
router.get('/books/inventory', ...staff, can('books'), books.inventory);
router.get('/books/:id', books.getBook);
router.get('/books/:id/reviews', reviews.listReviews);

// ---- catalogue management (permission: books) ----
router.post('/books', ...staff, can('books'), uploadCover, books.createBook);
router.put('/books/:id', ...staff, can('books'), uploadCover, books.updateBook);
router.patch('/books/:id/stock', ...staff, can('books'), books.adjustStock);
router.delete('/books/:id', ...staff, can('books'), books.deleteBook);

// ---- genres ----
router.get('/genres', genres.listGenres);
router.post('/genres', ...staff, can('books'), genres.createGenre);
router.put('/genres/:id', ...staff, can('books'), genres.updateGenre);
router.delete('/genres/:id', ...staff, can('books'), genres.deleteGenre);

// ---- reviews & wishlist ----
router.post('/books/:id/reviews', protect, customerOnly, reviews.saveReview);
router.delete('/reviews/:id', protect, reviews.deleteReview);
router.get('/wishlist', protect, customerOnly, wishlist.getWishlist);
router.post('/wishlist/:bookId', protect, customerOnly, wishlist.toggleWishlist);

// ---- rentals: customer ----
router.post('/rentals', protect, customerOnly, rentals.createRental);
router.get('/rentals/my', protect, rentals.myRentals);
router.patch('/rentals/:id/cancel', protect, rentals.cancelRental);
router.post('/rentals/:id/pay', protect, customerOnly, pay.initiate);
router.post('/rentals/:id/verify-payment', protect, customerOnly, pay.verifyPayment);

// ---- rentals: staff (permission: rentals) ----
router.get('/rentals', ...staff, can('rentals'), rentals.listRentals);
router.patch('/rentals/:id/approve', ...staff, can('rentals'), rentals.approve);
router.patch('/rentals/:id/reject', ...staff, can('rentals'), rentals.reject);
router.patch('/rentals/:id/mark-paid', ...staff, can('rentals'), rentals.markPaid);
router.patch('/rentals/:id/handover', ...staff, can('rentals'), rentals.handover);
router.patch('/rentals/:id/return', ...staff, can('rentals'), rentals.returnRental);
router.patch('/rentals/:id/collect-late-fee', ...staff, can('rentals'), rentals.collectLateFee);
router.patch('/rentals/:id/refunded', ...staff, can('rentals'), rentals.markRefunded);

// ---- payment gateway redirects (browser comes back here) ----
router.get('/payments/esewa/success', pay.esewaSuccess);
router.get('/payments/esewa/failure', pay.esewaFailure);
router.get('/payments/khalti/return', pay.khaltiReturn);

// ---- admin dashboard ----
router.get('/admin/counts', ...staff, admin.counts);
router.get('/admin/stats', ...staff, admin.stats);

// ---- people ----
router.get('/customers', ...staff, can('members'), users.listCustomers);
router.put('/customers/:id', ...staff, can('members'), users.updateCustomer);
router.delete('/customers/:id', protect, adminOnly, users.deleteCustomer);
router.get('/staff', protect, adminOnly, users.listStaff);
router.post('/staff', protect, adminOnly, users.createStaff);
router.put('/staff/:id', protect, adminOnly, users.updateStaff);
router.delete('/staff/:id', protect, adminOnly, users.deleteStaff);

export default router;
