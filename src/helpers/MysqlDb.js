import mysql from 'mysql';
import { DATABASE } from '../config/config.js';
import SUCCESS_ITA from '../config/constants.js';

class MysqlDb{
    constructor(){

        let connectionString = mysql.createConnection({
            host : DATABASE.HOST,
            user : DATABASE.USER,
            password : DATABASE.PASS
        });

        return new Promise(function(resolve, reject){
            connectionString.connect(function(error){
                if(error){
                    console.error("error connecting : " + error.stack);
                    return
                }

                console.log("connected as id : " + connectionString.threadId)
            })
        });
    }
}

export default MysqlDb;