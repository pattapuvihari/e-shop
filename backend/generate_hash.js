const bcrypt = require('bcryptjs');
const salt = '$2a$10$abcdefghijklmnopqrstuv';
const hash = bcrypt.hashSync('password123', salt);
console.log(hash);
