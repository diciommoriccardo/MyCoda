import authMiddleware from '../middlewares/auth.js';
import tokenRenewal from '../routes/token.js';
import notFoundMiddleware from '../middlewares/notFound.js';
//import redirect from '../routes/auth/redirect';
//import callback from '../routes/auth/callback';


class Router {
    constructor( app ){
        this.app = app;
        this.routerSchema = {
            '/api': {
                '/token': tokenRenewal
            },
            '/user': {
                '/:id': 
            }
            '*': notFoundMiddleware,
        };
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