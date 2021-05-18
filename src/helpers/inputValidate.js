import validate from 'validate.js';


class inputValidate{
    constructor(){
       this.costraints = {
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
                    message: "La password deve contenere almeno 8 caratteri"
                }*/
            },
            refresh_token: {
                type: "string"
            }
        } 
    }
    
    validateInput(data){
        return new Promise( (resolve, reject) => {
            validate.async(data, this.costraints)
            .then( (data) => { resolve(data) })
            .catch( (err) => { reject(err)})
        }) 
    }

    
}
export default inputValidate;