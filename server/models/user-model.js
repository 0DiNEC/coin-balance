const { Schema, model } = require('mongoose');
const UserSchema = new Schema({
  name: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
});

module.exports = model('User', UserSchema);
