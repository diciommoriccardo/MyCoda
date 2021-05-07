import randomString from '../utils/string/random.js';
import SUCCESS_ITA from '../config/constants.js';
import SUCCESS_EN from '../config/constants.js';
import MysqlDb from '../helpers/MysqlDb.js';
import  REFRESH_TOKEN from '../config/constants.js';
import validate from 'validate.js';
import bcrypt from 'bcrypt';

var costraints = {
    cf: {
        presence: true,
        type: "string",
        lenght: {
            minimum: 16,
            maximum: 16,
            message: "Il Codice Fiscale deve essere composto da 16 cifre"
        }    
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
        from: {
            email: true
        }
    },
    password: {
        type: "string",
        lenght: {
            minimum: 8,
            message: "La password deve contenere almeno 8 caratteri"
        }
    },
    refresh_token: {
        type: "string"
    }
}

const getRefreshToken = () => {
    return randomString(REFRESH_TOKEN.LENGTH);
}

async function getSalt(){
    try{
        await bcrypt.genSalt()
        .then( (salt) => { return resolve(salt) })
        .catch( (err) => { reject(err) })
    } catch (err) {
        return err
    }
}

async function getHashedPassword(password){
    try {
        await bcrypt.hash(password, getSalt())
        .then( (result) => {return resolve(result)})
        .catch( (err) => {reject(err)})
    } catch (err) {
        return err
    }

}

class user{
    constructor({ user }){
        validate({ user }, costraints)
        .then( ({ user }) => {
            this.cf = user.cf;
            this.nome = user.nome;
            this.cognome = user.cognome;
            this.numTel = user.numTel;
            this.email = user.email;
            this.password = user.password;
            this.refresh_token = user.refresh_token || getRefreshToken();
            resolve(this)
        })
        .catch( (err) => reject(err) )
    }

    register(){
        return new Promise((resolve, reject) => {
            let sql = 'INSERT INTO utente SET ?';

            this.MysqlDb.query(sql, [MysqlDb.escape(this.cf), this.nome, this.cognome, 
                this.numTel, MysqlDb.escape(this.email), MysqlDb.escape(getHashedPassword(this.password))],
                function(err, result){
                    if(err) return reject(error);

                    console.log(SUCCESS_ITA.REGISTER);
                    resolve(result);
            })
        });
    }

    login(){
        return new Promise( (resolve, reject) => {
            user.findByCf(this.cf)
            .then( (row) => { 
                bcrypt.compare(this.password, row.password)
                .then( (result) =>{
                    resolve(result)
                })
                .catch( (err) => {
                    reject(err)
                })
            })
            .catch( (err) => {reject(err)})
        })
    }

    updateByCf(cf, data){
        return new Promise( (resolve, reject) => {
            var column = Object.keys(data);

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

            MysqlDb.query(sql, cf)
            .then((row) => {row ? resolve(row) : reject()})
            .catch((err) => {reject(err);});
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
        let sql = "SELECT * FROM user";

        MysqlDb.query(sql, function(err, result){
            if(err) return reject(err)

            resolve(result)
        })
    }
}

export default user;
