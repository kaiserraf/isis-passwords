import Router from 'express';
import * as psswdController from './Controllers/passwordController';
import * as userController from './Controllers/userController';
import { authToken } from './middlewares/auth';
import { validateBody } from './middlewares/validate';

const router = Router();

router.get('/password', authToken, psswdController.getAllPsswd); // get all passwords
router.get('/password/:id', authToken, psswdController.getPsswdById); // get password by id
router.post('/password/register', authToken, validateBody, psswdController.postPsswd); // post password
router.patch('/password/:id', authToken, psswdController.patchPsswd); // update password
router.delete('/password/:id', authToken, psswdController.deletePsswd); // delete password by id


router.post('/login', userController.login); // login
router.post('/register', authToken, userController.register); // registro
router.post('/refresh', userController.refresh); // refresh token
router.post('/logout', userController.logout); // logout


export default router;