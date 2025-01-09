import mysql from 'mysql'

const pool = mysql.createPool({
    host : "localhost",
    user : "root",
    password : "",
    database :"test"
})

pool.getConnection(
    (errro)=>{
        if(errro){
            console.log("Error :",errro);            
        }
        else{
            console.log("Db connectted ....");
            
        }
    }
)

export default pool;