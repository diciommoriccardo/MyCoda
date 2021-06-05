import authMiddleware from '../middlewares/auth.js';
import tokenRenewal from '../routes/token.js';
import getUser from '../routes/user/getUser.js';
import userLogin from '../routes/user/login.js';
import userRegister from '../routes/user/register.js';
import getPharma from '../routes/pharma/getPharma.js';
import pharmaLogin from '../routes/pharma/login.js';
import pharmaRegister from '../routes/pharma/register.js';
import notFoundMiddleware from '../middlewares/notFound.js';
import getAll from '../routes/pharma/getAll.js';

class Router {
    constructor( app ){
        this.app = app;
        this.routerSchema = {
            '/api': {
                "/token" : tokenRenewal
            },
            '/users': [getUser,userLogin,userRegister],
            '/pharma': [getPharma,pharmaLogin,pharmaRegister,getAll],
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