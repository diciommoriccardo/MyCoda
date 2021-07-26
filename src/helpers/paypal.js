import Paypal from '@paypal/checkout-server-sdk';
import {PAYPAL} from '../config/constants.js';

const CLIENT_ID = PAYPAL.CLIENT_ID;
const SECRET = PAYPAL.SECRET;

const ENVIROMENT = new Paypal.core.SandboxEnvironment(CLIENT_ID, SECRET);
const CLIENT = new Paypal.core.PayPalHttpClient(ENVIROMENT);
let request = new Paypal.orders.OrdersCreateRequest();

const Payment = {
    create: (amount, payeeEmail) => {
        return new Promise((resolve) => {
            request.requestBody({
                "intent": "CAPTURE",
                "payer": {
                    "payment_method": "paypal"
                },
                "application_context": {
                    "return_url": "https://api.server.mycoda.it/api/payments/success",
                    "cancel_url": "https://api.server.mycoda.it/api/payments/cancel",
                    "locale": "it-IT",
                    "user_action": "CONTINUE"
                },
                "purchase_units": [
                    {
                        "amount": {
                            "currency_code": "EUR",
                            "value": amount
                        }
                    }
                 ],
                "payee": {
                    "email_address": payeeEmail
                }
            })
                 
            let response = CLIENT.execute(request)
            resolve(response)
        })
    },

    capture: (orderId) => {
        return new Promise((resolve) => {
            let request = new Paypal.orders.OrdersCaptureRequest(orderId);
            request.requestBody({})

            let response = CLIENT.execute(request);
            resolve(response)
        })
    },
    
    getOrder: (orderId) => {
        return new Promise((resolve, reject) => {
            let request = new Paypal.orders.OrdersGetRequest(orderId);
            let response = CLIENT.execute(request);
            resolve(response)
        })
    }
}

export default Payment;