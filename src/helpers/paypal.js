import Paypal from 'paypal-rest-sdk';
import {PAYPAL} from '../config/constants.js';

Paypal.configure({
    'mode': 'sandbox',
    'client_id': PAYPAL.CLIENT_ID,
    'client_secret': PAYPAL.SECRET
})

const payment = {
    create: (amount, description) => {
        return new Promise((resolve, reject) => {
            var create_payment_json = {
                "intent": "sale",
                "payer": {
                    "payment_method": "paypal"
                },
                "redirect_urls": {
                    "return_url": "https://localhost:8080/api/payments/success",
                    "cancel_url": "https://localhost:8080/api/payments/cancel"
                },
                "transactions": [{
                    "amount": {
                        "currency": "EUR",
                        "total": amount
                    },
                    "description": description
                }]
            };
            
            
            Paypal.payment.create(create_payment_json, function (error, payment) {
                if (error) {
                    reject(err)
                } else {
                    resolve(payment)
                }
            });  
        })
    }

    
}
