import Router from 'express';
import * as psswdController from './Controllers/passwordController';

const router = Router();

router.get('/password', psswdController.getAllPsswd); // get all passwords
router.get('/password/:id', psswdController.getPsswdById); // get password by id
router.post('/password/register', psswdController.postPsswd); // post password
router.patch('/password/:id', psswdController.patchPsswd); // update password
router.delete('/password/:id', psswdController.deletePsswd); // delete password by id

export default router;