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
                if(err) reject(err)

                connection.query(sql, [this],
                    function(err){
                        if(err) reject(err)

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
                if(err) reject(err);

                connection.query(sql, [this.id], 
                    function(err, result){
                        if(err) reject(err);
                        
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
                if(err) reject(err)

                connection.query(sql, [this.cfUtente], 
                    function(err, result){
                        if(err) reject(err)

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
                if(err) reject(err)

                connection.query(sql, [this.pivaFarma],
                    function(err, result){
                        if(err) reject(err)

                        connection.release()
                        resolve(result)
                    })
            })
        })
    }

    findBySession(limit, offset){
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM msg WHERE idSession = ? LIMIT " + limit + ", "+ offset +"";

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

    findBySession(){
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM msg WHERE idSession = ?";

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

    lastMessageBySession(){
        return new Promise((resolve, reject) => {
            let sqlMessage = "SELECT * FROM msg WHERE idSession = ? ORDER BY time DESC LIMIT 1";
            let sqlCount = "SELECT COUNT(*) AS tot FROM msg WHERE idSession = ? AND stato = 'non letto'";

            pool.getConnection((err, connection) => {
                if(err) reject(err)

                console.log("connected as: " + connection.threadId);
                connection.query(sqlMessage, [this.idSession],
                    (err, message) => {
                        if(err) reject(err)

                        connection.query(sqlCount, [this.idSession],
                            (err, result) =>{
                                if(err) reject(err)

                                message[0].tot = result[0].tot;
                                connection.release()
                                resolve(message)  
                            })
                    })
            })
        })
    }
}

export default Message