import { Router } from 'express';
import { listVolunteers, updateVolunteer } from '../controllers/ngoVolunteersController.js';

const router = Router();

router.get('/', listVolunteers);
router.patch('/:enrollment_id', updateVolunteer);

export default router;
