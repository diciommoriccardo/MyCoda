import bcrypt from 'bcrypt';
import randomString from '../utils/string/random.js';
import pool from '../helpers/mysql.js';
import { REFRESH_TOKEN } from '../config/constants.js';
import Validate from '../helpers/InputValidator.js';

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


class User {
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
            .catch(err => reject(err))
        })    
    }

    register(){
        return new Promise( (resolve, reject) => {
            let sql = 'INSERT INTO user SET ?';

            getHashedPassword(this.password)
            .then(hash => {
                const {cf, nome, cognome, numTel, email, password, refresh_token} = this;
                password = hash;
                
                pool.getConnection( (err, connection) => {
                    if(err) return reject(err)
                    
                    connection.query(sql, [
                        connection.escape(cf),
                        nome,
                        cognome,
                        connection.escape(numTel),
                        connection.escape(email),
                        connection.escape(password),
                        connection.escape(refresh_token)
                    ],
                        function(err){
                            if(err) return reject(err)
                            
                            connection.release()
                            resolve(this.values)
                    })
                })
            })
            .catch( (err) => {console.log(err); return reject(err)})
        });
    }

    login(){
        return new Promise( (resolve, reject) => {
            this.findByCf(this.cf)
            .then( ([row]) => { 
                bcrypt.compare(this.password, row.password)
                    .then((valid) => valid ? resolve(row) : reject())
                    .catch( error => reject(error));
            })
            .catch( (err) => {
                reject(err)
            })
        })
    }

    /*updateByCf(cf, data){
        return new Promise( (resolve, reject) => {
            let sql = "UPDATE user SET ? WHERE cf = ?";
            
            this.MysqlDb.query(sql, data, cf, function(err, result){
                if(err) return reject(err)

                connection.release()
                resolve(result)
            })
        })
    }*/

    findByCf(){
        return new Promise ( (resolve, reject) => {
            let sql = "SELECT * FROM user WHERE cf = ?";

            pool.getConnection( (err, connection) => {
                if(err) reject(err)
                
                connection.query(sql, [this.cf],
                    function(err, [row]){
                        if(err) reject(err)

                        connection.release()
                        console.log(row);
                        resolve(row)
                    })
            })
        })
    }

    findByRefreshToken(){
        return new Promise( (resolve, reject) =>{
            let sql = "SELECT * FROM user WHERE refresh_token = ?";

            pool.getConnection( (err, connection) =>{
                if(err) return reject(err)

                connection.query(sql, this.refresh_token,
                    function(err, result){
                        if(err) return reject(err)

                        connection.release()
                        resolve(result)
                    })
            })
        })
    }

    findAll(){
        return new Promise( (resolve, reject) =>{
            let sql = "SELECT * FROM user";

            pool.getConnection( (err, connection) =>{
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

export default User;
