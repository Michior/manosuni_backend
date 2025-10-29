import { Router } from 'express';
import { listActivities, createActivity, updateActivity } from '../controllers/ngoActivitiesController.js';

const router = Router();

router.get('/', listActivities);    
router.post('/', createActivity);   
router.patch('/:id', updateActivity);

export default router;
