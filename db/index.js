const { Client } = require('pg');

const client = new Client('postgres://localhost:5432/juicebox-dev')

async function getAllUsers(){
    const {rows} = await client.query(`SELECT *  FROM users;`)
    return rows;
}

async function createUsers({username, password,name,location}){
    try{
        const {rows} = await client.query(
            `INSERT INTO users (name,username,password,location) VALUES ($1, $2,$3,$4)
            ON CONFLICT (username) DO NOTHING
            RETURNING *;`
            ,[name,username,password,location]);
            return rows;
    }catch(e){
        throw e;
    }
}


module.exports = {  
    client,
    createUsers,
    getAllUsers,
  }