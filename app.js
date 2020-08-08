const express = require('express');
const server = express();
const UserModel = require('./models/user.model');
require('./connection')();

const bodyParser = require('body-parser');


server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true}));

server.get('/', (req, res) => {
    res.json({ status: 'success' });
});


//creating a new user
server.post('/user', (req, res) => {
    let newUser = new UserModel(req.body);
    newUser.save((err, result) => {
        if(err){
            res.status(500).json({status: 'failed', payload: null, message: 'Error creating a new user'});
        }
        res.status(200).json({status: 'Success', payload: result, message: 'User created successfully'});
    });
});

//getting all users
server.get('/user', (req, res) => {
    UserModel.find((err, usersList) => {
        if(err){
            res.status(500).json({status: 'failed', payload: null, message: 'Error getting all users'});
        }
        res.status(200).json({status: 'Success', payload: usersList, message: 'All users fetched successfully'});
    });
});

//getting a single user
server.get('/user:id', (req, res) => {
    const id = req.params.id;
    if(id){
        UserModel.findById((err, oneUser) => {
            if(err){
                res.status(500).json({status: 'failed', payload: null, message: 'Error getting single users'});
            }
            res.status(200).json({status: 'Success', payload: oneUser, message: 'Single user fetched successfully'});
        });
    }
    res.status(500).json({status: 'failed', payload: null, message: 'Error getting single user'});
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

