import pool from '../helpers/mysql.js';

class Message {
    constructor(message){
        return new Promise( (resolve) =>{
            this.cfUtente = message.cfUtente
            this.pivaFarma = message.pivaFarma
            this.time = new Date(Date.now())
            this.content = message.content
            resolve(this)
        })  
    }

    create(){
        return new Promise( (resolve, reject) =>{
            let sql = "INSERT INTO msg SET ?"

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
            let sql = "SELECT * FROM msg WHERE cfUtente = ? AND pivaFarma = ?";

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
            let sql = "SELECT * FROM msg WHERE cfUtente = ?"

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
            let sql = "SELECT * FROM msg WHERE pivaFarma = ?"

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

export default Message