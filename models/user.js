const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true, // implicitly creates an index
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: String,    
    passwordResetToken: String,
    passwordResetExpires: Date,
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
    googleId: String
}, { timestamps: true });

userSchema.pre('save', async function(next){
    //if d password is nt changed, do not hash it
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

function generateRandomOnlyNumberToken(length) {
    return Array.from({ length }, () => crypto.randomInt(0, 10)).join('');
  }

// create a password token
userSchema.methods.passwordReset = function resetPassword() {
    this.passwordResetToken = generateRandomOnlyNumberToken(6);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
};

module.exports = mongoose.model('User', userSchema);