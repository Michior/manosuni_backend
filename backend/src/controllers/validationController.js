import { getAllValidations, updateValidationStatus } from '../models/validation.js';

export const getValidations = async (req, res) => {
  try {
    const validations = await getAllValidations();
    res.status(200).json(validations);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener validaciones', error: err.message });
  }
};

export const patchValidationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Aceptada', 'Rechazada'].includes(status)) {
      return res.status(400).json({ message: 'Estado no válido. Use Aceptada o Rechazada.' });
    }

    const updated = await updateValidationStatus(id, status);

    if (!updated) {
      return res.status(404).json({ message: 'Solicitud no encontrada' });
    }

    res.status(200).json({ message: 'Estado actualizado correctamente', validation: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar validación', error: err.message });
  }
};
