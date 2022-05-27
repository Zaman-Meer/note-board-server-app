import express from 'express';
import controller from '../controllers/authController';

const router = express.Router();

router.post('/login', controller.loginUser);

export default router;
