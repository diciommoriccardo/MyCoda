import pool from '../helpers/MysqlDb.js';

class payment{
    constructor(payment){
        this.somma = payment.somma
        this.time = payment.time
        this.cfUtente = payment.cfUtente
        this.pivaFarm = payment.pivaFarm
    }

    create(){
        return new Promise( (resolve, reject) =>{
            let sql = "INSERT INTO farma SET ? LOCK FOR WRITE";

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
            let sql = "SELECT * FROM payment WHERE cfUtente = ? LOCK FOR READ"

            pool.getConnection( (err, connection) =>{
                if(err) return reject(err)

                connection.query(sql, this.cfUtente,
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
            let sql = "SELECT * FROM payment WHERE pivaFarm = ? LOCK FOR READ"

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