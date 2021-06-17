import randomString from '../utils/string/random.js';
import pool from '../helpers/mysql.js';
import { REFRESH_TOKEN } from '../config/constants.js';
import Validate from '../helpers/InputValidator.js';
import bcrypt from 'bcrypt';

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

class Pharmacy {
    constructor(pharma){
        return new Promise( (resolve, reject) =>{
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
        })
    }

    register(){
        return new Promise( (resolve, reject) => {
            let sql = 'INSERT INTO farma SET ?';

            getHashedPassword(this.password)
            .then(hash => {
                this.password = hash
                
                pool.getConnection( (err, connection) => {
                    if(err) return reject(err)
                    
                    connection.query(sql, [this],
                        function(err, result){
                            if(err) return reject(err)
                            
                            connection.release()
                            resolve(this.values)
                    })
                })
            })
            .catch( (err) => reject(err))
        });
    }

    login(){
        return new Promise( (resolve, reject) => {
            this.findByCf(this.piva)
            .then( ([row]) => { 
                bcrypt.compare(this.password, row.password) ? resolve(row) : reject()
            })
            .catch( (err) => {
                reject(err)
            })
            connection.release()
        })
    }

    findByCf(){
        return new Promise ( (resolve, reject) => {
            let sql = "SELECT * FROM farma WHERE piva = ?";

            pool.getConnection( (err, connection) => {
                if(err) return reject(err)
                
                connection.query(sql, [this.piva],
                    function(err, result){
                        if(err) return reject(err)

                        connection.release()
                        resolve(result)
                    })
            })
        })
    }

    /*updateByPiva(piva, data){
        return new Promise( (resolve, reject) => {
            let sql = "UPDATE farma SET ? WHERE piva = ?";
            
            pool.getConnection( (err, connection) => {
                if(err) return reject(err)

                connection.query(sql, data, piva, 
                    function(err, piva){
                        if(err) return reject(err)

                        connection.release()
                        resolve(findByPiva(piva))
                    })

            })
        })
    }*/
    
    findByRefreshToken(refresh_token){
        let sql = "SELECT * FROM farma WHERE refresh_token = ?";

        pool.getConnection( (err, connection) => {
            if(err) return reject(err)

            connection.query(sql, refresh_token,
                function(err, result){
                    if(err) return reject(err)

                    connection.release()
                    resolve(result)
                })
        })
    }

    getAll(){
        return new Promise( (resolve, reject) =>{
            let sql = "SELECT * FROM farma";

            pool.getConnection( (err, connection) => {
                if(err) return reject(err)

                connection.query(sql, 
                    function(err, result){
                        if(err) return reject(err)
                        connection.release()
                        resolve(result)
                    })
            })
        })
    }
}

export default Pharmacy;