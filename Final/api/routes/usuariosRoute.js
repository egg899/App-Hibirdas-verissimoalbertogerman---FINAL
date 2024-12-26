import express from 'express';
import { agarrarTodosLosUsuarios, obtenerUsuarioPorNombre, agregarUsuarios, loginUsuario } from '../controller/usuariosController.js';
import authenticateToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', agarrarTodosLosUsuarios);
router.post('/register', agregarUsuarios);
router.post('/login', loginUsuario);

//router.get("/nombre/:name", obtenerUsuarioPorNombre);

router.get("/nombre/:name", authenticateToken, obtenerUsuarioPorNombre);


export default router;

