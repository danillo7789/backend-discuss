const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const crypto = require('crypto');

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

function generateRandomNumberToken(length) {
    const bytes = crypto.randomBytes(length);
    let token = '';
  
    for (let i = 0; i < bytes.length; i++) {
      token += Math.floor(bytes[i] / 256 * 10);
    }
    //so the length is not more than specified length
    return token.slice(0, length);
  }

// create a password token
userSchema.methods.passwordReset = function resetPassword() {
    this.passwordResetToken = generateRandomNumberToken(6);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  };

module.exports = mongoose.model('User', userSchema);