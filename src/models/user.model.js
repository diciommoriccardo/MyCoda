import randomString from '../utils/string/random.js';
import SUCCESS_ITA from '../config/constants.js';
import SUCCESS_EN from '../config/constants.js';
import MysqlDb from '../helpers/MysqlDb.js';
import  REFRESH_TOKEN from '../config/constants.js';
import validate from 'validate.js';

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
            let sql = 'INSERT INTO utente (cf, nome, cognome, numTel, email) VALUES(?,?,?,?);';

            this.MysqlDb.query(sql, [MysqlDb.escape(this.cf), this.nome, this.cognome, 
                this.numTel, MysqlDb.escape(this.email)],
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
            .then( (row) => { row.password == this.password ? resolve(row) : reject()})
            .catch( (err) => {reject(err)})
        })
    }

    updateByCf(cf, data){
        var column = Object.keys(data);

        let sql = "UPDATE user SET "
    }

    findByCf(cf){
        return new Promise ( (resolve, reject) => {
            let sql = "SELECT * FROM user WHERE cf = ?";

            MysqlDb.query(sql, cf)
            .then((row) => {row ? resolve(row) : reject()})
            .catch((err) => {reject(err);});
        })
    }
}

export default user;
