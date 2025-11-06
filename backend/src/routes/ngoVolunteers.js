import { Router } from 'express';
import {
    listVolunteersByActivity,
    markEnrollmentStatus,
} from '../controllers/ngoVolunteersController.js';

const router = Router();


router.get('/', listVolunteersByActivity);


router.put('/:enrollment_id', markEnrollmentStatus);

export default router;
