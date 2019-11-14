const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('Se ha perdido la conexion con la base de datos');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.error('La base de datos tiene varias conexiones');
        }
        if(err.code === 'ECONNREFUSED'){
            console.error('La conexion ha sido rechazada, verifique credenciales de la base de datos');
        }
    }

    if(connection){
        connection.release();
        console.log('Conexion exitosa !');
        return;
    }
});

// promisyfy pool querys
pool.query = promisify(pool.query);

module.exports = pool;