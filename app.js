const express = require('express');
const bodyParser = require('body-parser');
const server = express();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

var userDb = [];
var ids = 0;


//Craeting a user
server.post('/user', (req, res) => {
    let { username, password } = req.body;
    let newUser = { username, password }
    newUser.id = ++ids;
    userDb.push(newUser);
    res.status(200).json({ status: 'Ok', payload: newUser, message: 'New user successfully created' })
})

//reading all users in database
server.get('/user', (req, res) => {
    res.status(200).json({ status: 'Ok', payload: userDb, message: 'Fetching all users in my database successfully' });
})

//reading a single user with specific id in database
server.get('/user/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (id > 0) {
        for (let i = 0; i < userDb.length; i++) {
            let object = userDb[i];
            if (object.id === id) {
                res.status(200).json({ staus: 'Ok', payload: object, message: 'Single user fetched successfully' });
            }
        }
    } else {
        res.status(200).json({ staus: 'Ok', payload: object, message: 'Error fetching Single user' });
    }
});

//updating
server.put('/user/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (id > 0) {
        for (let i = 0; i < userDb.length; i++) {
            let object = userDb[i];
            if (object.id === id) {
                res.status(200).json({ staus: 'Ok', payload: object, message: 'Single user fetched successfully' });
            }
        }
    } else {
        res.status(200).json({ staus: 'Ok', payload: object, message: 'Error fetching Single user' });
    }
});

//terminating a server process
server.get('/destroy', (req, res) => {
    res.status(200).json({status: 'Sucess', payload: null, message: 'Server killed successfully'});
    process.exit(0);
})

server.listen(3000, () => {
    console.log('Server running port 3000');
});

module.exports.server = server;




// const express = require('express');
// const bodyParser = require('body-parser');

// const server = express();

// server.use(bodyParser.json());
// server.use(bodyParser.urlencoded({extended: true}));

// //My database
// var usersDb = [];

// //my id
// var id = 0;

// //creating
// server.post('/user', (req, res) => {

//     let { username, password } = req.body;
//     let newUser = { username, password };
//     newUser.id = ++id;

//     usersDb.push(newUser);
//     res.status(200).json({status: 'success', payload: newUser, message: 'New user successfully added to db'});
// })

// //reading all
// server.get('/users', (req, res) => {
//     res.status(200).json({status: 'success', payload: usersDb, message: 'All users fetched successfully'});
// })


// server.listen(3030, () => {
//     console.log('Server listening to port 3030');
// })