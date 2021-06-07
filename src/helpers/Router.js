import authMiddleware from '../middlewares/auth.js';
import tokenRenewal from '../routes/token.js';
import getUser from '../routes/user/getById.js';
import userLogin from '../routes/user/login.js';
import userRegister from '../routes/user/register.js';
import getPharmacy from '../routes/pharmacy/getById.js';
import pharmacyLogin from '../routes/pharmacy/login.js';
import pharmacyRegister from '../routes/pharmacy/register.js';
import notFoundMiddleware from '../middlewares/notFound.js';
import getAll from '../routes/pharmacy/getAll.js';

class Router {
    constructor( app ){
        this.app = app;
        this.routerSchema = {
            '/api': [
                tokenRenewal,
                {
                    '/users': [userLogin, userRegister, authMiddleware, getUser],
                    '/pharma': [getPharmacy, pharmacyLogin, pharmacyRegister, getAll],
                }
            ],
            '*': notFoundMiddleware,
        }
    }
    
    setAllRoutes(_route = '', routerSchema = this.routerSchema) {
        switch(routerSchema.constructor) {
            case ({}).constructor:
                Object.keys(routerSchema).forEach((route) => { this.setAllRoutes(_route + route, routerSchema[route]); });
                break;
            case ([]).constructor:
                routerSchema.forEach((element) => { this.setAllRoutes(_route, element); });
                break;
            default:  _route === '' ? this.app.use(routerSchema) : this.app.use(_route, routerSchema);
        }
    }
}

export default Router;