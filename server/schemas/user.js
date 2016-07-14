/**
 * Created by nizhiwang on 16/5/20.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: [true, 'existed user'],
        validate: {
            validator: function (v) {
                return /[a-zA-Z][\w\-_$]{3,20}/.test(v);
            },
            message: '{VALUE} must a valid name'
        }

    },
    password: {type: String, maxLength: 20},
    role: {
        type: Number,
        default: 0,

    },
    meta: {
        creatAt: {
            type: Date,
            default: Date.now(),
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

UserSchema.pre('save', function (next) {
    var user = this;
    console.log('pre save');
    console.log(this)
    // console.log(this.validateSync().errors['name'].message);
    if (user.isNew) {
        user.meta.createAt = user.meta.updateAt = Date.now()
    }
    else {
        user.meta.updateAt = Date.now();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        })
    });

});

UserSchema.methods = {
    comparePassword: function (ps, cb) {
        bcrypt.compare(ps, this.password, function (err, isMatch) {
            if (err) cb(err);
            cb(null, isMatch);
        })
    }
}

UserSchema.statics = {
    fetch: function (cb) {
        return this.find({}).sort('meta.updateAt')
            .exec(cb);
    },
    findById: function (id, cb) {
        return findOne({_id: id})
            .exec(cb);
    }
}

module.exports = UserSchema;