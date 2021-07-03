import authMiddleware from '../middlewares/auth.js';
import tokenRenewal from '../routes/token.js';
import userMe from '../routes/user/getById.js';
import userLogin from '../routes/user/login.js';
import userRegister from '../routes/user/register.js';
import pharmacyMe from '../routes/pharmacy/getById.js';
import pharmacyLogin from '../routes/pharmacy/login.js';
import pharmacyRegister from '../routes/pharmacy/register.js';
import notFoundMiddleware from '../middlewares/notFound.js';
import getAll from '../routes/pharmacy/getAll.js';
import createSession from '../routes/session/createSession.js';
import getUserPayments from '../routes/user/getPayments.js';
import getPharmacyPayment from '../routes/pharmacy/getPayments.js';
import createPayment from '../routes/payment/createPayment.js';
import getOpenSession from '../routes/session/getOpenSession.js';
import getSessions from '../routes/session/getSessions.js';
import saveMsgAndSession from '../routes/session/saveMessageWithSession.js';


class Router {
    constructor( app ){
        this.app = app;
        this.routerSchema = {
            '/api': [
                tokenRenewal,
                {
                    '/users': [userLogin, userRegister, authMiddleware, userMe, getUserPayments],
                    '/pharmacies': [pharmacyLogin, pharmacyRegister, authMiddleware, getAll, pharmacyMe, getPharmacyPayment],
                    '/payments' : [authMiddleware, createPayment],
                    '/sessions' : [authMiddleware, createSession, getOpenSession, getSessions, saveMsgAndSession]           
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