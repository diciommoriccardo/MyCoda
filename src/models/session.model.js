import pool from '../helpers/mysql.js';

class Session {
    constructor(session){
        return new Promise( (resolve) =>{
            this.cfUtente = session.cfUtente
            this.time = new Date(Date.now())
            this.pivaFarma = session.pivaFarma
            this.status = "OPEN"
            resolve(this)
        })
        
    }

    create(){
        return new Promise( (resolve, reject) =>{
            pool.getConnection((err, connection) => {
                if(err) reject(err)

                let sqlExist = 'SELECT * FROM farma WHERE piva = ?';

                connection.query(sqlExist, this.pivaFarma, 
                    (err, result)=>{
                        if(err) reject(err)
                        if(result.length==0) reject(new Error("Farmacia non esistente"))

                        connection.query('INSERT INTO session SET ?', [this],
                            (err) => {
                                if(err) reject(err)

                                resolve(this)
                            });
                    });
                    connection.release()
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
            pool.getConnection( (err, connection) =>{
                if(err) return reject(err)

                let sqlSession = "SELECT cfUtente, pivaFarma, time FROM session WHERE cfUtente = ? GROUP BY cfUtente, pivaFarma, time ORDER BY time DESC"
                let sqlMsg = "SELECT * FROM msg WHERE cfUtente = ? AND pivaFarma = ? ORDER BY time DESC LIMIT 1";

                connection.query(sqlSession, [this.cfUtente], 
                    function(err, sessions) {
                        if(err) reject (err)
                        Promise.all(sessions.map(({ cfUtente, pivaFarma, time }) => 
                            new Promise((resolve, reject) => {
                                connection.query(sqlMsg, [cfUtente, pivaFarma, time],
                                    (err, msg) => {
                                        if (err) reject(err)
                                        resolve({
                                            cfUtente,
                                            pivaFarma,
                                            time,
                                            message: msg,
                                        });
                                    }
                                );
                            }
                        )))
                        .then(result => resolve(result))
                        .catch(error => reject(error));
                    })
<<<<<<< HEAD
                connection.release();
=======
                        connection.release();
                        resolve(res);
                })
>>>>>>> b28a36e337e82e2d3afb51fa9ea57d7d4cf26163
            })
        })
    }

    findByPharma(){
        return new Promise( (resolve, reject) =>{
            let sql = "SELECT * FROM session WHERE pivaFarma = ?"

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

    findOpenSessionById(){
        return new Promise( (resolve, reject) => {
            let sql = "SELECT * FROM session WHERE cfUtente = ? AND pivaFarma = ? AND status = 'OPEN'";

            pool.getConnection( (err, connection) => {
                if(err) return reject(err)

                connection.query(sql, [this.cfUtente,this.pivaFarma],
                    function(err, result){
                        if(err) return reject(err)

                        connection.release()
                        resolve(result)
                    })
            })
        })
    }

    findOpenSessionByUser(){
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM session WHERE cfUtente = ? AND status = 'OPEN'";


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
            let sql = "SELECT * FROM session WHERE pivaFarma = ? AND status = 'OPEN'";

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