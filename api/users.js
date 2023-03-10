const express = require('express');
const jwt= require('jsonwebtoken');
const usersRouter = express.Router();
const { getAllUsers,getUserByUsername,createUsers } = require('../db');
usersRouter.use((req, res, next) => {
  console.log("A request is being made to /users");

  
  next();
});

usersRouter.get('/', async (req, res) => {
    const users = await getAllUsers();
  
    res.send({
      users
    });
  });

  usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    
  
    // request must have both
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
      });
    }
  
    try {
      const user = await getUserByUsername(username);
      
      if (user && user.password == password) {
        // create token & return to user
        const token = jwt.sign({id:user.id, username:user.username},process.env.JWT_SECRET);
      const recoveredData = jwt.verify(token,process.env.JWT_SECRET)
        res.send({ message: "you're logged in!",
                    token:token
      });
      } else {
        next({ 
          name: 'IncorrectCredentialsError', 
          message: 'Username or password is incorrect'
        });
      }

    //const token = jwt.sign({id:user.id, username:user.username},"JWT_SECRET");
    //const recoveredData = jwt.verify(token,"JWT_SECRET")
    
    } catch(error) {
      console.log(error);
      next(error);
    }
  });
  usersRouter.post('/register', async (req, res, next) => {
    const { username, password, name, location } = req.body;
  
    try {
      const _user = await getUserByUsername(username);
  
      if (_user) {
        next({
          name: 'UserExistsError',
          message: 'A user by that username already exists'
        });
      }
  
      const user = await createUsers({
        username,
        password,
        name,
        location,
      });
  
      const token = jwt.sign({ 
        id: user.id, 
        username
      }, process.env.JWT_SECRET, {
        expiresIn: '1w'
      });
  
      res.send({ 
        message: "thank you for signing up",
        token 
      });
    } catch ({ name, message }) {
      next({ name, message })
    } 
  });

module.exports = usersRouter;
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJzeXp5Z3lzIiwiaWF0IjoxNjc0MTczNTQyLCJleHAiOjE2NzQ3NzgzNDJ9.UI0tAj2U41aegegX09FLEdCzBQ8Z75LhVwrSGKWthUM
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhbGJlcnQiLCJpYXQiOjE2NzQxNzMxNTh9.ESIBjdE8Wlgx2HSbcFJdp3JANvJIiw2D2wL1-hyfhyg