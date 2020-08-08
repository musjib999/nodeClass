const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema ({
    username: {type: String, required: true},
    password: {type: String, required: true},
    fname: {type: String, required: true},
    lname: {type: String, required: true},
    fullName: {type: String, default: ''},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});


UserSchema.pre('save', function (next) {
    let me = this;
    let salt;
    me.fullName = me.fname + ', ' + me.lname;
    try {
        salt = bcrypt.genSaltSync();
        me.password = bcrypt.hashSync(me.password, salt);
        console.log('Middleware called >> ', me);
    } catch (err) {
        console.log("ERRRRRRRRR >>>> ", err);
    }

    next();
})

module.exports = mongoose.model('User', UserSchema);