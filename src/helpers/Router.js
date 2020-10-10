import authMiddleware from '../middlewares/auth';
import tokenRenewal from '../routes/token';
import notFoundMiddleware from '../middlewares/notFound';
import spotifyRedirect from '../routes/auth/spotify/redirect';
import spotifyCallback from '../routes/auth/spotify/callback';


class Router {
    constructor( app ){
        this.app = app;
        this.routerSchema = {
            '/api': {
                '/token': tokenRenewal,
                '/auth': {
                    '/spotify': [
                        spotifyRedirect,
                        spotifyCallback,
                    ]
                },
                '/users': [
                    authMiddleware,
                ],
            },
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