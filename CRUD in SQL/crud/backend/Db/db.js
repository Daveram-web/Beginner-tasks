import mysql from 'mysql'

const pool =  mysql.createPool({
    host : "localhost",
    user : "root",
    password : "",
    database : "test"
})

pool.getConnection(
    (err)=>{
        if(err){
            console.log("Error in connecting the DB ");            
        }
        else
        console.log("DB has Connected ...");
        
    }
)

export default pool;