import express from 'express';
import { addbook, checkAvailability, getBook, searchBooks } from '../controller/book.controller.js';
import {upload} from '../middleware/imageupload.js'; 

const router = express.Router();

// Routes for book operations
router.get("/books", getBook);
router.get("/searchBooks", searchBooks);
router.get("/check-availability/:isbn", checkAvailability);
router.post("/addbook", upload.single("imageFile"), addbook);  // Use multer upload middleware here

export default router;
