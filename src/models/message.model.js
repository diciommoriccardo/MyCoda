import pool from '../helpers/mysql.js';

class Message {
    constructor(message){
        return new Promise( (resolve) =>{
            this.mittente = message.mittente
            this.time = new Date(Date.now())
            this.content = message.content
            this.stato = 'non letto' // stato = non letto || stato = letto
            this.tipo = message.tipo || 2 // immagine = 1, messaggio = 2, pagamento = 3
            this.idSession = message.idSession
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
            let sql = "SELECT * FROM msg WHERE id = ?";

            pool.getConnection( (err, connection) =>{
                if(err) return reject(err);

                connection.query(sql, [this.id], 
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
            let sql = "SELECT * FROM msg WHERE pivaFarma = ?"

            pool.getConnection((err, connection) =>{
                if(err) return reject(err)

                connection.query(sql, [this.pivaFarma],
                    function(err, result){
                        if(err) return reject(err)

                        connection.release()
                        resolve(result)
                    })
            })
        })
    }

    findBySession(){
        return new Promise((resolve, reject) => {
            let sql = "SELECT content, time, stato FROM msg WHERE idSession = ?";

            pool.getConnection((err, connection) => {
                if(err) reject(err)

                connection.query(sql, [this.idSession],
                    function(err, result){
                        if(err) reject(err)

                        connection.release()
                        resolve(result)
                    })
            })
        })
    }
}

export default Message