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
import createPayment from '../routes/payment/createPayment.js';
import getOpenSession from '../routes/session/getOpenSession.js';
import getSessions from '../routes/session/getSessions.js';
import getPayments from '../routes/payment/getPayments.js';
import sendMessage from '../routes/messages/saveMessages.js';
import getMessages from '../routes/messages/getMessages.js';
import closeSession from '../routes/session/sessionClose.js';
import readMessage from '../routes/messages/readMessage.js';
import successPayment from '../routes/payment/success.js';
import uploadImages from '../routes/images/upload.js';
import getImage from '../routes/images/getImage.js';


class Router {
    constructor( app ){
        this.app = app;
        this.routerSchema = {
            '/api': [
                tokenRenewal,
                {
                    '/users': [userLogin, userRegister, authMiddleware, userMe],
                    '/pharmacies': [pharmacyLogin, pharmacyRegister, authMiddleware, getAll, pharmacyMe],
                    '/payments' : [successPayment, authMiddleware, createPayment, getPayments],
                    '/sessions' : [authMiddleware, getOpenSession, getSessions, closeSession],
                    '/messages' : [authMiddleware, sendMessage, getMessages, readMessage],
                    '/images' : [authMiddleware, uploadImages, getImage]     
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