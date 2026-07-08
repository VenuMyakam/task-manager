import { Router } from 'express';
import requireAuth from '../middleware/auth.js';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/taskController.js';

const router = Router();

// requireAuth runs first on EVERY route below — no route in this file
// is reachable without a valid token.
router.use(requireAuth);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

export default router;