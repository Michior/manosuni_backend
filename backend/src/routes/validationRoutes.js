import express from 'express';
import { getValidations, patchValidationStatus } from '../controllers/validationController.js';

const router = express.Router();

router.get('/', getValidations); // Obtener todas las validaciones
router.patch('/:id', patchValidationStatus); // Actualizar estado

export default router;
