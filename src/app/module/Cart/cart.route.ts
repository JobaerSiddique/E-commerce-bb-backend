import express from 'express'
import { CartController } from './cart.controller'
import Auth from '../../middlewares/Auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router()

router.post('/',Auth(USER_ROLE.user),CartController.addToCart)
router.get('/',CartController.getAllCart)
router.get('/userCart',Auth(USER_ROLE.user),CartController.getUserCart)

export const CartRoute = router;