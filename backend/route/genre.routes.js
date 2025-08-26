import express from 'express';
import { getGenre ,addGenre} from '../controller/genre.controller.js';

const router = express.Router();

router.get('/genre', getGenre);
router.post('/addgenre', addGenre);

export default router;
