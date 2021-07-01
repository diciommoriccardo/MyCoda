import pool from '../helpers/mysql.js';

class Session {
    constructor(session){
        return new Promise( (resolve) =>{
            this.cfUtente = session.cfUtente
            this.time = new Date(Date.now())
            this.pivaFarma = session.pivaFarma
            resolve(this)
        })
        
    }

    create(){
        return new Promise( (resolve, reject) =>{
            let sql = "INSERT INTO session SET ?"

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

    findById(){
        return new Promise( (resolve, reject) =>{
            let sql = "SELECT * FROM session WHERE cfUtente = ? AND pivaFarma = ?";

            pool.getConnection( (err, connection) =>{
                if(err) return reject(err);

                connection.query(sql, [this.cfUtente, this.pivaFarma], 
                    function(err, result){
                        if(err) return reject(err);
                        
                        connection.release();
                        resolve(result);
                    })
            })
        })
    }

    findByUser(){
        return new Promise( (resolve, reject) =>{
            let sql = "SELECT * FROM session WHERE cfUtente = ?"

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
            let sql = "SELECT * FROM session WHERE pivaFarma = ?"

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

export default Session