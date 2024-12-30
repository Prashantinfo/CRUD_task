// const bcrypt = require('bcrypt');

// const hashPassword = async (password) => {
//     const salt = await bcrypt.genSalt(10);
//     return bcrypt.hash(password, salt);
// };

// module.exports = {
//     hashPassword
// };
const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const key = Buffer.from('12345678901234567890123456789012'); 
const iv = Buffer.from('1234567890123456'); 

// Encrypt function
const hashPassword = async(text) => {
    const cipher = await crypto.createCipheriv(algorithm, key, iv);
    let encrypted = await cipher.update(text, 'utf8', 'hex');
    encrypted += await cipher.final('hex');
    return { encryptedData: encrypted, iv: iv.toString('hex') };
};
const decryptPassword = (encryptedText) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
module.exports = {
    hashPassword,
    decryptPassword
};

