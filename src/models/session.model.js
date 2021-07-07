import pool from '../helpers/mysql.js';

class Session {
    constructor(session){
        return new Promise( (resolve) =>{
            this.id = session.id
            this.cfUtente = session.cfUtente
            this.time = new Date(Date.now())
            this.pivaFarma = session.pivaFarma
            this.stato = "open"
            resolve(this)
        })
        
    }

    create(){
        return new Promise( (resolve, reject) =>{
            this.exist()
            .then((result)=>{
                if(result.length != 0) return resolve(result[0])

                pool.getConnection((err, connection) => {
                    if (err) reject(err);
    
                    let sql = "INSERT INTO session SET ?";
    
                    connection.query(sql, [this],
                        (err, result) => {
                            if (err) reject(err);
    
                            connection.release()
                            this.id = result.insertId;
                            resolve(this)
                    });
                })
            })
        })
    }

    exist(){
        return new Promise((resolve, reject) =>{
            pool.getConnection((err, connection)=>{
                if(err) reject(err)

                let sql = "SELECT * FROM session WHERE cfUtente = ? AND pivaFarma = ? AND  `stato` = 'open'";

                connection.query(sql, [this.cfUtente, this.pivaFarma],
                    (err, result)=>{
                        if(err) reject(err)

                        connection.release();
                        resolve(result)
                    })
            })
        })
    }

    findById(){
        return new Promise( (resolve, reject) =>{
            let sql = "SELECT * FROM session WHERE id = ?";

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

    findByBoth(){
        return new Promise((resolve, reject)=>{
            let sql = "SELECT id FROM session WHERE cfUtente = ? AND pivaFarma = ?";

            pool.getConnection((err, connection) =>{
                if(err) reject(err)

                connection.query(sql, [this.cfUtente, this.pivaFarma],
                    function(err, result){
                        if(err) reject(err)

                        connection.release();
                        resolve(result)
                    })
            })
        })
    }

    findByUser(){
        return new Promise( (resolve, reject) =>{
            pool.getConnection( (err, connection) =>{
                if(err) return reject(err)

                let sqlSession = "SELECT id, cfUtente, pivaFarma FROM session WHERE cfUtente = ? GROUP BY id, cfUtente, pivaFarma ORDER BY time DESC"
                let sqlMsg = "SELECT * FROM msg WHERE idSession = ?  ORDER BY time DESC LIMIT 1";

                connection.query(sqlSession, [this.pivaFarma],
                    function (err, sessions) {
                        if (err) reject(err)
                        Promise.all(sessions.map(({ id, cfUtente, pivaFarma }) =>
                            new Promise((resolve, reject) => {
                                connection.query(sqlMsg, [id],
                                    (err, [lastMessage]) => {
                                        if (err) reject(err)
                                        resolve({
                                            cfUtente,
                                            pivaFarma,
                                            lastMessage: !lastMessage ? {} : {
                                                time: lastMessage.time,
                                                content: lastMessage.content
                                            },
                                        });
                                    }
                                );
                            }
                            )))
                            .then(result => resolve(result))
                            .catch(error => reject(error));
                    }
                )
                connection.release();
            })
        })
    }

    findByPharma(){
        return new Promise( (resolve, reject) =>{
            pool.getConnection( (err, connection) =>{
                if(err) return reject(err)

                let sqlSession = "SELECT id, cfUtente, pivaFarma FROM session WHERE pivaFarma = ? GROUP BY id, cfUtente, pivaFarma ORDER BY time DESC"
                let sqlMsg = "SELECT * FROM msg WHERE idSession = ? ORDER BY time DESC LIMIT 1";

                connection.query(sqlSession, [this.pivaFarma], 
                    function(err, sessions) {
                        if(err) reject (err)
                        Promise.all(sessions.map(({ id, cfUtente, pivaFarma }) => 
                            new Promise((resolve, reject) => {
                                connection.query(sqlMsg, [id],
                                    (err, [lastMessage]) => {
                                        if (err) reject(err)
                                        resolve({
                                            cfUtente,
                                            pivaFarma,
                                            lastMessage: !lastMessage ? {} : { 
                                                time: lastMessage.time, 
                                                content: lastMessage.content 
                                            },
                                        });
                                    }
                                );
                            }
                        )))
                        .then(result => resolve(result))
                        .catch(error => reject(error));
                    }
                )
                connection.release();
            })
        })
    }

    findOpenSessionByUser(){
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM session WHERE cfUtente = ? AND stato = 'open'";
            let sqlMsg = "SELECT * FROM msg WHERE idSession = ? ORDER BY time DESC LIMIT 1";
            pool.getConnection((err, connection) => {
                if(err) return reject(err)
                connection.query(sql, [this.cfUtente],
                    function (err, sessions) {
                        if (err) reject(err)
                        Promise.all(sessions.map(({ id, cfUtente, pivaFarma }) =>
                            new Promise((resolve, reject) => {
                                connection.query(sqlMsg, [id],
                                    (err, [lastMessage]) => {
                                        if (err) reject(err)
                                        resolve({
                                            id,
                                            cfUtente,
                                            pivaFarma,
                                            lastMessage: !lastMessage ? {} : {
                                                time: lastMessage.time,
                                                content: lastMessage.content,
                                                type: lastMessage.tipo,
                                            },
                                        });
                                    }
                                );
                            }
                            )))
                            .then(result => resolve(result))
                            .catch(error => reject(error));
                    }
                )
            })
        })
    }

    findOpenSessionByPharma(){
        return new Promise((resolve, reject)=>{
            let sql = "SELECT * FROM session WHERE pivaFarma = ? AND stato = 'open'";
            let sqlMsg = "SELECT * FROM msg WHERE idSession = ? ORDER BY time DESC LIMIT 1";

            pool.getConnection((err, connection)=>{
                if(err) return reject(err)
                connection.query(sql, [this.pivaFarma],
                    function (err, sessions) {
                        if (err) reject(err)
                        Promise.all(sessions.map(({ id, cfUtente, pivaFarma }) =>
                            new Promise((resolve, reject) => {
                                connection.query(sqlMsg, [id],
                                    (err, [lastMessage]) => {
                                        if (err) reject(err)
                                        resolve({
                                            id,
                                            cfUtente,
                                            pivaFarma,
                                            lastMessage: !lastMessage ? {} : {
                                                time: lastMessage.time,
                                                content: lastMessage.content
                                            },
                                        });
                                    }
                                );
                            }
                            )))
                            .then(result => resolve(result))
                            .catch(error => reject(error));
                    }
                )
            }) 
        })
    }

    findOpenSessionByBoth(){
        return new Promise((resolve, reject) =>{
            let sql = "SELECT * FROM session WHERE cfUtente = ? AND pivaFarma = ? AND stato = 'open'";

            pool.getConnection((err, connection)=>{
                if(err) reject(err)

                connection.query(sql, [this.cfUtente, this.pivaFarma],
                    function(err, result){
                        if(err) reject(err)

                        connection.release()
                        resolve(result)
                    })
            })
        })
    }

    sessionClose(){
        return new Promise((resolve, reject) => {
            let sql = "UPDATE session SET stato = 'closed' WHERE id = ?";

            pool.getConnection((err, connection)=>{
                if(err) reject(err)

                connection.query(sql, [this.id],
                    (err)=>{
                        if(err) reject(err)

                        connection.release()
                        this.stato = 'closed';
                        resolve(this)
                    })
            })
        })
    }
}

export default Session