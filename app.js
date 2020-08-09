const express = require('express');
const server = express();
const UserModel = require('./models/user.model');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
require('./connection')();

const bodyParser = require('body-parser');


server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));



//login in a user
server.post('/user/login', (req, res) => {
    //getting an instance of the username and password
    const { username, password } = req.body;

    //finding the username to authenticate
    UserModel.findOne({ username }, (err, user) => {
        if (err) {
            res.status(500).json({ status: 'failed', payload: null, message: 'Error login a user' });
        }
        //A var that holds the value of the password in the database
        let userDbPassword = user.password;
        //A var to check the encrypted version of the password in the db
        let flag = bcrypt.compareSync(password, userDbPassword);

        if (flag) {
            user.password = '********';

            //generating token form jwt
            let token = jsonwebtoken.sign({ user }, "mySuperSecret1234", { expiresIn: 5 * 60 });
            // console.log(token);
            res.status(200).json({ status: 'success', payload: user, message: 'User logged in successfully' });
        } else {
            res.status(200).json({ status: 'failed', payload: null, message: 'Invalid username or password' });
        }

    })
})

//creating a new user
server.post('/user/register', (req, res) => {
    let newUser = new UserModel(req.body);
    newUser.save((err, result) => {
        if (err) {
            res.status(500).json({ status: 'failed', payload: null, message: 'Error creating a new user' });
        }
        res.status(200).json({ status: 'Success', payload: result, message: 'User created successfully' });
    });
});

//Creating a middle ware

server.use((req, res, next) => {
    const token = req.body.token || req.query.token || req.header['my-token'];
    
    if(token){
        res.status(200).json({ status: 'Success', payload: token, message: 'User created successfully' });
    }else{
        res.status(401).json({ status: 'failed', payload: null, message: 'Please provide a token' });
    }
})

server.get('/', (req, res) => {
    res.json({ status: 'success' });
});

//getting all users
server.get('/user', (req, res) => {
    UserModel.find((err, usersList) => {
        if (err) {
            res.status(500).json({ status: 'failed', payload: null, message: 'Error getting all users' });
        }
        res.status(200).json({ status: 'Success', payload: usersList, message: 'All users fetched successfully' });
    });
});

//getting a single user
server.get('/user/:id', (req, res) => {
    const id = req.params.id;
    if (id) {
        UserModel.findById(id, (err, singleUser) => {
            if (err) {
                res.status(500).json({ status: 'failed', payload: null, message: err });
            }
            return res.status(200).json({ status: 'success', payload: singleUser, message: 'Single user fetched Successfully!' });
        });
    } else {
        res.status(500).json({ status: 'failure', payload: null, message: 'Invalid User id to fetch' });
    }
});

//Updating users by id
server.put('/user/:id', (req, res) => {
    const id = req.params.id;
    const { password, fname, lname } = req.body;

    let newUserData = req.body;
    if (id) {
        UserModel.findByIdAndUpdate(id, { $set: { password, fname, lname } }, { new: true }, (err, updatedUser) => {
            if (err) {
                res.status(500).json({ status: 'failed', payload: null, message: err });
            }
            return res.status(200).json({ status: 'success', payload: updatedUser, message: 'User updated Successfully!' });
        });
    } else {
        res.status(500).json({ status: 'failure', payload: null, message: 'Invalid User id to fetch' });
    }
});

//deleting
server.delete('/user/:id', (req, res) => {
    const id = req.params.id;
    if (id) {
        UserModel.findOneAndDelete(id, (err, result) => {
            if (err) {
                res.status(500).json({ status: 'failed', payload: null, message: err });
            }
            res.status(200).json({ status: 'success', payload: null, message: 'User Deleted Successfully!' });
        })
    } else {
        res.status(500).json({ status: 'failure', payload: null, message: 'Invalid User id to Update' });
    }
});

server.listen(3030, () => {
    console.log('Server listening to port 3030');
});

