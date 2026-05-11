import express from 'express'
const router = express.Router();
import {getUser, handleLogin, handleRegister} from '../controllers/user.js'

router.post('/user/register', handleRegister);

router.post('/user/login', handleLogin);

router.get('/user', getUser);

export default router;