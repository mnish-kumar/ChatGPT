const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required to be add in blacklist"],
        index: true,
        unique: true,
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 15 * 60 * 1000),
    }
}, { timestamps: true });

// Automatically remove expired blacklisted tokens
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const blacklistTokenSchema = mongoose.model('BlacklistToken', tokenSchema);

module.exports = blacklistTokenSchema;