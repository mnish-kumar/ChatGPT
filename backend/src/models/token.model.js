const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required to be add in blacklist"],
    }
}, { timestamps: true });

const blacklistTokenSchema = mongoose.model('BlacklistToken', tokenSchema);

module.exports = blacklistTokenSchema;