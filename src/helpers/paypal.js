import Axios from 'axios';
import {PAYPAL} from '../config/constants.js';
import url from 'url'

const CLIENT_ID = PAYPAL.CLIENT_ID;
const SECRET = PAYPAL.SECRET;
const PAYPAL_API = 'https://api-m.sandbox.paypal.com';
Axios.defaults.baseURL = PAYPAL_API;

const Payment = {
    getAccessToken: (clientId = CLIENT_ID, clientSecret = SECRET) => {
        return new Promise((resolve, reject) => {
            const params = new url.URLSearchParams({ "grant_type": "client_credentials" })

            Axios({
                method: "POST",
                url: '/v1/oauth2/token',
                auth: {
                    username: clientId,
                    password: clientSecret
                },
                data: params
            })
            .then(result => resolve(result.data.access_token))
            .catch(err => reject(err))
        })
    },

    create: (amount, payeeEmail, access_token) => {
        return new Promise((resolve, reject) => {
            const config = {
                headers: { Authorization: `Bearer ${access_token}` }
            };

            const options = {
                "intent": "CAPTURE",
                "payer": {
                    "payment_method": "paypal"
                },
                "application_context": {
                    "return_url": "https://api.server.mycoda.it/api/payments/success",
                    "cancel_url": "https://api.server.mycoda.it/api/payments/cancel",
                    "locale": "it-IT"
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
            }

            Axios.post(
                '/v2/checkout/orders',
                options,
                config
            )
            .then(order => resolve(order))
            .catch(err => reject(err))
                        
        })
    },

    capture: (orderId, access_token) => {
        return new Promise((resolve) => {
            const config = {
                headers: { 
                    Authorization: `Bearer ${access_token}`,
                    'Content-Type': 'application/json'
                }
            };

            Axios.post(
                `/v2/checkout/orders/${orderId}/capture`,
                config
            )
        })
    },
    
    getOrder: (orderId) => {
        return new Promise((resolve) => {
            let request = new Paypal.orders.OrdersGetRequest(orderId);
            let response = CLIENT.execute(request);
            resolve(response)
        })
    }
}

export default Payment;