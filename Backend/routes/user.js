import express from 'express'
const router = express.Router();
import {handleLogin, handleRegister} from '../controllers/user.js'

router.post('/user/register', handleRegister);

router.post('/user/login', handleLogin);

export default router;