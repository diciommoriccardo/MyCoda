import pool from '../helpers/MysqlDb.js';

class session{
    constructor(session){
        this.cfUtente = session.cfUtente
        this.time = session.time
        this.pivaFarm = session.pivaFarm
    }

    create(){
        return new Promise( (resolve, reject) =>{
            let sql = "INSERT INTO msg SET ? LOCK FOR WRITE"

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
            let sql = "SELECT * FROM msg WHERE cfUtente = ? LOCK FOR READ"

            pool.getConnection( (err, connection) =>{
                if(err) return reject(err)

                connection.query(sql, connection.escape(this.cfUtente), 
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
            let sql = "SELECT * FROM msg WHERE pivaFarm = ? LOCK FOR READ"

            pool.getConnection((err, connection) =>{
                if(err) return reject(err)

                connection.query(sql, connection.escape(this.pivaFarm),
                    function(err, result){
                        if(err) return reject(err)

                        connection.release()
                        resolve(result)
                    })
            })
        })
    }
}