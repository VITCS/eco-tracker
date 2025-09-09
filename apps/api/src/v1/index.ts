import { Router } from 'express';
import auth from './auth';
import users from './users';
import activities from './activities';

export const router = Router();
router.use('/auth', auth);
router.use('/users', users);
router.use('/activities', activities);

