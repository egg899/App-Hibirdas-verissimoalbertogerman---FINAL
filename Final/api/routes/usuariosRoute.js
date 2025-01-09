import express from 'express';
import { agarrarTodosLosUsuarios, obtenerUsuarioPorNombre, agregarUsuarios, uploadProfileImage, loginUsuario, actualizarUsuario, obtenerUsuarioPorId, eliminarUsuario } from '../controller/usuariosController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', agarrarTodosLosUsuarios);
router.get('/:id', obtenerUsuarioPorId);
router.post('/register', uploadProfileImage, agregarUsuarios);
router.post('/login', loginUsuario);
router.put('/:id', actualizarUsuario);
router.delete('/:id', eliminarUsuario);
router.get("/nombre/:name", obtenerUsuarioPorNombre);

//router.get("/nombre/:name", authenticateToken, obtenerUsuarioPorNombre);


export default router;

