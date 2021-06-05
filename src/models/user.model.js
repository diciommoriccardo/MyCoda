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


class user{
    constructor( user ){
        return new Promise((resolve, reject) =>{
            validate.validateUserInput(user)
            .then( (user)  => {
                this.cf = user.cf;
                this.nome = user.nome;
                this.cognome = user.cognome;
                this.numTel = user.numTel;
                this.email = user.email;
                this.password = user.password;
                this.refresh_token = user.refresh_token || getRefreshToken();
                resolve(this)
            })
            .catch( (err) => { reject(err) })
        })    
    }

    register(){
        return new Promise( (resolve, reject) => {
            let sql = 'INSERT INTO user SET ?';

            getHashedPassword(this.password)
            .then(hash => {
                this.password = hash
                
                pool.getConnection( (err, connection) => {
                    if(err) return reject(err)
                    
                    connection.query(sql, [this],
                        function(err, result){
                            if(err) return reject(err)
                            
                            resolve(this.values)
                    })
                })
            })
            .catch( (err) => reject(err))
        });
    }

    login(){
        return new Promise( (resolve, reject) => {
            this.findByCf(this.cf)
            .then( ([row]) => { 
                bcrypt.compare(this.password, row.password) ? resolve(row) : reject()
            })
            .catch( (err) => {
                reject(err)
            })
        })
    }

    updateByCf(cf, data){
        return new Promise( (resolve, reject) => {
            let sql = "UPDATE user SET ? WHERE cf = ?";
            
            this.MysqlDb.query(sql, data, cf, function(err, result){
                if(err) return reject(err)
                resolve(result)
            })
        })
    }

    findByCf(cf){
        return new Promise ( (resolve, reject) => {
            let sql = "SELECT * FROM user WHERE cf = ?";

            pool.getConnection( (err, connection) => {
                if(err) throw err
                
                connection.query(sql, [cf],
                    function(err, result){
                        if(err) reject(err)

                        resolve(result)
                    })
            })
        })
    }

    findByRefreshToken(refresh_token){
        let sql = "SELECT * FROM user WHERE refresh_token = ?";

        MysqlDb.query(sql, refresh_token, function(err, result){
            if(err) return reject(err)
            resolve(result)
        })
    }

    findAll(){
        let sql = "START TRANSACTION; SELECT * FROM user LOCK FOR READ; COMMIT;";

        MysqlDb.query(sql, function(err, result){
            if(err) return reject(err)

            resolve(result)
        })
    }
}

export default user;
