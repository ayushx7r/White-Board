import express from 'express'
import { checkToken } from '../middlewares/authMiddleware.js';
import { getCanvases, createCanvas, getCanvasElements, updateCanvasElements, deleteCanvas } from '../controllers/canvas.js';
const router = express.Router();

router.get('/canvas',  getCanvases);

router.post('/canvas', createCanvas);

router.get('/canvas/:id', getCanvasElements);

router.post('/canvas/:id', updateCanvasElements);
router.delete('/canvas/:id', deleteCanvas);

export default router;