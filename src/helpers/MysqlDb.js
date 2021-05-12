import mysql from 'mysql';
import { DATABASE } from '../config/config.js';
import {SUCCESS_ITA} from '../config/constants.js';

var pool = mysql.createPool({
    connectionLimit : 10,
    host : DATABASE.HOST,
    user : DATABASE.USER,
    password : DATABASE.PASS,
    database : DATABASE.NAME
})


export default pool;