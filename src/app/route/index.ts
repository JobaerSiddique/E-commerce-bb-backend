import express from 'express'
import { UserRoute } from '../module/user/user.route';
import { CategoryRoute } from '../module/Category/category.route';
import { ProductRoute } from '../module/Product/product.route';

import { AuthRoute } from '../module/Auth/auth.route';
import { CartRoute } from '../module/Cart/cart.route';




const router = express.Router();


const moduleRoutes = [
    {
        path:"/",
        route:UserRoute
    },
    {
        path:"/category",
        route:CategoryRoute
    },
    {
        path:"/product",
        route:ProductRoute
    },
    {
        path:"/auth",
        route:AuthRoute
    },
    {
        path:"/cart",
        route:CartRoute
    },
    
    
]


moduleRoutes.forEach((route)=>router.use(route.path,route.route) )

export default router;