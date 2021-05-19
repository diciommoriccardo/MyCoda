import randomString from '../utils/string/random.js';
import {SUCCESS_ITA} from '../config/constants.js';
import {SUCCESS_EN} from '../config/constants.js';
import pool from '../helpers/MysqlDb.js';
import { REFRESH_TOKEN } from '../config/constants.js';
import Validate from '../helpers/inputValidate.js';
import bcrypt, { hash } from 'bcrypt';

const validate = new Validate();

const getRefreshToken = () => {
    return randomString(REFRESH_TOKEN.LENGTH);
}

async function getHashedPassword(password){
    return new Promise((resolve, reject) => {
        try {
            bcrypt.genSalt(10)
            .then(salt => {
                bcrypt.hash(password, salt)
                .then(hash => resolve(hash))
                .catch(err => reject(err))
            })
            .catch(err => reject(err))
        } catch (err) {
            return err
        }
    })
}

class pharma{
    constructor(pharma){
        validate.validatePharmaInput(pharma)
        .then( (pharma) => {
            this.piva = pharma.piva
            this.ragSociale = pharma.ragSociale
            this.iban = pharma.iban
            this.password = pharma.password
            this.refresh_token = pharma.refresh_token || getRefreshToken()
            resolve(this)
        })
        .catch( (err) => {reject(err)})
    }

    register(){
        return new Promise( (resolve, reject) => {
            let sql = 'INSERT INTO farma SET ?';

            getHashedPassword(this.password)
            .then(hash => {
                this.password=hash

                pool.getConnection( (err, connection) => {
                    if(err) reject(err)
                
                    connection.query(sql, [this],
                        function(err, result){
                            if(err) reject(err)
    
                            //resolve(result)
                    })
                })
            })
            .then( () => {resolve(this)})
            .catch( (err) => reject(err))
        });
    }

}