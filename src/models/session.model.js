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

    // findByUser(){
    //     return new Promise( (resolve, reject) =>{
    //         pool.getConnection( (err, connection) =>{
    //             if(err) return reject(err)

    //             connection.beginTransaction(err =>{
    //                 if(err) return reject(err)

    //                 let sql = "SELECT * FROM session WHERE cfUtente = ? GROUP BY cfUtente, pivaFarma, time"

    //                 connection.query(sql, connection.escape(this.cfUtente), 
    //                     function(err, result){
    //                         if(err){
    //                             connection.rollback(err =>{
    //                                 return reject(err)
    //                             })
    //                         }

    //                         var 
    //                 })
    //             })  
    //         })
    //     })
    // }

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