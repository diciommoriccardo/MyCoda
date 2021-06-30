import pool from '../helpers/mysql.js';

class Payment {
    constructor(payment){
        return new Promise((resolve, reject) => {
            this.somma = payment.somma
            this.time = new Date(Date.now())
            this.cfUtente = payment.cfUtente
            this.pivaFarm = payment.pivaFarm
            resolve(this)
        })
    }

    create(){
        return new Promise( (resolve, reject) =>{
            let sql = "INSERT INTO payment SET ?";

            pool.getConnection( (err, connection) =>{
                if(err) return reject(err)

                connection.query(sql, [this],
                    function(err){
                        if(err) return reject(err)

                        connection.release()
                        resolve(this.values)
                    })
            })
        })
    }

    findByUser(){
        return new Promise( (resolve, reject) =>{
            let sql = "SELECT * FROM payment WHERE `cfUtente` = ?"

            pool.getConnection( (err, connection) =>{
                if(err) return reject(err)

                connection.query(sql, [this.cfUtente],
                    function(err, result){
                        if(err) return reject(err)

                        connection.release()
                        resolve(result)
                    })
            })
        })
    }

    findByPharma(){
        return new Promise( (resolve, reject) =>{
            let sql = "SELECT * FROM payment WHERE pivaFarm = ?"

            pool.getConnection( (err, connection) =>{
                if(err) return reject(err)

                connection.query(sql, this.pivaFarm,
                    function(err, result){
                        if(err) return reject(err)

                        connection.release()
                        resolve(result)
                    })
            })
        })
    }
}

export default Payment