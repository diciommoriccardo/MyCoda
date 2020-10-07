import authMiddleware from '../middlewares/auth';
import notFoundMiddleware from '../middlewares/notFound';
import spotifyAuth from '../routes/auth/spotify/get';
import spotifyCallback from '../routes/auth/spotify/callback';


class Router {
    constructor( app ){
        this.app = app;
        this.routerSchema = {
            '/api': {
                '/auth': {
                    '/spotify': [
                        spotifyAuth,
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