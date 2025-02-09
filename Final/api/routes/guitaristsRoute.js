import express from 'express';
import authenticateToken from '../middlewares/authMiddleware.js';
// import { agarrarTodosLosGuitarristas, agarrarGuitarristasPorId, agarrarGuitarristasPorNombre, actualizarGuitarrista, eliminarGuitarrista, agregarGuitarrista } from '../controllers/guitaristControllers.js';
import {agarrarTodosLosGuitarristas, agregarGuitarrista, agarrarGuitarristaPorId, agarrarGuitarristaPorNombre, actualizarGuitarrista, eliminarGuitarrista, devolverGuitarristaId, uploadGuitaristImage } from '../controller/guitaristController.js';


const router = express.Router();

router.get('', agarrarTodosLosGuitarristas);
router.get('/:id', agarrarGuitarristaPorId);
router.get('/nombre/:nombre', agarrarGuitarristaPorNombre);
router.get('/id/:nombre', devolverGuitarristaId);
// router.put('/:id', authenticateToken, uploadGuitaristImage, actualizarGuitarrista);
router.put('/:id', uploadGuitaristImage, actualizarGuitarrista);
router.delete('/:id', authenticateToken, eliminarGuitarrista);
router.post('', authenticateToken, uploadGuitaristImage, agregarGuitarrista);
//router.post('', authenticateToken, agregarGuitarrista);

// router.get('', agarrarTodosLosGuitarristas);
// router.get('/:id', agarrarGuitarristaPorId);
// router.get('/nombre/:nombre', agarrarGuitarristaPorNombre);
// router.put('/:id', authenticateToken, actualizarGuitarrista);
// router.delete('/:id', authenticateToken, eliminarGuitarrista);
// router.post('', authenticateToken, agregarGuitarrista);
// const router = express.Router();

// router.get('', agarrarTodosLosGuitarristas); 
// router.get('/:id', agarrarGuitarristaPorId);
// router.get('/nombre/:nombre', agarrarGuitarristaPorNombre);
// router.put('/:id', authenticateToken, actualizarGuitarrista);
// router.delete('/:id', authenticateToken, eliminarGuitarrista);
// router.post('', authenticateToken, agregarGuitarrista);
export default router;