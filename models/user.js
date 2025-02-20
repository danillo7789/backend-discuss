const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    about: {
        type: String,
        default: ''
    },
    profilePicture: {
        url: {
            type: String
        },
        name: {
            type: String
        }
    },
}, { timestamps: true });

userSchema.pre('save', async function(next){
    //if d password is nt changed, do not hash it
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
});

module.exports = mongoose.model('User', userSchema);