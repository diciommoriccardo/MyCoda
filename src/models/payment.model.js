import pool from '../helpers/mysql.js';

class Payment {
    constructor(payment){
        return new Promise((resolve, reject) => {
            this.id = payment.id
            this.somma = payment.somma
            this.time = new Date(Date.now())
            this.cfUtente = payment.cfUtente
            this.pivaFarma = payment.pivaFarma
            this.desc = payment.desc
            this.stato = 'in attesa'
            resolve(this)
        })
    }

    create(){
        return new Promise( (resolve, reject) =>{
            let sql = "INSERT INTO payment SET ?";

            pool.query(sql, [this],
                function(err){
                    if(err) reject(err)

                    resolve(this.values)
                })
        })
    }

    findByUser(){
        return new Promise( (resolve, reject) =>{
            let sql = "SELECT * FROM payment WHERE `cfUtente` = ?"

            pool.query(sql, [this.cfUtente],
                function(err, result){
                    if(err) reject(err)

                    resolve(result)
                })
        })
    }

    findByPharma(){
        return new Promise( (resolve, reject) =>{
            let sql = "SELECT * FROM payment WHERE pivaFarma = ?"

            pool.query(sql, this.pivaFarma,
                function(err, result){
                    if(err) reject(err)

                    resolve(result)
                })
        })
    }
}

export default Payment