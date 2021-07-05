import pool from '../helpers/mysql.js';

class Session {
    constructor(session){
        return new Promise( (resolve) =>{
            this.id = session.id
            this.cfUtente = session.cfUtente
            this.time = new Date(Date.now())
            this.pivaFarma = session.pivaFarma
            this.status = "open"
            resolve(this)
        })
        
    }

    create(){
        return new Promise( (resolve, reject) =>{
            pool.getConnection((err, connection) => {
                if(err) reject(err)

                connection.query('INSERT INTO session SET ?', [this],
                    (err) => {
                        if(err) reject(err)

                        connection.release()
                        resolve(this)
                });
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

    findByUser(){
        return new Promise( (resolve, reject) =>{
            pool.getConnection( (err, connection) =>{
                if(err) return reject(err)

                let sqlSession = "SELECT cfUtente, pivaFarma FROM session WHERE cfUtente = ? GROUP BY cfUtente, pivaFarma ORDER BY time DESC"
                let sqlMsg = "SELECT * FROM msg WHERE cfUtente = ? AND pivaFarma = ? ORDER BY time DESC LIMIT 1";

                connection.query(sqlSession, [this.cfUtente], 
                    function(err, sessions) {
                        if(err) reject (err)
                        console.log(sessions)
                        Promise.all(sessions.map(({ cfUtente, pivaFarma, time }) => 
                            new Promise((resolve, reject) => {
                                connection.query(sqlMsg, [cfUtente, pivaFarma, time],
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
                    })
                connection.release();
            })
        })
    }

    findByPharma(){
        return new Promise( (resolve, reject) =>{
            pool.getConnection( (err, connection) =>{
                if(err) return reject(err)

                let sqlSession = "SELECT cfUtente, pivaFarma, time FROM session WHERE pivaFarma = ? GROUP BY cfUtente, pivaFarma, time ORDER BY time DESC"
                let sqlMsg = "SELECT * FROM msg WHERE cfUtente = ? AND pivaFarma = ? ORDER BY time DESC LIMIT 1";

                connection.query(sqlSession, [this.pivaFarma], 
                    function(err, sessions) {
                        if(err) reject (err)
                        Promise.all(sessions.map(({ cfUtente, pivaFarma, time }) => 
                            new Promise((resolve, reject) => {
                                connection.query(sqlMsg, [cfUtente, pivaFarma, time],
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
                    })
                connection.release();
            })
        })
    }

    findOpenSessionById(){
        return new Promise( (resolve, reject) => {
            let sql = "SELECT * FROM session WHERE id = ? AND status = 'open'";

            pool.getConnection( (err, connection) => {
                if(err) reject(err)

                connection.query(sql, [this.id],
                    function(err, result){
                        if(err) reject(err)

                        connection.release()
                        resolve(result)
                    })
            })
        })
    }

    findOpenSessionByUser(){
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM session WHERE cfUtente = ? AND status = 'open'";


            pool.getConnection((err, connection) => {
                if(err) return reject(err)
                
                connection.query(sql, [this.cfUtente],
                    function(err, result){
                        if(err) return reject(err)

                        console.log(result)
                        connection.release()
                        resolve(result)
                })
            })
                
        })
    }

    findOpenSessionByPharma(){
        return new Promise((resolve, reject)=>{
            let sql = "SELECT * FROM session WHERE pivaFarma = ? AND status = 'open'";

            pool.getConnection((err, connection)=>{
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
}

export default Session