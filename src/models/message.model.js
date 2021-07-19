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

            pool.query(sql, [this],
                function(err){
                    if(err) reject(err)

                    resolve(this.values)
                })
        })
    }

    findById(){
        return new Promise( (resolve, reject) =>{
            let sql = "SELECT * FROM msg WHERE id = ?";

            pool.query(sql, [this.id], 
                function(err, result){
                    if(err) reject(err);
                    
                    resolve(result);
                })
        })
    }

    findBySession(offset = 0, limit = 10){
        return new Promise((resolve, reject) => {
            let sql = `SELECT * FROM msg WHERE idSession = ? ORDER BY time DESC LIMIT ?, ?`;

            pool.query(sql, [this.idSession, offset, limit],
                function(err, result){
                    if(err) reject(err)
                    resolve(result)
                })
        })
    }

    getNewMessagesCount(){
        return new Promise((resolve, reject) => {
            let sqlCount = "SELECT COUNT(*) AS total FROM msg WHERE idSession = ? AND mittente <> ? AND stato = 'non letto'";

            pool.query(sqlCount, [this.idSession, this.mittente],
                (err, [message]) => {
                    if (err) reject(err);
                    resolve(message.total);
                }
            )
        })
    }

    changeStatusForSession(){
        return new Promise((resolve, reject) => {
            let sql = "UPDATE msg SET stato = 'letto' WHERE idSession = ? AND mittente = ?";
            
            pool.query(sql, [this.idSession, this.mittente],
                (err) => {
                    if(err) reject(err);
                    resolve(this);
                }
            )
        })
    }
}

export default Message