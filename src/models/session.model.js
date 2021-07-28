import pool from '../helpers/mysql.js';
import { InternalError, ResourceNotFound } from '../helpers/Errors.js';

class Session {
    constructor(session){
        return new Promise( (resolve) =>{
            this.id = session.id
            this.cfUtente = session.cfUtente
            this.time = session.time || new Date(Date.now())
            this.pivaFarma = session.pivaFarma
            this.stato = "open"
            resolve(this)
        })
        
    }

    create(){
        return new Promise( (resolve, reject) =>{
            this.exist()
            .then((result)=> {
                if(result.length != 0) return resolve(result[0])

                let sql = "INSERT INTO session SET ?";
    
                pool.query(sql, [this],
                    (err, result) => {
                        if(err) reject(err);
    
                        this.id = result.insertId;
                        resolve(this)
                    });
            })
        })
    }

    exist(){
        return new Promise((resolve, reject) =>{
            let sql = "SELECT * FROM session WHERE cfUtente = ? AND pivaFarma = ? AND  `stato` = 'open'";

            pool.query(sql, [this.cfUtente, this.pivaFarma],
                (err, result)=>{
                    if(err) reject(err)

                    resolve(result)
                })
        })
    }

    findById(){
        return new Promise( (resolve, reject) =>{
            let sql = "SELECT * FROM session WHERE id = ?";

            pool.query(sql, [this.id], 
                function(err, result){
                    if(err) reject(err);
                    if(result.lenght == 0) reject(new ResourceNotFound("session", sql + ": findById"))
                    
                    resolve(result);
                })
        })
    }

    findByBoth(){
        return new Promise((resolve, reject)=>{
            let sql = "SELECT id FROM session WHERE cfUtente = ? AND pivaFarma = ?";

            pool.query(sql, [this.cfUtente, this.pivaFarma],
                function(err, result){
                    if(err) reject(err)
                    if(result.length == 0) reject(new ResourceNotFound("session", sql + ": findByBoth"));

                    resolve(result)
                })
        })
    }

    findByUser(){
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM session WHERE cfUtente = ? ORDER BY time DESC";

            pool.query(sql, [this.cfUtente],
                function(err, result){
                    if(err) reject(err)
                    if(result.length == 0) reject(new ResourceNotFound("session", sql + ": findByUser"));

                    resolve(result)
                })
        })
    }

    findByPharma(){
        return new Promise((resolve, reject) => {
            let sql = "SELECT id, cfUtente, pivaFarma FROM session WHERE pivaFarma = ? ORDER BY time DESC";

            pool.query(sql, [this.pivaFarma],
                function(err, result){
                    if(err) reject(err)
                    if(result.length == 0) reject(new ResourceNotFound("session", sql + ": findByPharma"));

                    resolve(result)
                })
        })
    }

    findOpenSessionByUser(){
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM session WHERE cfUtente = ? AND stato = 'open'";

            pool.query(sql, [this.cfUtente],
                function(err, result){
                    if(err) reject(err)
                    if(result.length == 0) reject(new ResourceNotFound("session", sql + ": findOpenSessionByUser"));

                    resolve(result)
                })
        })
    }

    findOpenSessionByPharma(){
        return new Promise((resolve, reject) => {
            let sql = "SELECT * FROM session WHERE pivaFarma = ? AND stato = 'open'";

            pool.query(sql, [this.pivaFarma],
                function(err, result){
                    if(err) reject(err)
                    if(result.length == 0) reject(new ResourceNotFound("session", sql + ": findOpenSessionByPharma"));

                    resolve(result)
                })
        })
    }

    findOpenSessionByBoth(){
        return new Promise((resolve, reject) =>{
            let sql = "SELECT * FROM session WHERE cfUtente = ? AND pivaFarma = ? AND stato = 'open'";


            pool.query(sql, [this.cfUtente, this.pivaFarma],
                function(err, result){
                    if(err) reject(err)
                    //if(result.length == 0) reject(new ResourceNotFound("session", sql + ": findOpenSessionByBoth"));

                    resolve(result)
                })
        })
    }

    sessionClose(){
        return new Promise((resolve, reject) => {
            let sql = "UPDATE session SET stato = 'closed' WHERE id = ?";

            pool.query(sql, [this.id],
                (err)=>{
                    if(err) reject(err)

                    this.stato = 'closed';
                    resolve(this)
                })
        })
    }
}

export default Session