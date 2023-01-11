const {
    client,
    getAllUsers,
    createUsers,
  } = require('./index');

  async function createInitialUsers(){
    try{
        console.log('starting to create users...');

        const albert = await createUsers({name: 'albert', username: 'albert', password: 'bertie99', location: 'texas'});
        const sandra = await createUsers({ name: 'sandy', username: 'sandra', password: 'sandra',location: 'texas'});
        const glamgal = await createUsers({ name: 'girl', username: 'glamgal', password: 'glamgal', location: 'texas'});
        
        
        console.log("Finished creating users!")
    }catch(error){
        console.error("Error creating users!");
        throw error;
    }
  }
  
  async function dropTables() {
    try {
      console.log("Starting to drop tables...");
  
      await client.query(`
        DROP TABLE IF EXISTS users;
      `);
  
      console.log("Finished dropping tables!");
    } catch (error) {
      console.error("Error dropping tables!");
      throw error;
    }
  }
  
  async function createTables() {
    try {
      console.log("Starting to build tables...");
  
      await client.query(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name varchar(255) NOT NULL,
          username varchar(255) UNIQUE NOT NULL,
          password varchar(255) NOT NULL,
          location varchar(255) NOT NULL,
          active BOOLEAN DEFAULT true
        );
      `);
  
      console.log("Finished building tables!");
    } catch (error) {
      console.error("Error building tables!");
      throw error;
    }
  }
  
  async function rebuildDB() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
      await createInitialUsers();
    } catch (error) {
      throw error;
    }
  }
  
  async function testDB() {
    try {
      console.log("Starting to test database...");
  
      const users = await getAllUsers();
      console.log("getAllUsers:", users);
  
      console.log("Finished database tests!");
    } catch (error) {
      console.error("Error testing database!");
      throw error;
    }
  }
  
  
  rebuildDB()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end());