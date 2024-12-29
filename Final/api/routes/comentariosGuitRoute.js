import express from 'express';
import { agarrarTodosLosComentarios, adherirComentarios, agarrarGuitarristaCommentsById } from '../controller/comentariosGuitController.js';

const router = express.Router();

router.get('', agarrarTodosLosComentarios);
router.get('/:guitarristaId', agarrarGuitarristaCommentsById);
router.post('', adherirComentarios);

export default router;