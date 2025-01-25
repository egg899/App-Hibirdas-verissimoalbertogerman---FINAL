import express from 'express';
import authenticateToken from '../middlewares/authMiddleware.js';
//import { agarrarTodosLosAlbums, agarrarAlbumPorId, agarrarAlbumPorNombre, actualizarAlbum, eliminarAlbum, agregarAlbum } from '../controllers/albumsControllers.js';
import {agarrarTodosLosAlbums, agregarAlbum, agarrarAlbumPorId, agarrarAlbumPorNombre, actualizarAlbum, eliminarAlbum, agarrarAlbumsPorGuitarrista, upoladAlbumImage } from '../controller/albumController.js';

const router = express.Router();


router.get('', agarrarTodosLosAlbums);
router.get('/:id', agarrarAlbumPorId);
router.get('/titulo/:titulo', agarrarAlbumPorNombre);
router.get('/artista/:artista', agarrarAlbumsPorGuitarrista);
router.put('/:id', upoladAlbumImage, actualizarAlbum);
router.delete('/:id',  eliminarAlbum);
router.post('',  upoladAlbumImage, agregarAlbum);

// router.put('/:id', authenticateToken, actualizarAlbum);
// router.delete('/:id', authenticateToken, eliminarAlbum);
// router.post('',  authenticateToken, agregarAlbum);

export default router;