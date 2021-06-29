import validate from 'validate.js';

class InputValidator {
    constructor(){
       this.userCostraints = {
            cf: {
                type: "string",
                /*lenght: {
                    minimum: 16,
                    maximum: 16,
                    message: "Il Codice Fiscale deve essere composto da 16 cifre"
                } */   
            },
            nome: {
                type: "string"
            },
            cognome: {
                type: "string"
            },
            numTel: {
                type: "string",
                numericality: true
            },
            email: {
                type: "string",
                email: true
            },
            password: {
                type: "string",
                /*lenght: {
                    minimum: 8,
                    message: "La password deve contenere almeno 8 caratteri, massimo 16"
                }*/
            },
            refresh_token: {
                type: "string"
            }
        }
        
        this.pharmaCostraints = {
            piva: {
                type: "string",
                /*lenght: {
                    minimum: 11,
                    maximum: 11,
                    message: "La partita IVA deve contenere 11 caratteri per essere valida!"
                }*/
            },
            ragSociale: {
                type: "string"
            },
            password: {
                type: "string",
                /*lenght: {
                    minimum: 8,
                    maximum: 16,
                    message: "La password deve contenere almeno 8 caratteri, massimo 16"
                }*/
            },
            refresh_token: {
                type: "string"
            }
        }
    }
    
    validateUserInput(data){
        return new Promise( (resolve, reject) => {
            validate.async(data, this.userCostraints)
            .then(data => resolve(data))
            .catch(err => reject(err))
        }) 
    }

    validatePharmaInput(data){
        return new Promise( (resolve, reject) => {
            validate.async(data, this.pharmaCostraints)
            .then(data => resolve(data))
            .catch(err => reject(err))
        })
    }
}

export default InputValidator;