import express from 'express';
import { agarrarTodosLosComentarios, adherirComentarios } from '../controller/comentariosGuitController.js';

const router = express.Router();

router.get('', agarrarTodosLosComentarios);
router.post('', adherirComentarios);

export default router;